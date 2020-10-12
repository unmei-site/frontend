import { get, post, put, del } from "./api";


export const fetchNovels = (orderBy?: string) => get<NovelType[]>(orderBy ? `novels?sort=${orderBy}` : 'novels');
export const createNovel = (novel: NovelType) => post<NovelType>('novels', { ...novel });

export const fetchNovel = (id: number) => get<NovelType>(`novels/${id}`);
export const updateNovel = (id: number, novel: NovelType) => put<NovelType>(`novels/${id}`, { ...novel });

export const fetchNovelCharacters = (id: number) => get<CharacterType[]>(`novels/${id}/characters`);

export const fetchNovelGenres = (id: number) => get<GenreType[]>(`novels/${id}/genres`);

export const fetchNovelComments = (id: number, offset=0, count=5) => get<CommentsResponse>(`novels/${id}/comments?offset=${offset}&count=${count}`);
export const postNovelComment = (id: number, text: string) => post<CommentType>(`novels/${id}/comments`, { text });

export const fetchUserNovel = (userId: number, novelId: number) => get<UserNovelType>(`users/${userId}/novels/${novelId}`);
export const createUserNovel = (userId: number, novelId: number, status='planned') => post<UserNovelType>(`users/${userId}/novels`, { novel_id: Number(novelId), status });
export const updateUserNovel = (userId: number, novelId: number, data: { mark?: number; status?: string }) => put<UserNovelType>(`users/${userId}/novels/${novelId}`, data);
export const deleteUserNovel = (userId: number, novelId: number) => del(`users/${userId}/novels/${novelId}`);
