import {del, get, put} from './api';

export const fetchNews = () => get('news');

export const fetchPost = (id: number) => get(`news/${id}`);
export const updatePost = (post: PostType) => put(`news/${post.id}`, post);
export const deletePost = (id: number) => del(`news/${id}`);