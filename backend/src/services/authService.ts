import bcrypt from "bcrypt";
import type { UserRepository } from "../interfaces/repositories/user.repository.js";
import {
  toUserDTO,
  type UserDTO,
  type UserCredentialsDTO
} from "../interfaces/dto/user.dto.js";

export class AuthService {
  private readonly repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  private async hashPassword(plainTextPassword: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltRounds);
  }

  private async validatePassword(
    candidatePassword: string,
    storedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, storedPassword);
  }

  public async register(
    data: { username: string; email: string; password: string },
    avatarUrl?: string
  ): Promise<UserDTO> {
    const hashedPassword = await this.hashPassword(data.password);

    const user = await this.repo.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      avatarUrl: avatarUrl
    });

    return user;
  }

  public async login(email: string, password: string): Promise<UserDTO> {
    const userWithPassword = await this.repo.findByEmail(email);

    if (!userWithPassword) {
      throw new Error("Email not found");
    }

    const isValid = await this.validatePassword(password, userWithPassword.password);

    if (!isValid) {
      throw new Error("Wrong password!");
    }

    return toUserDTO(userWithPassword);
  }
}
