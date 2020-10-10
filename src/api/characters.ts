import {get} from "./api";

export const fetchChar: FetchChar = (id: number) => get(`characters/${id}`);
export const fetchCharNovels: FetchCharNovels = (id: number) => get(`characters/${id}/novels`);
