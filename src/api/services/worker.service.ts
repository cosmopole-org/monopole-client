import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import IWorker from "../models/worker"

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
    }

    onMachinePacketDeliver(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('worker/onResponse', (data: any) => {
            callback(data.packet)
        }, tag)
    }

    async create(data: { towerId: string, roomId: string, machineId: string, secret: any }): Promise<void> {
        return this.network.request('worker/create', { towerId: data.towerId, roomId: data.roomId, machineId: data.machineId, secret: data.secret })
    }

    async remove(data: { workerId: string, towerId: string, roomId: string }): Promise<void> {
        return this.network.request('worker/remove', { towerId: data.towerId, roomId: data.roomId, workerId: data.workerId })
    }

    async update(data: { towerId: string, roomId: string, worker: IWorker }): Promise<void> {
        return this.network.request('worker/update', { towerId: data.towerId, roomId: data.roomId, worker: data.worker })
    }

    async read(data: { towerId: string, roomId: string }): Promise<void> {
        return this.network.request('worker/read', { towerId: data.towerId, roomId: data.roomId })
    }

    async use(data: { towerId: string, roomId: string, workerId: string, packet: any }) {
        return this.network.request('worker/use', { towerId: data.towerId, roomId: data.roomId, workerId: data.workerId, packet: data.packet })
    }    

    async deliver(data: { towerId: string, roomId: string, workerId: string, packet: any, humanId: string }) {
        return this.network.request('worker/deliver', {
            towerId: data.towerId,
            roomId: data.roomId,
            workerId: data.workerId,
            humanId: data.humanId,
            packet: data.packet
        })
    }
}

export default WorkerService
