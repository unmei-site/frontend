import axios, { AxiosError } from 'axios';

export const http = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? 'http://localhost:8080/v1' : 'https://api.unmei.nix13.pw/v1',
    withCredentials: true
});

http.interceptors.response.use(undefined, (error: AxiosError) => {
    if(error.response) {
        if(error.response?.status === 429) {
            return new Promise(res => {
                setTimeout(res.bind(null, http.request(error.config)), 1000)
            });
        } else {
            if(error.response.data.error_data)
                return Promise.reject(error.response.data.error_data);
        }
    } else {
        console.error(error);
    }
});

const get = (url: string, data?: object) => http.get(url, data).then(r => r?.data?.data);
const post = (url: string, data?: object) => http.post(url, data).then(r => r?.data.data);
const put = (url: string, data?: object) => http.put(url, data).then(r => r?.data.data);
const del = (url: string, data?: object) => http.delete(url, data).then(r => r?.data.data);

const TranslateStatus: { [id: string]: string } = {
    planned: 'Запланировано',
    completed: 'Пройдено',
    in_progress: 'Прохожу',
    dropped: 'Брошено',
    deferred: 'Отложено'
};

export { get, post, put, del, TranslateStatus };