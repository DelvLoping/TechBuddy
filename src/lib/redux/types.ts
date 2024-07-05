import { User, UserType } from "@prisma/client";

export interface UserState {
  user: UserType | null;
  jwt: string | null;
  error: string | null;
  loading: boolean;
}
