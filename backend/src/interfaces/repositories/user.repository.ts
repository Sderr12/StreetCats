import type { UserCredentialsDTO, UserDTO } from "../dto/user.dto.ts"

export interface UserRepository {

  findByEmail(email: string): Promise<UserCredentialsDTO | null>;

  create(data: {
    username: string;
    email: string;
    password: string;
    avatarUrl?: string;
  }): Promise<UserDTO>;

}
