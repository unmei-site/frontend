import { get } from "./api";

export const getClubs = () => get<Unmei.ClubType[]>('/clubs');
export const getClub = (id: number) => get<Unmei.ClubType>(`/clubs/${id}`);
