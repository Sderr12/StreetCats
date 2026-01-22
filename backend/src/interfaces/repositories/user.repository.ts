import { User } from "@prisma/client";

export interface UserRepository {

  findByEmail(email: string): Promise<User | null>;
  
  create(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<User>;

}
