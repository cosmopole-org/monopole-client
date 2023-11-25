import { State, hookstate } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import IMessage from "../models/message"
import { none } from "@hookstate/core"

export let MessageTypes = {
    TEXT: "text",
    DOC: "doc",
    STICKER: "sticker"
}

class MessengerService {

    storage: DatabaseDriver
    network: NetworkDriver
    memory: {
        myHumanId: State<any>,
        spaces: State<any>,
        humans: State<any>,
        machines: State<any>,
        messages: { [id: string]: any },
        known: {
            spaces: State<any>,
            humans: State<any>,
            machines: State<any>,
        }
    }

    constructor(
        storage: DatabaseDriver,
        network: NetworkDriver,
        memory: {
            myHumanId: State<any>,
            spaces: State<any>,
            humans: State<any>,
            machines: State<any>,
            messages: { [id: string]: any },
            known: {
                spaces: State<any>,
                humans: State<any>,
                machines: State<any>,
            }
        }
    ) {
        this.storage = storage
        this.network = network
        this.memory = memory

        this.onMessageDeleted('messenger-service', (data: any) => {
            let { message } = data
            if (this.memory.messages[message.roomId]) {
                this.memory.messages[message.roomId][this.memory.messages[message.roomId].get({ noproxy: true }).findIndex((m: IMessage) => m.id === message.id)]?.set(none)
            }
        })
    }

    check(roomId: string) {
        if (!this.memory.messages[roomId]) this.memory.messages[roomId] = hookstate([])
    }

    onMessageReceived(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('message/onCreate', (data: any) => {
            callback(data)
        }, tag)
    }

    onMessageEdited(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('message/onUpdate', (data: any) => {
            callback(data)
        }, tag)
    }

    private onMessageDeleted(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('message/onRemove', (data: any) => {
            callback(data)
        }, tag)
    }

    async create(data: { towerId: string, roomId: string, message: { type: string, data: any } }): Promise<IMessage> {
        return this.network.request('messenger/create', { towerId: data.towerId, roomId: data.roomId, message: data.message })
    }

    async update(data: { towerId: string, roomId: string, message: { id: string, data: any } }): Promise<void> {
        return this.network.request('messenger/update', { towerId: data.towerId, roomId: data.roomId, message: data.message })
    }

    async remove(data: { towerId: string, roomId: string, messageId: string }): Promise<any> {
        return this.network.request('messenger/remove', { towerId: data.towerId, roomId: data.roomId, messageId: data.messageId }).then((body: any) => {
            this.memory.messages[data.roomId][this.memory.messages[data.roomId].get({ noproxy: true }).findIndex((m: IMessage) => m.id === data.messageId)]?.set(none)
            return body
        })
    }

    async read(data: { towerId: string, roomId: string, offset?: number, count?: number }): Promise<any> {
        return this.network.request('messenger/read', { towerId: data.towerId, roomId: data.roomId, offset: data.offset, count: data.count }).then((body: any) => {
            this.check(data.roomId)
            this.memory.messages[data.roomId].set(body.messages)
            return body
        })
    }
}

export default MessengerService
