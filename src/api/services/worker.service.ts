import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"

class WorkerService {

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

        this.network.addUpdateListener('worker/onResponse', (data: any) => {
            
        })
    }

    async create(data: { towerId: string, roomId: string, machineId: string }): Promise<void> {
        return this.network.request('worker/create', { towerId: data.towerId, roomId: data.roomId, machineId: data.machineId })
    }

    async remove(data: { workerId: string, towerId: string, roomId: string }): Promise<void> {
        return this.network.request('worker/remove', { towerId: data.towerId, roomId: data.roomId, workerId: data.workerId })
    }

    async read(data: { towerId: string, roomId: string }): Promise<void> {
        return this.network.request('worker/read', { towerId: data.towerId, roomId: data.roomId })
    }

    async use(data: { towerId: string, roomId: string, workerId: string, packet: any }) {
        return this.network.request('worker/use', { towerId: data.towerId, roomId: data.roomId, workerId: data.workerId, packet: data.packet })
    }

    async deliver(data: { towerId: string, roomId: string, workerId: string, packet: any, humanId: string }) {
        return this.network.request('worker/deliver', { towerId: data.towerId, roomId: data.roomId, workerId: data.workerId, packet: data.packet })
    }
}

export default WorkerService
