import { get } from "./api";

export const fetchChar = (id: number) => get<CharacterType>(`characters/${id}`);
export const fetchCharNovels = (id: number) => get<NovelType[]>(`characters/${id}/novels`);
