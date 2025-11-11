interface Cat {
  id: number;
  name: string;
  image: string;
  distance?: number;
}


interface catDTO {
  name: string;
  image?: string;
  longitude: number;
  latitude: number;
}
