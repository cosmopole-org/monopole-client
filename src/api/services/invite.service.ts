import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import memoryUtils from "../utils/memory"

class InviteService {

    storage: DatabaseDriver
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
    network: NetworkDriver

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
        this.memory = memory
        this.network = network
    }


    async create(data: { targetHumanId: string, towerId: string }): Promise<void> {
        return this.network.request('invite/create', { targetHumanId: data.targetHumanId, towerId: data.towerId })
    }

    async cancel(data: { towerId: string, inviteId: string }): Promise<void> {
        return this.network.request('invite/cancel', { towerId: data.towerId, inviteId: data.inviteId })
    }

    async accept(data: { towerId: string, inviteId: string }): Promise<any> {
        return this.network.request('invite/accept', { towerId: data.towerId, inviteId: data.inviteId }).then((body: any) => {
            let { tower, rooms } = body
            tower.folderId = '-'
            this.storage.factories.tower?.create(tower)
            this.storage.factories.room?.createBatch(rooms)
            let newSpaces = memoryUtils.spaces.prepareSpaces([tower], rooms, { ...this.memory.spaces.get({ noproxy: true }) })
            this.memory.spaces.set(newSpaces)
            let newKnownSpaces = memoryUtils.spaces.prepareSpaces([tower], rooms, { ...this.memory.known.spaces.get({ noproxy: true }) })
            this.memory.known.spaces.set(newKnownSpaces)
        })
    }

    async decline(data: { towerId: string, inviteId: string }): Promise<void> {
        return this.network.request('invite/decline', { towerId: data.towerId, inviteId: data.inviteId })
    }

    async read(data: {}): Promise<void> {
        return this.network.request('invite/read', {})
    }
}

export default InviteService
