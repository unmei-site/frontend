type Theme = 'dark' | 'blue' | 'red' | 'green' | 'light'

type ApiError = {
    code: number
    text: string
}

type DataType = NovelType | NovelType[] | CharacterType | CharacterType[] | UserType | UserType[] | UserSettingsType | UserNovelType | UserNovelType[] | UserGroupType | CommentType | CommentType[] | GenreType | GenreType[] | PostType | PostType[];

type ApiResponse = {
    error: boolean
    error_data?: ApiError | string
    data?: DataType
}

type NovelType = {
    id: number
    original_name: string
    localized_name: string
    description: string
    image: string
    status: string
    rating: number
    release_date: Date
}

type CharacterType = {
    id: number
    original_name: string
    localized_name: string
    description: string
    image: string
    main: boolean
}

type UserType = {
    authorized: boolean
    id: number
    username: string
    email?: string
    avatar: string
    cover: string
    group: UserGroupType
    is_superuser: boolean
    is_activated: boolean
}

type UserSettingsType = {
    avatar: string
    theme: Theme
    use_gravatar: boolean
}

type UserNovelType = {
    mark?: number
    status: string
}

type UserGroupType = {
    id: number
    name: string
    color: string
    is_superuser: boolean
    permissions: string
}

type CommentType = {
    id: number
    user_id: number
    novel_id: number
    text: string
}

type GenreType = {
    id: number
    name: string
    localized_name: string
}

type PostType = {
    id: number
    title: string
    short_post: string
    full_post: string
    date: Date
    author: string
    author_id: number
}
