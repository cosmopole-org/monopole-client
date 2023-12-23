import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"

class CallService {

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

    onPeerJoinedCall(tag: string, callback: any) {
        this.network.addUpdateListener('call/onJoin', (data: any) => {
            callback(data)
        }, tag)
    }

    onPeerLeftCall(tag: string, callback: any) {
        this.network.addUpdateListener('call/onLeave', (data: any) => {
            callback(data)
        }, tag)
    }

    onPeerTurnedVideoOff(tag: string, callback: any) {
        this.network.addUpdateListener('call/onVideoTurnOff', (data: any) => {
            callback(data)
        }, tag)
    }

    onPeerTurnedAudioOff(tag: string, callback: any) {
        this.network.addUpdateListener('call/onAudioTurnOff', (data: any) => {
            callback(data)
        }, tag)
    }

    onPeerTurnedScreenOff(tag: string, callback: any) {
        this.network.addUpdateListener('call/onScreenTurnOff', (data: any) => {
            callback(data)
        }, tag)
    }

    async getIceServers(): Promise<void> {
        return this.network.request('call/getIceServers', { })
    }

    async joinCall(data: { towerId: string, roomId: string }): Promise<void> {
        return this.network.request('call/joinCall', { towerId: data.towerId, roomId: data.roomId })
    }

    async leaveCall(): Promise<void> {
        return this.network.request('call/leaveCall', {})
    }

    async turnVideoOff(): Promise<void> {
        return this.network.request('call/turnVideoOff', { })
    }

    async turnAudioOff(): Promise<void> {
        return this.network.request('call/turnAudioOff', { })
    }

    async turnScreenOff(): Promise<void> {
        return this.network.request('call/turnScreenOff', { })
    }
}

export default CallService
