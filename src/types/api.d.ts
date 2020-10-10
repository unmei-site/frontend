type ApiRequest = (url: string, method: string, body?: string | FormData) => Promise<any>;


type Get = (url: string, data?: object) => Promise<any>;
type Post = (url: string, data?: object | FormData) => Promise<any>;
type Put = (url: string, data?: object) => Promise<any>;
type Delete = (url: string, data?: object) => Promise<any>;


type FetchUsers = () => Promise<UserType[]>;
type FetchUser = (id: number) => Promise<UserType>;
type UpdateUser = (user: UserType) => Promise<UserType>;
type FetchCurrentUser = () => Promise<UserType>;
type FetchUserNovels = (id: number) => Promise<NovelType[]>;
type ActivateAccount = (token: string) => Promise<string>;
type GenerateActivateLink = () => Promise<string>;
type FetchUserSettings = () => Promise<UserSettingsType>;
type UpdateUserGeneralSettings = (use_gravatar: boolean, avatar: string) => Promise<UserType>;
type UpdateUserAppearanceSettings = (theme: string) => Promise<UserType>;


type FetchChar = (id: number) => Promise<CharacterType>;
type FetchCharNovels = (id: number) => Promise<NovelType[]>;


type Login = (login: string, password: string, recaptcha: string) => Promise<UserType>;
type Register = (login: string, password: string, email: string, recaptcha: string) => Promise<UserType>;
type Restore = (token: string, new_password: string) => Promise<string>;
type Logout = () => Promise<string>;
