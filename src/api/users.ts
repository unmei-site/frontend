import {get, post, put} from "./api";

export const fetchUsers = () => get<UserType[]>('users');

export const fetchUser = (id: number) => get<UserType>(`users/${id}`);
export const updateUser = (user: UserType) => put<UserType>(`users/${user.id}`, { user });

export const fetchCurrentUser = () => get<UserType>('users/me');
export const fetchUserNovels = (id: number) => get<NovelType[]>(`users/${id}/novels`);

export const activateAccount = (token: string) => post<string>('auth/activate', { token });
export const generateActivateLink = () => post<string>('auth/activateToken');

export const fetchUserSettings = () => get<UserSettingsType>('users/me/settings');
export const updateUserGeneralSettings = (use_gravatar: boolean, avatar: string) => post<UserType>('users/me/settings', { use_gravatar, avatar });
export const updateUserAppearanceSettings = (theme: string) => post<UserType>('users/me/settings', { theme });
export const uploadAvatar = (avatar: FormData) => post<string>('users/me/avatar', avatar);

export const generateRestoreLink = (email: string, recaptcha: string) => post('auth/restoreToken', { email, recaptcha });
