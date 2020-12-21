type Theme = 'dark' | 'blue' | 'red' | 'green' | 'light' | 'win95';
type ExitStatus = 'came_out';
type NovelPlatform = 'win';

type ApiError = {
    code: number
    text: string
}

type ApiResponse<T> = {
    error: boolean
    error_data?: ApiError | string
    data?: T
}

type VersionResponse = {
    version: string
}

type CommentsResponse = {
    comments: CommentType[]
    count: number
}
