import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import memoryUtils from "../utils/memory"

class TowerService {

    storage: DatabaseDriver
    network: NetworkDriver
    memory: {
        spaces: State<any>,
        humans: State<any>,
        machines: State<any>
    }

    constructor(
        storage: DatabaseDriver,
        network: NetworkDriver,
        memory: {
            spaces: State<any>,
            humans: State<any>,
            machines: State<any>
        }
    ) {
        this.storage = storage
        this.network = network
        this.memory = memory
    }

    async create(data: { title: string, avatarId?: string, isPublic?: boolean }): Promise<void> {
        return this.network.request('tower/create', { title: data.title, avatarId: data.avatarId, isPublic: data.isPublic === true }).then(async (body: any) => {
            let { tower, room } = body
            await this.storage.factories.tower?.create(tower)
            await this.storage.factories.room?.create(room)
            let newSpaces = memoryUtils.spaces.prepareSpaces([tower], [room], { ...this.memory.spaces.get({ noproxy: true }) })
            this.memory.spaces.set(newSpaces)
            return body
        })
    }

    async search(data: { query: string, offset?: number, count?: number }): Promise<void> {
        return this.network.request('tower/search', { query: data.query, offset: data.offset, count: data.count })
    }

    async update(data: { towerId: string, title?: string, avatarId?: string, isPublic?: boolean }): Promise<void> {
        return this.network.request('tower/update', { towerId: data.towerId, title: data.title, avatarId: data.avatarId, isPublic: data.isPublic }).then(async (body: any) => {
            let { tower } = body
            await this.storage.factories.tower?.update(tower)
            this.memory.spaces.set(memoryUtils.spaces.transformTower(tower, this.memory.spaces.get({ noproxy: true })))
            return body
        })
    }

    async remove(data: { towerId: string }): Promise<void> {
        return this.network.request('tower/remove', { towerId: data.towerId })
    }

    async join(data: { towerId: string }): Promise<void> {
        return this.network.request('tower/join', { towerId: data.towerId })
    }
}

export default TowerService