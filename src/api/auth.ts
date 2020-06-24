import {post} from "./api";

export const restore = (token: string, new_password: string) => post('auth/restore', { token, new_password });