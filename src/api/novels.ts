import { get, post, put, del } from "./api";


export const fetchNovels = (orderBy?: string) => get(orderBy ? `novels?sort=${orderBy}` : 'novels');
export const createNovel = (novel: NovelType) => post('novels', { ...novel });

export const fetchNovel = (id: number) => get(`novels/${id}`);
export const updateNovel = (id: number, novel: NovelType) => put(`novels/${id}`, { ...novel });

export const fetchNovelCharacters = (id: number) => get(`novels/${id}/characters`);

export const fetchNovelGenres = (id: number) => get(`novels/${id}/genres`);

export const fetchNovelComments = (id: number, offset=0, count=5) => get(`novels/${id}/comments?offset=${offset}&count=${count}`);
export const postNovelComment = (id: number, text: string) => post(`novels/${id}/comments`, { text });

export const fetchUserNovel = (userId: number, novelId: number) => get(`users/${userId}/novels/${novelId}`);
export const createUserNovel = (userId: number, novelId: number, status='planned') => post(`users/${userId}/novels`, { novel_id: Number(novelId), status });
export const updateUserNovel = (userId: number, novelId: number, data: { mark?: number; status?: string }) => put(`users/${userId}/novels/${novelId}`, data);
export const deleteUserNovel = (userId: number, novelId: number) => del(`users/${userId}/novels/${novelId}`);