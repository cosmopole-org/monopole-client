import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import memoryUtils from "../utils/memory"

class RoomService {

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

    async create(data: { title: string, avatarId?: string, isPublic?: boolean, towerId: string }): Promise<void> {
        return this.network.request('room/create', { title: data.title, avatarId: data.avatarId, isPublic: data.isPublic === true, towerId: data.towerId }).then(async (body: any) => {
            let { room } = body
            await this.storage.factories.room?.create(room)
            let newSpaces = memoryUtils.spaces.prepareRoom(room, { ...this.memory.spaces.get({ noproxy: true }) })
            this.memory.spaces.set(newSpaces)
            return body
        })
    }

    async search(data: { towerId: string, query: string, offset?: number, count?: number }): Promise<void> {
        return this.network.request('room/search', { towerId: data.towerId, query: data.query, offset: data.offset, count: data.count })
    }

    async update(data: { towerId: string, roomId: string, title?: string, avatarId?: string, isPublic?: boolean }): Promise<void> {
        return this.network.request('room/update', { towerId: data.towerId, roomId: data.roomId, title: data.title, avatarId: data.avatarId, isPublic: data.isPublic }).then(async (body: any) => {
            let { room } = body
            await this.storage.factories.room?.update(room)
            this.memory.spaces.set(memoryUtils.spaces.transformRoom(room, this.memory.spaces.get({ noproxy: true })))
            return body
        })
    }

    async remove(data: { towerId: string, roomId: string }): Promise<void> {
        return this.network.request('room/remove', { towerId: data.towerId, roomId: data.roomId }).then(async (body: any) => {
            await this.storage.factories.room?.remove(data.roomId)
            this.memory.spaces.set(memoryUtils.spaces.removeRoom(data.towerId, data.roomId, { ...this.memory.spaces.get({ noproxy: true }) }))
            return body
        })
    }

    async readById(data: { towerId: string, roomId: string }): Promise<void> {
        return this.network.request('room/readById', { towerId: data.towerId, roomId: data.roomId })
    }
}

export default RoomService
