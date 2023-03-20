import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { firstValueFrom } from 'rxjs';

import { RedisCacheService, UserJwt } from '@app/shared';

import { ChatService } from './chat.service';
import { NewMessageDTO } from './dtos/NewMessage.dto';
import { CallDetailsDTO } from './dtos/CallDetails.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
    private readonly cache: RedisCacheService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleDisconnect(socket: Socket) {
    console.log('HANDLE DISCONNECT - CONVO');
  }

  async handleConnection(socket: Socket) {
    console.log('HANDLE CONNECTION - CONVO');

    const jwt = socket.handshake.headers.authorization ?? null;

    if (!jwt) {
      this.handleDisconnect(socket);
      return;
    }

    const ob$ = this.authService.send<UserJwt>({ cmd: 'decode-jwt' }, { jwt });
    const res = await firstValueFrom(ob$).catch((err) => console.error(err));

    if (!res || !res?.user) {
      this.handleDisconnect(socket);
      return;
    }

    const { user } = res;

    socket.data.user = user;

    await this.setConversationUser(socket);

    await this.createConversations(socket, user.id);

    await this.getConversations(socket);
  }

  private async createConversations(socket: Socket, userId: number) {
    const ob2$ = this.authService.send(
      {
        cmd: 'get-friends-list',
      },
      {
        userId,
      },
    );

    const friends = await firstValueFrom(ob2$).catch((err) =>
      console.error(err),
    );

    friends.forEach(async (friend) => {
      await this.chatService.createConversation(userId, friend.id);
    });
  }

  private async setConversationUser(socket: Socket) {
    const user = socket.data?.user;

    if (!user || !user.id) return;

    const conversationUser = { id: user.id, socketId: socket.id };

    await this.cache.set(`conversationUser ${user.id}`, conversationUser);
  }

  private async getFriendDetails(id: number) {
    const ob$ = this.presenceService.send(
      {
        cmd: 'get-active-user',
      },
      { id },
    );

    const activeFriend = await firstValueFrom(ob$).catch((err) =>
      console.error(err),
    );

    if (!activeFriend) return;

    const friendsDetails = (await this.cache.get(
      `conversationUser ${activeFriend.id}`,
    )) as { id: number; socketId: string } | undefined;

    return friendsDetails;
  }

  @SubscribeMessage('getConversations')
  async getConversations(socket: Socket) {
    const { user } = socket.data;

    if (!user) return;

    const conversations = await this.chatService.getConversations(user.id);

    this.server.to(socket.id).emit('getAllConversations', conversations);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, newMessage: NewMessageDTO) {
    if (!newMessage) return;

    const { user } = socket.data;

    if (!user) return;

    const createdMessage = await this.chatService.createMessage(
      user.id,
      newMessage,
    );

    const friendId = createdMessage.conversation.users.find(
      (u) => u.id !== user.id,
    ).id;

    const friendDetails = await this.getFriendDetails(friendId);

    if (!friendDetails) return;

    const { id, message, user: creator, conversation } = createdMessage;

    this.server.to(friendDetails.socketId).emit('newMessage', {
      id,
      message,
      creatorId: creator.id,
      conversationId: conversation.id,
    });
  }

  @SubscribeMessage('ping')
  async ping(socket: Socket) {
    console.log('Keep socket connection alive!');
  }

  @SubscribeMessage('startCall')
  async startCall(socket: Socket, callDetails: CallDetailsDTO) {
    const { user } = socket.data;

    if (!user || !callDetails) return;

    const friendDetails = await this.getFriendDetails(callDetails.friendId);

    if (!friendDetails) return;

    const userCallDetails = {
      meetingId: callDetails.meetingId,
      friendId: user.id,
    };

    this.server.to(friendDetails.socketId).emit('receiveCall', userCallDetails);
  }

  @SubscribeMessage('declineCall')
  async declineCall(socket: Socket, friendId: number) {
    const friendDetails = await this.getFriendDetails(friendId);

    this.server.to(friendDetails.socketId).emit('callResponse', {
      status: 'DECLINED',
    });
  }

  @SubscribeMessage('acceptCall')
  async acceptCall(socket: Socket, friendId: number) {
    const friendDetails = await this.getFriendDetails(friendId);

    this.server.to(friendDetails.socketId).emit('callResponse', {
      status: 'ACCEPTED',
    });
  }
}
