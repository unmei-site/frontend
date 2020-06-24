import {get} from "./api";

export const fetchChar = (id: number) => get(`characters/${id}`);
export const fetchCharNovels = (id: number) => get(`characters/${id}/novels`);