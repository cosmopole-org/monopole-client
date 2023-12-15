import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import memoryUtils from "../utils/memory"

class InteractionService {

    storage: DatabaseDriver
    network: NetworkDriver
    memory: {
        myHumanId: State<any>,
        spaces: State<any>,
        chats: State<any>,
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
            chats: State<any>,
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

    async interact(data: { peerId: string }): Promise<any> {
        let chat = this.memory.chats.get({ noproxy: true })[data.peerId]
        console.log(chat, this.memory.chats.get({ noproxy: true }))
        if (chat) {
            return new Promise(resolve => {
                resolve({ success: true, tower: chat.tower, room: Object.values(chat.tower.rooms)[0], chat })
            })
        } else {
            return this.network.request('interaction/interact', { peerId: data.peerId }).then(async (body: any) => {
                let { tower, room, chat } = body
                await Promise.all([
                    this.storage.factories.tower?.create(tower),
                    this.storage.factories.room?.create(room),
                    this.storage.factories.chat?.create(chat)
                ])
                this.memory.spaces.set(memoryUtils.spaces.prepareSpaces([tower], [room], { ...this.memory.spaces.get({ noproxy: true }) }))
                chat.tower = tower
                this.memory.chats.set({ ...this.memory.chats.get({ noproxy: true }), [data.peerId]: chat })
                return body
            })
        }
    }
}

export default InteractionService
