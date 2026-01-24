export type catDTO = {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  photo: string;
  createdAt: string;
  user: string;
}


export type CreateCatDTO = {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}
