import {post} from "./api";

export const restore: Restore = (token: string, new_password: string) => post('auth/restore', { token, new_password });
export const registerUser: Register = (login: string, password: string, email: string, recaptcha: string) => post('auth/register', { login, password, email, recaptcha });
export const login: Login = (login: string, password: string, recaptcha: string) => post('auth/login', { login, password, recaptcha });
export const userLogout: Logout = () => post('auth/logout');
