import {get, post, put} from "./api";

export const fetchUsers = () => get('users');

export const fetchUser = (id: number) => get(`users/${id}`);
export const updateUser = (user: UserType) => put(`users/${user.id}`, { user })

export const fetchCurrentUser = () => get('users/me');
export const fetchUserNovels = (id: number) => get(`users/${id}/novels`);

export const registerUser = (login: string, password: string, email: string, recaptcha: string) => post('auth/register', { login, password, email, recaptcha });
export const login = (login: string, password: string, recaptcha: string) => post('auth/login', { login, password, recaptcha });
export const userLogout = () => post('auth/logout');

export const activateAccount = (token: string) => post('auth/activate', { token });
export const generateActivateLink = () => post('auth/activateToken');

export const fetchUserSettings = () => get('users/me/settings');
export const updateUserSettings = (use_gravatar: boolean, avatar: string) => post('users/me/settings', { use_gravatar, avatar });
export const uploadAvatar = (avatar: FormData) => post('users/me/avatar', avatar);

export const generateRestoreLink = (email: string, recaptcha: string) => post('auth/restoreToken', { email, recaptcha });