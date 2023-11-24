import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import IWorker from "../models/worker"
import IMessage from "../models/message"

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
    }

    onMessageReceived(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('message/onMessage', (data: any) => {
            callback(data)
        }, tag)
    }

    async create(data: { towerId: string, roomId: string, message: { type: string, data: any } }): Promise<IMessage> {
        return this.network.request('messenger/create', { towerId: data.towerId, roomId: data.roomId, message: data.message })
    }

    async update(data: { towerId: string, roomId: string, message: { id: string, data: any } }): Promise<void> {
        return this.network.request('messenger/update', { towerId: data.towerId, roomId: data.roomId, message: data.message })
    }

    async read(data: { towerId: string, roomId: string, offset?: number, count?: number }): Promise<void> {
        return this.network.request('messenger/read', { towerId: data.towerId, roomId: data.roomId, offset: data.offset, count: data.count })
    }
}

export default MessengerService
