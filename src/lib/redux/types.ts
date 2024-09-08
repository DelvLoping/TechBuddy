import { Chat, HelpRequest, User, UserType } from '@prisma/client';

export interface UserState {
  user: UserType | null;
  jwt: string | null;
  error: string | null;
  loading: boolean;
}

export interface ChatsState {
  chats: Chat[];
  error: string | null;
  loading: boolean;
}

export interface HelpRequestsState {
  helpRequests: HelpRequest[];
  error: string | null;
  loading: boolean;
}
