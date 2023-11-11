import { NetworkDriver } from "../drivers"

class InviteService {

    network: NetworkDriver

    constructor(network: NetworkDriver) {
        this.network = network
    }

    async create(data: { targetHumanId: string, towerId: string }): Promise<void> {
        return this.network.request('invite/create', { targetHumanId: data.targetHumanId, towerId: data.towerId })
    }

    async cancel(data: { towerId: string, inviteId: string }): Promise<void> {
        return this.network.request('invite/cancel', { towerId: data.towerId, inviteId: data.inviteId })
    }

    async accept(data: { towerId: string, inviteId: string }): Promise<void> {
        return this.network.request('invite/accept', { towerId: data.towerId, inviteId: data.inviteId })
    }

    async decline(data: { towerId: string, inviteId: string }): Promise<void> {
        return this.network.request('invite/decline', { towerId: data.towerId, inviteId: data.inviteId })
    }
}

export default InviteService
