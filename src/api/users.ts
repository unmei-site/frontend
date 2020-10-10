import {get, post, put} from "./api";

export const fetchUsers: FetchUsers = () => get('users');

export const fetchUser: FetchUser = (id: number) => get(`users/${id}`);
export const updateUser: UpdateUser = (user: UserType) => put(`users/${user.id}`, { user });

export const fetchCurrentUser: FetchCurrentUser = () => get('users/me');
export const fetchUserNovels: FetchUserNovels = (id: number) => get(`users/${id}/novels`);

export const activateAccount: ActivateAccount = (token: string) => post('auth/activate', { token });
export const generateActivateLink: GenerateActivateLink = () => post('auth/activateToken');

export const fetchUserSettings: FetchUserSettings = () => get('users/me/settings');
export const updateUserGeneralSettings: UpdateUserGeneralSettings = (use_gravatar: boolean, avatar: string) => post('users/me/settings', { use_gravatar, avatar });
export const updateUserAppearanceSettings: UpdateUserAppearanceSettings = (theme: string) => post('users/me/settings', { theme });
export const uploadAvatar = (avatar: FormData) => post('users/me/avatar', avatar);

export const generateRestoreLink = (email: string, recaptcha: string) => post('auth/restoreToken', { email, recaptcha });
