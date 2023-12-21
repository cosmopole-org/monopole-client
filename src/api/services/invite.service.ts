import { State, hookstate } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import memoryUtils from "../utils/memory"

class InviteService {

    invites: State<any> = hookstate([])

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

        this.onInviteCreated('invite-service', async (data: any) => {
            let { invite } = data
            this.invites.merge([invite])
        })

        this.onInviteCancelled('invite-service', async (data: any) => {
            let { inviteId } = data
            this.invites.set(this.invites.get({ noproxy: true }).filter((invite: any) => invite.id !== inviteId))
        })
    }

    private onInviteCreated(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('invite/onCreate', (data: any) => {
            callback(data)
        }, tag)
    }

    private onInviteCancelled(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('invite/onCancel', (data: any) => {
            callback(data)
        }, tag)
    }

    private onInviteAccepted(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('invite/onAccept', (data: any) => {
            callback(data)
        }, tag)
    }

    private onInviteDeclined(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('invite/onDecline', (data: any) => {
            callback(data)
        }, tag)
    }

    async create(data: { targetHumanId: string, towerId: string }): Promise<void> {
        return this.network.request('invite/create', { targetHumanId: data.targetHumanId, towerId: data.towerId })
    }

    async cancel(data: { towerId: string, inviteId: string }): Promise<void> {
        return this.network.request('invite/cancel', { towerId: data.towerId, inviteId: data.inviteId }).then((body: any) => {
            this.invites.set(this.invites.get({ noproxy: true }).filter((invite: any) => invite.id !== data.inviteId))
        })
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
            this.invites.set(this.invites.get({ noproxy: true }).filter((invite: any) => invite.id !== data.inviteId))
        })
    }

    async decline(data: { towerId: string, inviteId: string }): Promise<void> {
        return this.network.request('invite/decline', { towerId: data.towerId, inviteId: data.inviteId }).then((body: any) => {
            this.invites.set(this.invites.get({ noproxy: true }).filter((invite: any) => invite.id !== data.inviteId))
        })
    }

    async read(): Promise<void> {
        return this.network.request('invite/read', {}).then((body: any) => {
            let { invites } = body
            this.invites.set(invites)
        })
    }
}

export default InviteService
