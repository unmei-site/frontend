type StoreState = {
    currentUser: UserType
    notifications: React.ReactNode[]
    modal: React.ReactNode
}

type SetUser = (user: UserType) => void
type LogoutUser = () => void
type SetModal = (modal: React.ReactNode | null) => void
type HideModal = () => void
type AddNotification = (notification: React.ReactNode) => void
