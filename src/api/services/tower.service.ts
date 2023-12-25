import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import memoryUtils from "../utils/memory"
import { api } from "../.."
import ITower from "../models/tower"

class TowerService {

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

        this.onTowerUpdated('tower-service', async (data: any) => {
            let { tower } = data
            await this.storage.factories.tower?.update(tower)
            this.memory.spaces.set(memoryUtils.spaces.transformTower(tower, this.memory.spaces.get({ noproxy: true })))
        })

        this.onTowerRemoved('tower-service', async (data: any) => {
            let { tower } = data
            await this.storage.factories.tower?.remove(tower.id)
            this.memory.spaces.set(memoryUtils.spaces.removeTower(tower.id, { ...this.memory.spaces.get({ noproxy: true }) }))
        })
    }

    private onTowerUpdated(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('tower/onUpdate', (data: any) => {
            callback(data)
        }, tag)
    }

    private onTowerRemoved(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('tower/onRemove', (data: any) => {
            callback(data)
        }, tag)
    }

    async create(data: { title: string, avatarId?: string, isPublic?: boolean }): Promise<void> {
        return this.network.request('tower/create', { title: data.title, avatarId: data.avatarId, isPublic: data.isPublic === true }).then(async (body: any) => {
            let { tower, room } = body
            tower.folderId = '-'
            await this.storage.factories.tower?.create(tower)
            await this.storage.factories.room?.create(room)
            let newSpaces = memoryUtils.spaces.prepareSpaces([tower], [room], { ...this.memory.spaces.get({ noproxy: true }) })
            this.memory.spaces.set(newSpaces)
            let newKnownSpaces = memoryUtils.spaces.prepareSpaces([tower], [room], { ...this.memory.known.spaces.get({ noproxy: true }) })
            this.memory.known.spaces.set(newKnownSpaces)
            api.services.messenger.check(room.id)
            return body
        })
    }

    async search(data: { query: string, offset?: number, count?: number }): Promise<any> {
        return this.network.request('tower/search', { query: data.query, offset: data.offset, count: data.count })
    }

    async update(data: { towerId: string, title?: string, avatarId?: string, isPublic?: boolean }): Promise<void> {
        let oldTower = this.memory.spaces.get({ noproxy: true })[data.towerId]
        return this.network.request('tower/update', { towerId: data.towerId, title: data.title, avatarId: data.avatarId, isPublic: data.isPublic }).then(async (body: any) => {
            let { tower } = body
            tower.folderId = oldTower.folderId
            await this.storage.factories.tower?.update(tower)
            this.memory.spaces.set(memoryUtils.spaces.transformTower(tower, this.memory.spaces.get({ noproxy: true })))
            return body
        })
    }

    async remove(data: { towerId: string }): Promise<any> {
        return this.network.request('tower/remove', { towerId: data.towerId }).then(async (body: any) => {
            await this.storage.factories.tower?.remove(data.towerId)
            this.memory.spaces.set(memoryUtils.spaces.removeTower(data.towerId, { ...this.memory.spaces.get({ noproxy: true }) }))
            return body
        })
    }

    async join(data: { towerId: string }): Promise<void> {
        return this.network.request('tower/join', { towerId: data.towerId }).then(async (body: any) => {
            let tower = this.memory.known.spaces.get({ noproxy: true })[data.towerId]
            tower.folderId = '-'
            await this.storage.factories.tower?.create(tower)
            let { rooms } = await api.services.room.search({ towerId: data.towerId, query: '' })
            await this.storage.factories.room?.createBatch(rooms)
            let newSpaces = memoryUtils.spaces.prepareSpaces([tower], rooms, { ...this.memory.spaces.get({ noproxy: true }) })
            this.memory.spaces.set(newSpaces)
            return body
        })
    }

    async readById(data: { towerId: string }): Promise<void> {
        return this.network.request('tower/readById', { towerId: data.towerId }).then((body: any) => {
            let { tower, rooms } = body
            this.memory.known.spaces.set(memoryUtils.spaces.prepareSpaces([tower], rooms, { ...this.memory.known.spaces.get({ noproxy: true }) }))
            return body
        })
    }

    async readMembers(data: { towerId: string }): Promise<any> {
        return this.network.request('tower/readMembers', { towerId: data.towerId })
    }

    async read(): Promise<any> {
        return this.network.request('tower/read', {}).then(async (body: any) => {
            let { towers, rooms } = body
            let localTowers = this.memory.spaces.get({ noproxy: true })
            towers.forEach((tower: ITower) => {
                if (localTowers[tower.id] && localTowers[tower.id].folderId) {
                    tower.folderId = localTowers.folderId
                } else {
                    tower.folderId = '-'
                }
            });
            rooms.forEach((room: any) => api.services.messenger.check(room.id));
            await this.storage.factories.tower?.createBatch(towers)
            await this.storage.factories.room?.createBatch(rooms)
            let newSpaces = memoryUtils.spaces.prepareSpaces(towers, rooms, { ...this.memory.spaces.get({ noproxy: true }) })
            this.memory.spaces.set(newSpaces)
            let newKnownSpaces = memoryUtils.spaces.prepareSpaces(towers, rooms, { ...this.memory.known.spaces.get({ noproxy: true }) })
            this.memory.known.spaces.set(newKnownSpaces)
        })
    }
}

export default TowerService
