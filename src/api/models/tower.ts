import IRoom from "./room"

interface ITower {
    id: string,
    title: string,
    avatarId: string,
    isPublic: boolean,
    secret: any,
    folderId: any,
    rooms: { [id: string]: IRoom }
}

export default ITower
