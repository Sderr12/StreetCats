export type CreateComment = {
  content: string;
}


export type commentDTO = CreateComment & {
  user: {
    username: string;
    avatarUrl: string | null;
  }
}
