import { State, hookstate, none } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import utils from "../../components/utils"
import { api } from "../.."
import { SigmaRouter } from "../../App"

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

    calls: State<any> = hookstate({})

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

        this.onCallCreated('call-service', (data: any) => {
            let { creatorId, towerId, roomId } = data
            const myHumanId = api.memory.myHumanId.get({ noproxy: true })
            this.calls.merge({ [roomId]: true })
            if (creatorId !== myHumanId) {
                let tower = api.memory.spaces[towerId].get({ noproxy: true })
                if (tower) {
                    let room = tower.rooms[roomId]
                    utils.toasts.showCallToast(tower, room, () => {
                        SigmaRouter.navigate('call', { initialData: { room } })
                    })
                }
            }
        })

        this.onCallDestructed('call-service', (data: any) => {
            let { roomId } = data
            this.calls.merge({ [roomId]: true })
        })
    }

    onCallCreated(tag: string, callback: any) {
        this.network.addUpdateListener('call/onCreate', (data: any) => {
            callback(data)
        }, tag)
        return {
            unregister: () => this.network.removeUpdateListener('call/onCreate', tag)
        }
    }

    onCallDestructed(tag: string, callback: any) {
        this.network.addUpdateListener('call/onDestruct', (data: any) => {
            let { roomId } = data
            this.calls.merge({ [roomId]: none })
            callback(data)
        }, tag)
        return {
            unregister: () => this.network.removeUpdateListener('call/onCreate', tag)
        }
    }

    onPeerJoinedCall(tag: string, callback: any) {
        this.network.addUpdateListener('call/onJoin', (data: any) => {
            callback(data)
        }, tag)
        return {
            unregister: () => this.network.removeUpdateListener('call/onJoin', tag)
        }
    }

    onPeerLeftCall(tag: string, callback: any) {
        this.network.addUpdateListener('call/onLeave', (data: any) => {
            callback(data)
        }, tag)
        return {
            unregister: () => this.network.removeUpdateListener('call/onLeave', tag)
        }
    }

    onPeerTurnedVideoOff(tag: string, callback: any) {
        this.network.addUpdateListener('call/onVideoTurnOff', (data: any) => {
            callback(data)
        }, tag)
        return {
            unregister: () => this.network.removeUpdateListener('call/onVideoTurnOff', tag)
        }
    }

    onPeerTurnedAudioOff(tag: string, callback: any) {
        this.network.addUpdateListener('call/onAudioTurnOff', (data: any) => {
            callback(data)
        }, tag)
        return {
            unregister: () => this.network.removeUpdateListener('call/onAudioTurnOff', tag)
        }
    }

    onPeerTurnedScreenOff(tag: string, callback: any) {
        this.network.addUpdateListener('call/onScreenTurnOff', (data: any) => {
            callback(data)
        }, tag)
        return {
            unregister: () => this.network.removeUpdateListener('call/onScreenTurnOff', tag)
        }
    }

    async activeCalls(): Promise<void> {
        return this.network.request('call/activeCalls', {}).then((body: any) => {
            let { activeCalls: ac } = body
            let dict: { [id: string]: boolean } = {}
            ac.forEach((c: any) => {
                dict[c.id] = true
            });
            this.calls.set(dict)
            return body
        })
    }

    async getIceServers(): Promise<void> {
        return this.network.request('call/getIceServers', {})
    }

    async joinCall(data: { towerId: string, roomId: string }): Promise<void> {
        return this.network.request('call/joinCall', { towerId: data.towerId, roomId: data.roomId })
    }

    async leaveCall(): Promise<void> {
        return this.network.request('call/leaveCall', {})
    }

    async turnVideoOff(): Promise<void> {
        return this.network.request('call/turnVideoOff', {})
    }

    async turnAudioOff(): Promise<void> {
        return this.network.request('call/turnAudioOff', {})
    }

    async turnScreenOff(): Promise<void> {
        return this.network.request('call/turnScreenOff', {})
    }
}

export default CallService
