export interface Cat {
  id: number;
  name: string;
  image: string;
  distance?: number;
}


export interface CatDTO {
  name: string;
  image?: string;
  longitude: number;
  latitude: number;
}
