import { Chat, HelpRequest, User } from '@prisma/client';

export interface UserState {
  user: User | null;
  jwt: string | null;
  error: string | null;
  loading: boolean;
}

export interface ChatsState {
  chats: Chat[];
}

export interface HelpRequestsState {
  helpRequests: HelpRequest[];
}
