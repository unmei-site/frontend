import {get, put} from './api';

const fetchNews = () => get('news');

const fetchPost = (id: number) => get(`news/${id}`);
const updatePost = (post: PostType) => put(`news/${post.id}`, post);

export { fetchNews, fetchPost, updatePost }