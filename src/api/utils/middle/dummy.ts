import { api } from "../../.."

const createDummyMessage = (roomId: string, type: string, data: any, meta?: any) => {
    return {
        type,
        id: Math.random().toString().substring(2),
        data,
        time: Date.now(),
        isDummy: true,
        authorId: api.memory.myHumanId.get({ noproxy: true }),
        author: api.memory.humans.get({ noproxy: true })[api.memory.myHumanId.get({ noproxy: true })],
        roomId: roomId,
        meta: meta ? meta : {}
    }
}

export default {
    createDummyMessage
}