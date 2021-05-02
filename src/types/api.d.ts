declare module Unmei {
    type Theme = 'dark' | 'blue' | 'red' | 'green' | 'light' | 'custom' | 'win95';
    type ExitStatus = 'in_developing' | 'came_out' | 'canceled' | 'announcement' | 'postponed';
    type NovelPlatform = 'win' | 'mac' | 'linux' | 'ios' | 'android' | 'ps4' | 'ps3' | 'ps2' | 'ps' | 'psp';

    type ApiError = {
        code: number
        text: string
    }

    type Pagination = {
        offset?: number
        limit?: number
        total?: number
    }

    type ApiResponse<T> = {
        error: boolean
        error_data?: ApiError | string
        pagination?: Pagination
        data?: T
    }

    type VersionResponse = {
        version: string
        build: number
    }

    type CommentsResponse = {
        comments: Unmei.CommentType[]
        count: number
    }
}
