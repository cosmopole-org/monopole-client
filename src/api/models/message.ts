
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
    meta: any
}

export default IMessage
