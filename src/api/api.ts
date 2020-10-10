const baseUrl = process.env.NODE_ENV === "development" ? 'http://localhost:8080/v1' : 'https://api.unmei.space/v1';

const request: ApiRequest = async (url: string, method: string, body?: string | FormData) => {
    let bUrl = baseUrl;
    if(baseUrl.endsWith('/')) bUrl = bUrl.slice(0, baseUrl.length-1);
    if(url.startsWith('/')) url = url.slice(1, baseUrl.length);

    const res = await fetch(`${bUrl}/${url}`, {
        method, body,
        credentials: "include"
    });

    let json: ApiResponse;
    try {
        json = await res.json();
    } catch (e) {
        json = { error: false };
    }

    if(res.status === 429) return new Promise(res => {
        setTimeout(res.bind(null, request(url, method, body)), 1500);
    });
    if(json?.error) return Promise.reject(json.error_data);
    if(!res.ok) return Promise.reject(res.statusText);
    return Promise.resolve(json.data);
}

const get: Get = (url: string, data?: object) => request(url, 'GET', JSON.stringify(data));
const post: Post = (url: string, data?: object | FormData) => request(url, 'POST', data instanceof FormData ? data : JSON.stringify(data));
const put: Put = (url: string, data?: object) => request(url, 'PUT', JSON.stringify(data));
const del: Delete = (url: string, data?: object) => request(url, 'DELETE', JSON.stringify(data));

const TranslateStatus: { [id: string]: string } = {
    planned: 'Запланировано',
    completed: 'Пройдено',
    in_progress: 'Прохожу',
    dropped: 'Брошено',
    deferred: 'Отложено'
};

export const getVersion = () => get('version');
export const version = '0.10b';

export { get, post, put, del, TranslateStatus };
