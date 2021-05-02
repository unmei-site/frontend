import { get, post, put } from "./api";

export const fetchUsers = () => get<Unmei.UserType[]>('users');

export const fetchUser = (id: number) => get<Unmei.UserType>(`users/${id}`);
export const updateUser = (user: Unmei.UserType) => put<Unmei.UserType>(`users/${user.id}`, { user });

export const fetchCurrentUser = () => get<Unmei.UserType>('users/me');
export const fetchUserNovels = (id: number) => get<Unmei.NovelType[]>(`users/${id}/novels`);

export const activateAccount = (token: string) => post<string>('auth/activate', { token });
export const generateActivateLink = () => post<string>('auth/activateToken');

export const fetchUserSettings = () => get<Unmei.UserSettingsType>('users/me/settings');
export const updateUserGeneralSettings = (use_gravatar: boolean, avatar: string) => post<Unmei.UserType>('users/me/settings', {
    use_gravatar,
    avatar
});
export const updateUserAppearanceSettings = (theme: string) => post<Unmei.UserType>('users/me/settings', { theme });
export const uploadAvatar = (avatar: FormData) => post<string>('users/me/avatar', avatar);

export const generateRestoreLink = (email: string, recaptcha: string) => post('auth/restoreToken', {
    email,
    recaptcha
});
