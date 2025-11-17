export interface Cat {
  id: number;
  name: string;
  image: string;
  description: string;
  distance?: number;
}


export interface CatDTO {
  name: string;
  image?: string;
  description: string;
  longitude: number;
  latitude: number;
}
