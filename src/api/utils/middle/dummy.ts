import { api } from "../../.."

const createDummyMessage = (roomId: string, type: string, data: any) => {
    return {
        type,
        id: Math.random().toString().substring(2),
        data,
        time: Date.now(),
        isDummy: true,
        authorId: api.memory.myHumanId.get({ noproxy: true }),
        roomId: roomId,
        meta: {}
    }
}

export default {
    createDummyMessage
}