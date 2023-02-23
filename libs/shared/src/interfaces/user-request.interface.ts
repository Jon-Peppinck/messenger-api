import { Request } from 'express';

export interface UserRequest extends Request {
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}
