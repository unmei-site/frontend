
const baseUrl = process.env.NODE_ENV === "development" ? 'http://localhost:8080/v1' : 'https://api.unmei.nix13.pw/v1';

export const response = async (url: string, method: string, body?: string | FormData) => {
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
        setTimeout(res.bind(null, response(url, method, body)), 1500);
    });
    if(json?.error) return Promise.reject(json.error_data);
    if(!res.ok) return Promise.reject(res.statusText);
    return Promise.resolve(json.data);
}

const get = (url: string, data?: object) => response(url, 'GET', JSON.stringify(data));
const post = (url: string, data?: object | FormData) => response(url, 'POST', data instanceof FormData ? data : JSON.stringify(data));
const put = (url: string, data?: object) => response(url, 'PUT', JSON.stringify(data));
const del = (url: string, data?: object) => response(url, 'DELETE', JSON.stringify(data));

const TranslateStatus: { [id: string]: string } = {
    planned: 'Запланировано',
    completed: 'Пройдено',
    in_progress: 'Прохожу',
    dropped: 'Брошено',
    deferred: 'Отложено'
};

export const getVersion = () => get('version');
export const version = '0.9';

export { get, post, put, del, TranslateStatus };