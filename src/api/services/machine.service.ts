import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import memoryUtils from "../utils/memory"

class MachineService {

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

    async create(data: { name: string }): Promise<void> {
        return this.network.request('machine/create', { name: data.name }).then(async (body: any) => {
            let { machine } = body
            await this.storage.factories.machine?.create(machine)
            this.memory.machines.set(memoryUtils.machines.prepareMachines([machine], { ...this.memory.machines.get({ noproxy: true }) }))
            this.memory.known.machines.set(memoryUtils.machines.prepareMachines([machine], { ...this.memory.known.machines.get({ noproxy: true }) }))
            return body
        })
    }

    async update(data: { machineId: string, name: string }): Promise<void> {
        return this.network.request('machine/update', { name: data.name, machineId: data.machineId }).then(async (body: any) => {
            let { machine } = body
            await this.storage.factories.machine?.update(machine)
            this.memory.machines.set(memoryUtils.machines.prepareMachines([machine], { ...this.memory.machines.get({ noproxy: true }) }))
            this.memory.known.machines.set(memoryUtils.machines.prepareMachines([machine], { ...this.memory.known.machines.get({ noproxy: true }) }))
            return body
        })
    }

    async remove(data: { machineId: string }): Promise<void> {
        return this.network.request('machine/remove', { machineId: data.machineId }).then(async (body: any) => {
            await this.storage.factories.machine?.remove(data.machineId)
            this.memory.machines.set(memoryUtils.machines.removeMachine(data.machineId, { ...this.memory.machines.get({ noproxy: true }) }))
            this.memory.known.machines.set(memoryUtils.machines.removeMachine(data.machineId, { ...this.memory.known.machines.get({ noproxy: true }) }))
            return body
        })
    }

    async search(data: { query: string, offset?: number, count?: number }): Promise<void> {
        return this.network.request('machine/search', { query: data.query, offset: data.offset, count: data.count }).then(async (body: any) => {
            this.memory.known.machines.set(memoryUtils.machines.prepareMachines(body.machines, { ...this.memory.known.machines.get({ noproxy: true }) }))
            return body
        })
    }

    async read(data: { offset?: number, count?: number }): Promise<void> {
        return this.network.request('machine/read', { offset: data.offset, count: data.count }).then(async (body: any) => {
            this.memory.known.machines.set(memoryUtils.machines.prepareMachines(body.machines, { ...this.memory.known.machines.get({ noproxy: true }) }))
            return body
        })
    }

    async signIn(data: { token: string }): Promise<void> {
        return this.network.request('machine/signIn', { token: data.token })
    }
}

export default MachineService
