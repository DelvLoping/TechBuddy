import { User } from "@prisma/client";

export interface UserState {
  user: User | null;
  jwt: string | null;
  error: string | null;
  loading: boolean;
}
