const baseUrl = process.env.NODE_ENV === "development" ? 'http://localhost:8080/v1' : 'https://api.unmei.space/v1';

async function request<T>(url: string, method: string, body?: string | FormData): Promise<T> {
    let bUrl = baseUrl;
    if(baseUrl.endsWith('/'))
        bUrl = bUrl.slice(0, baseUrl.length - 1);
    if(url.startsWith('/'))
        url = url.slice(1, baseUrl.length);

    const res = await fetch(`${bUrl}/${url}`, {
        method, body,
        credentials: "include",
        headers: new Headers({
            'Dev': /dev.(.+)/.test(window.location.href) ? '1' : '0'
        })
    });

    let json: ApiResponse<T>;
    try {
        json = await res.json();
    } catch(e) {
        json = { error: false };
    }

    if(res.status === 429) return new Promise(res => {
        setTimeout(res.bind(null, request(url, method, body)), 1500);
    });
    if(json?.error) return Promise.reject(json.error_data);
    if(!res.ok) return Promise.reject(res.statusText);
    if(!json.data) return Promise.reject(null);
    return Promise.resolve(json.data);
}

const get = <T>(url: string, data?: object): Promise<T> => request<T>(url, 'GET', JSON.stringify(data));
const post = <T>(url: string, data?: object | FormData): Promise<T> => request(url, 'POST', data instanceof FormData ? data : JSON.stringify(data));
const put = <T>(url: string, data?: object): Promise<T> => request<T>(url, 'PUT', JSON.stringify(data));
const del = <T>(url: string, data?: object): Promise<T> => request<T>(url, 'DELETE', JSON.stringify(data));

const TranslateStatus: { [id: string]: string } = {
    planned: 'Запланировано',
    completed: 'Пройдено',
    in_progress: 'Прохожу',
    dropped: 'Брошено',
    deferred: 'Отложено'
};

const TranslatePlatform: { [id: string]: string } = {
    win: 'Windows'
};

const TranslateExitStatus: { [id: string]: string } = {
    came_out: 'Вышла'
}

export const getVersion = () => get<VersionResponse>('version');
export const version = '1.1';

export { get, post, put, del, TranslateStatus, TranslatePlatform, TranslateExitStatus };
