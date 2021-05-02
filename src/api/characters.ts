import { del, get, post, put } from "./api";

export const fetchChars = () => get<Unmei.CharacterType[]>('characters');
export const createChar = (char: Unmei.CharacterType) => post<Unmei.CharacterType>('chars', char);

export const fetchChar = (id: number) => get<Unmei.CharacterType>(`characters/${id}`);
export const deleteChar = (id: number) => del(`characters/${id}`);
export const updateChar = (char: Unmei.CharacterType) => put<Unmei.CharacterType>(`characters/${char.id}`, char);

export const fetchCharNovels = (id: number) => get<Unmei.NovelType[]>(`characters/${id}/novels`);
