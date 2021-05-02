type Snowfall = {
    snowflakeCount: number
    snowfallStatus: boolean
};

type StoreState = {
    currentUser: Unmei.UserType
    userSettings: Unmei.UserSettingsType
    notifications: React.ReactNode[]
    modal: React.ReactNode
    snowfall: Snowfall
    preloader: boolean
}

type Action<T> = {
    type: string
    payload: T
}

type SetUser = (user: Unmei.UserType) => void
type LogoutUser = () => void
type SetSettings = (settings: Unmei.UserSettingsType) => void
type SetModal = (modal: React.ReactNode | null) => void
type HideModal = () => void
type AddNotification = (notification: React.ReactNode) => void
type SetSnowflakeCount = (snowflakeCount: number) => void
type SetSnowflakeStatus = (snowfallStatus: boolean) => void
type SetPreloaderStatus = (status: boolean) => void
