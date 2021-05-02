declare module Unmei {
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
        is_banned: boolean
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
        exit_status: ExitStatus
        is_demo: boolean
        duration: number
        platforms: string
        links: NovelLink[]
        genres: GenreType[]
        walkthrough: string
        rating_all: RatingAll[]
        status_all: StatusAll[]
    }

    type RatingAll = {
        mark: number
        count: number
    }

    type StatusAll = {
        status: string
        count: number
    }

    type NovelLink = {
        novel_id: number
        name: string
        link: string
    }

    type CharacterType = {
        id: number
        original_name: string
        localized_name: string
        description: string
        image: string
        main: boolean
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

    type ClubType = {
        id: number
        name: string
        avatar: string
        ownerId: number
    }
}
