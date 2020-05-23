import axios, { AxiosError } from 'axios';

export const http = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? 'http://localhost:8080/v1' : 'https://api.unmei.nix13.pw/v1',
    withCredentials: true
});

const baseUrl = process.env.NODE_ENV === "development" ? 'http://localhost:8080/v1' : 'https://api.unmei.nix13.pw/v1';

export const response = async (url: string, method: string, body?: any) => {
    let bUrl = baseUrl;
    if(baseUrl.endsWith('/')) bUrl = bUrl.slice(0, baseUrl.length-1);
    if(url.startsWith('/')) url = url.slice(1, baseUrl.length);

    if(typeof body === 'object') body = JSON.stringify(body);
    const res = await fetch(`${bUrl}/${url}`, {
        method, body,
        credentials: "include"
    });

    const json: ApiResponse = await res.json();

    if(res.status === 429) return new Promise(res => {
        setTimeout(res.bind(null, response(url, method, body)), 1500);
    });
    if(json?.error) return Promise.reject(json.error_data);
    if(!res.ok) return Promise.reject(res.statusText);
    return Promise.resolve(json.data);
}

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

const get = (url: string, data?: object) => response(url, 'GET', data);
const post = (url: string, data?: object) => response(url, 'POST', data);
const put = (url: string, data?: object) => response(url, 'PUT', data);
const del = (url: string, data?: object) => response(url, 'DELETE', data);

// const get = (url: string, data?: object) => http.get(url, data).then(r => r?.data?.data);
// const post = (url: string, data?: object) => http.post(url, data).then(r => r?.data.data);
// const put = (url: string, data?: object) => http.put(url, data).then(r => r?.data.data);
// const del = (url: string, data?: object) => http.delete(url, data).then(r => r?.data.data);

const TranslateStatus: { [id: string]: string } = {
    planned: 'Запланировано',
    completed: 'Пройдено',
    in_progress: 'Прохожу',
    dropped: 'Брошено',
    deferred: 'Отложено'
};

export { get, post, put, del, TranslateStatus };