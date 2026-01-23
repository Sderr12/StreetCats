export type UserDTO = {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
}

export type UserCredentialsDTO = UserDTO & {
  password: string;
}

export function toUserDTO(user: UserCredentialsDTO): UserDTO {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function toUserCredentialsDTO(user: UserCredentialsDTO): UserCredentialsDTO {
  return user;
}
