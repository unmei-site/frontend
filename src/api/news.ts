import {get} from './api';

const getNews = () => get('news');
const getPost = (id: number) => get(`news/${id}`);

export { getNews, getPost }