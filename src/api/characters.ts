import {http} from "./api";

export const fetchChar = (id: number) =>
    http.get(`characters/${id}`)
        .then(res => res.data.data);

export const fetchCharNovels = (id: number) =>
    http.get(`characters/${id}/novels`)
        .then(res => res.data.data);