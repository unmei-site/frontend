import {get, post, put} from "./api";

export const fetchUsers = () => get('/users');

export const fetchUser = (id: number) => get(`users/${id}`);
export const updateUser = (user: UserType) => put(`users/${user.id}`, { user })

export const fetchCurrentUser = () => get('users/current');
export const fetchUserNovels = (id: number) => get(`users/${id}/novels`);

export const login = (login: string, password: string) => post('auth/login', { login, password });
export const registerUser = (login: string, password: string, email: string, recaptcha: string) => post('auth/register', { login, password, email, recaptcha });
export const activateAccount = (token: string) => post('auth/activate', { token });
export const userLogout = () => post('auth/logout');