import { post } from "./api";

export const restore = (token: string, new_password: string) => post<string>('auth/restore', { token, new_password });
export const registerUser = (login: string, password: string, email: string, recaptcha: string) => post<Unmei.UserType>('auth/register', {
    login,
    password,
    email,
    recaptcha
});
export const registerUserVk = (code: string) => post('/auth/register/vk', { code });
export const login = (login: string, password: string, recaptcha: string) => post<Unmei.UserType>('auth/login', {
    login,
    password,
    recaptcha
});
export const userLogout = () => post<string>('auth/logout');
export const changeEmail = (old_email: string, new_email: string) => post<string>('auth/changeEmail', {
    old_email,
    new_email
});
export const changePassword = (old_password: string, new_password: string) => post<string>('auth/changePassword', {
    old_password,
    new_password
});
