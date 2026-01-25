export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  author: {
    username: string;
    avatarUrl?: string;
  };
};


