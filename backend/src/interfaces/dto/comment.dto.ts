export type CreateComment = {
  content: string;
}


export type commentDTO = CreateComment & {
  id: number,
  user: {
    username: string;
    avatarUrl: string | null;
  }
  createdAt: string;
}
