import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import memoryUtils from "../utils/memory"
import { api } from "../.."

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
        this.OnInteractionCreated('interaction-service', async (data: any) => {
            let { chat, tower, room, human } = data
            await Promise.all([
                this.storage.factories.tower?.create(tower),
                this.storage.factories.room?.create(room),
                this.storage.factories.chat?.create(chat),
                this.storage.factories.human?.create(human)
            ])
            this.memory.spaces.set(memoryUtils.spaces.prepareSpaces([tower], [room], { ...this.memory.spaces.get({ noproxy: true }) }))
            chat.tower = tower
            this.memory.chats.set({ ...this.memory.chats.get({ noproxy: true }), [data.peerId]: chat })
            this.memory.humans.set({ ...this.memory.humans.get({ noproxy: true }), [human.id]: human })
            this.memory.known.humans.set({ ...this.memory.known.humans.get({ noproxy: true }), [human.id]: human })
            api.services.messenger.check(room.id)
        })
    }

    private OnInteractionCreated(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('interaction/onCreate', (data: any) => {
            callback(data)
        }, tag)
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
                let { tower, room, chat, peer } = body
                await Promise.all([
                    this.storage.factories.tower?.create(tower),
                    this.storage.factories.room?.create(room),
                    this.storage.factories.chat?.create(chat),
                    this.storage.factories.human?.create(peer)
                ])
                this.memory.spaces.set(memoryUtils.spaces.prepareSpaces([tower], [room], { ...this.memory.spaces.get({ noproxy: true }) }))
                chat.tower = tower
                this.memory.chats.set({ ...this.memory.chats.get({ noproxy: true }), [data.peerId]: chat })
                this.memory.humans.set({ ...this.memory.humans.get({ noproxy: true }), [peer.id]: peer })
                this.memory.known.humans.set({ ...this.memory.known.humans.get({ noproxy: true }), [peer.id]: peer })
                return body
            })
        }
    }
}

export default InteractionService
