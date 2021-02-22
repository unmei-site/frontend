type Theme = 'dark' | 'blue' | 'red' | 'green' | 'light' | 'custom' | 'win95';
type ExitStatus = 'came_out';
type NovelPlatform = 'win';

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
    comments: CommentType[]
    count: number
}
