
export enum RidingPace {
  TRANQUILLO = 'Tranquillo',
  ALLEGRO = 'Allegro',
  SPORTIVO = 'Sportivo',
  TURISTICO = 'Turistico'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  bike?: string;
  birthYear?: string;
  gender?: string;
  region?: string;
  bio?: string;
  preferredRiding?: string;
  preferredTerrain?: string;
  experienceLevel?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Ride {
  id: string;
  title: string;
  country: string;
  region: string;
  province: string;
  location: string;
  departurePoint: string;
  departureTime: string;
  description: string;
  pace: RidingPace;
  organizer: User;
  participants: User[];
  comments: Comment[];
  imageUrl: string;
  mapCoords: { lat: number; lng: number };
}

export interface GeoFilter {
  region: string;
  province: string;
  location: string;
}
