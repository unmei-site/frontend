import { del, get, post, put } from "./api";


export const fetchNovels = (orderBy?: string) => get<Unmei.NovelType[]>(orderBy ? `novels?sort=${orderBy}` : 'novels');
export const searchNovel = (query: string) => get<Unmei.NovelType[]>(`novels?q=${query}`);
export const createNovel = (novel: Unmei.NovelType) => post<Unmei.NovelType>('novels', novel);

export const fetchNovel = (id: number) => get<Unmei.NovelType>(`novels/${id}`);
export const updateNovel = (novel: Unmei.NovelType) => put<Unmei.NovelType>(`novels/${novel.id}`, novel);
export const uploadNovelCover = (id: number, cover: FormData) => post<string>(`novels/${id}/cover`, cover);

export const fetchNovelCharacters = (id: number) => get<Unmei.CharacterType[]>(`novels/${id}/characters`);

export const fetchNovelGenres = (id: number) => get<Unmei.GenreType[]>(`novels/${id}/genres`);

export const fetchNovelComments = (id: number, offset = 0, count = 5) => get<Unmei.CommentsResponse>(`novels/${id}/comments?offset=${offset}&count=${count}`);
export const postNovelComment = (id: number, text: string) => post<Unmei.CommentType>(`novels/${id}/comments`, { text });

export const fetchUserNovel = (userId: number, novelId: number) => get<Unmei.UserNovelType>(`users/${userId}/novels/${novelId}`);
export const createUserNovel = (userId: number, novelId: number, status = 'planned') => post<Unmei.UserNovelType>(`users/${userId}/novels`, {
    novel_id: Number(novelId),
    status
});
export const updateUserNovel = (userId: number, novelId: number, data: { mark?: number; status?: string }) => put<Unmei.UserNovelType>(`users/${userId}/novels/${novelId}`, data);
export const deleteUserNovel = (userId: number, novelId: number) => del(`users/${userId}/novels/${novelId}`);
