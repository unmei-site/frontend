import {post} from "./api";

export const restore = (token: string, new_password: string) => post<string>('auth/restore', { token, new_password });
export const registerUser = (login: string, password: string, email: string, recaptcha: string) => post<UserType>('auth/register', { login, password, email, recaptcha });
export const login = (login: string, password: string, recaptcha: string) => post<UserType>('auth/login', { login, password, recaptcha });
export const userLogout = () => post<string>('auth/logout');
