import { del, get, put } from './api';

export const fetchNews = () => get<PostType[]>('news');

export const fetchPost = (id: number) => get<PostType>(`news/${id}`);
export const updatePost = (post: PostType) => put<PostType>(`news/${post.id}`, post);
export const deletePost = (id: number) => del(`news/${id}`);
