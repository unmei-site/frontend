import { del, get, put, post } from './api';

export const fetchNews = () => get<Unmei.PostType[]>('news');
export const createPost = (p: Unmei.PostType) => post<Unmei.PostType>('news', p);

export const fetchPost = (id: number) => get<Unmei.PostType>(`news/${id}`);
export const updatePost = (post: Unmei.PostType) => put<Unmei.PostType>(`news/${post.id}`, post);
export const deletePost = (id: number) => del(`news/${id}`);
