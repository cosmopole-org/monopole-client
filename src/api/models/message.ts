
interface IMessage {
    type: string,
    id: string,
    authorId: string,
    time: number,
    roomId: string,
    data: {
        text?: string,
        docId?: string,
        stickerId?: string,
    },
    meta: any,
    isDummy?: boolean,
    seen: boolean
}

export default IMessage
