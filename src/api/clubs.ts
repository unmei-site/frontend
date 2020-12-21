import { get } from "./api";

export const getClub = (id: number) => get<ClubType>(`/clubs/${id}`);
