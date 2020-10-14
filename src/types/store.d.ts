type StoreState = {
    currentUser: UserType
    userSettings: UserSettingsType
    notifications: React.ReactNode[]
    modal: React.ReactNode
}

type Action<T> = {
    type: string
    payload: T
}

type SetUser = (user: UserType) => void
type LogoutUser = () => void
type SetSettings = (settings: UserSettingsType) => void
type SetModal = (modal: React.ReactNode | null) => void
type HideModal = () => void
type AddNotification = (notification: React.ReactNode) => void
