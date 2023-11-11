import IRoom from "./room"

interface ITower {
    id: string,
    title: string,
    avatarId: string,
    isPublic: boolean,
    secret: any,
    rooms: { [id: string]: IRoom }
}

export default ITower
