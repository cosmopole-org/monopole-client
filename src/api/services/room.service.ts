import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import memoryUtils from "../utils/memory"
import IRoom from "../models/room"
import { api } from "../.."

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

        this.onRoomCreated('room-service', async (data: any) => {
            let { room } = data
            await this.storage.factories.room?.create(room)
            let newSpaces = memoryUtils.spaces.prepareRoom(room, { ...this.memory.spaces.get({ noproxy: true }) })
            api.services.messenger.check(room.id)
            this.memory.spaces.set(newSpaces)
        })

        this.onRoomUpdated('room-service', async (data: any) => {
            let { room } = data
            await this.storage.factories.room?.update(room)
            this.memory.spaces.set(memoryUtils.spaces.transformRoom(room, this.memory.spaces.get({ noproxy: true })))
        })

        this.onRoomRemoved('room-service', async (data: any) => {
            let { room } = data
            await this.storage.factories.room?.remove(room.id)
            this.memory.spaces.set(memoryUtils.spaces.removeRoom(room.towerId, room.id, { ...this.memory.spaces.get({ noproxy: true }) }))
        })
    }

    private onRoomCreated(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('room/onCreate', (data: any) => {
            callback(data)
        }, tag)
    }

    private onRoomUpdated(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('room/onUpdate', (data: any) => {
            callback(data)
        }, tag)
    }

    private onRoomRemoved(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('room/onRemove', (data: any) => {
            callback(data)
        }, tag)
    }

    async create(data: { title: string, avatarId?: string, isPublic?: boolean, towerId: string }): Promise<void> {
        return this.network.request('room/create', { title: data.title, avatarId: data.avatarId, isPublic: data.isPublic === true, towerId: data.towerId }).then(async (body: any) => {
            let { room } = body
            await this.storage.factories.room?.create(room)
            let newSpaces = memoryUtils.spaces.prepareRoom(room, { ...this.memory.spaces.get({ noproxy: true }) })
            this.memory.spaces.set(newSpaces)
            api.services.messenger.check(room.id)
            return body
        })
    }

    async search(data: { towerId: string, query: string, offset?: number, count?: number }): Promise<any> {
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
