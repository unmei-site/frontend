import { get } from "./api";

export const getClubs = () => get<ClubType[]>('/clubs');
export const getClub = (id: number) => get<ClubType>(`/clubs/${id}`);
