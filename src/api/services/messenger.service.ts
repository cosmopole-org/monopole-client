import { State, hookstate } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import IMessage from "../models/message"
import { none } from "@hookstate/core"
import memoryUtils from "../utils/memory"
import encodingUtils from "../utils/encoding"
import ITower from "../models/tower"
import { SigmaRouter, Toasts } from "../../App"
import IRoom from "../models/room"
import { api } from "../.."

export let MessageTypes = {
    TEXT: "text",
    PHOTO: "photo",
    AUDIO: "audio",
    VIDEO: "video",
    DOCUMENT: "document",
    STICKER: "sticker"
}

class MessengerService {

    storage: DatabaseDriver
    network: NetworkDriver
    memory: {
        myHumanId: State<any>,
        spaces: State<any>,
        humans: State<any>,
        machines: State<any>,
        messages: { [id: string]: any },
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
            messages: { [id: string]: any },
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

        this.onMessageDeleted('messenger-service', (data: any) => {
            let { message } = data
            if (this.memory.messages[message.roomId]) {
                this.memory.messages[message.roomId][this.memory.messages[message.roomId].get({ noproxy: true }).findIndex((m: IMessage) => m.id === message.id)]?.set(none)
                let tower: any = Object.values(this.memory.spaces.get({ noproxy: true })).find((tower: any) => tower.rooms[message.roomId] !== undefined)
                if (tower) {
                    this.roomUnseenCount({ towerId: tower.id, roomId: message.roomId })
                }
            }
        })

        this.onMessageReceived('messenger-service', (data: any) => {
            let { message } = data
            this.check(message.roomId)
            if ((message.type === MessageTypes.TEXT) && message.data.distributionMessage) {
                (window as any).decrypt(message.roomId, message.authorId, message.data.text, message.data.distributionMessage, (decrypted: string) => {
                    message.data.text = decrypted
                    this.memory.messages[message.roomId].merge([message])
                })
            } else {
                this.memory.messages[message.roomId].merge([message])
            }
            let tower: any = Object.values(this.memory.spaces.get({ noproxy: true })).find((tower: any) => tower.rooms[message.roomId] !== undefined)
            if (tower) {
                this.roomUnseenCount({ towerId: tower.id, roomId: message.roomId })
            }
            if (
                (SigmaRouter.topPath() === 'room' || SigmaRouter.topPath() === 'chat')
                && (SigmaRouter.topInitData() as any).room?.id === message.roomId
            ) {
                // do nothing
            } else {
                Toasts.showMessageToast(message, tower, tower.rooms[message.roomId], () => {
                    if (Object.values(api.memory.chats.get({ noproxy: true })).find(chat => chat.roomId === message.roomId)) {
                        SigmaRouter.navigate('chat', { initialData: { room: tower.rooms[message.roomId] } })
                    } else {
                        SigmaRouter.navigate('room', { initialData: { room: tower.rooms[message.roomId] } });
                    }
                })
            }
        })

        this.onMessageSeen('messenger-service', (data: any) => {
            let { messageId, roomId } = data
            this.check(roomId)
            let index: number = this.memory.messages[roomId].get({ noproxy: true }).findIndex((msg: IMessage) => msg.id === messageId)
            let message = this.memory.messages[roomId].get({ noproxy: true })[index]
            if (message) {
                message.seen = true
            }
            this.memory.messages[roomId].merge({ index: message })
        })
    }

    unseenMsgCount: State<any> = hookstate({})

    check(roomId: string) {
        if (!this.memory.messages[roomId]) {
            this.memory.messages[roomId] = hookstate([])
            this.unseenMsgCount.merge({ [roomId]: 0 })
        }
    }

    onMessageReceived(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('message/onCreate', (data: any) => {
            let { message } = data
            if ((message.type === MessageTypes.TEXT) && message.data.distributionMessage) {
                (window as any).decrypt(message.roomId, message.authorId,
                    encodingUtils.b64.base64ToBytes(message.data.text),
                    encodingUtils.b64.base64ToBytes(message.data.distributionMessage),
                    (decrypted: string) => {
                        message.data.text = decrypted
                        callback(data)
                    })
            } else {
                callback(data)
            }
        }, tag)
        return {
            unregister: () => this.network.removeUpdateListener('message/onCreate', tag)
        }
    }

    onMessageEdited(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('message/onUpdate', (data: any) => {
            let { message } = data
            if ((message.type === MessageTypes.TEXT) && message.data.distributionMessage) {
                (window as any).decrypt(
                    message.roomId,
                    message.authorId,
                    encodingUtils.b64.base64ToBytes(message.data.text),
                    encodingUtils.b64.base64ToBytes(message.data.distributionMessage),
                    (decrypted: string) => {
                        message.data.text = decrypted
                        callback(data)
                    }
                )
            } else {
                callback(data)
            }
        }, tag)
        return {
            unregister: () => this.network.removeUpdateListener('message/onUpdate', tag)
        }
    }

    private onMessageDeleted(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('message/onRemove', (data: any) => {
            callback(data)
        }, tag)
    }

    private onMessageSeen(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('message/onSeen', (data: any) => {
            callback(data)
        }, tag)
    }

    async create(data: { towerId: string, roomId: string, message: { type: string, data: any }, secure?: boolean }): Promise<IMessage> {
        return new Promise(resolve => {
            if (data.message.type === MessageTypes.TEXT) {
                if (data.secure) {
                    (window as any).encrypt(data.roomId, this.memory.myHumanId.get({ noproxy: true }), data.message.data.text, (encrypted: any, dm: any) => {
                        resolve(this.network.request('messenger/create', {
                            towerId: data.towerId, roomId: data.roomId,
                            message: {
                                type: data.message.type,
                                data: { text: encodingUtils.b64.bytesToBase64(encrypted), distributionMessage: encodingUtils.b64.bytesToBase64(dm) }
                            }
                        }).then((body: any) => {
                            return body
                        }))
                    })
                } else {
                    resolve(this.network.request('messenger/create', { towerId: data.towerId, roomId: data.roomId, message: data.message }).then((body: any) => {
                        return body
                    }))
                }
            } else {
                resolve(this.network.request('messenger/create', { towerId: data.towerId, roomId: data.roomId, message: data.message }).then((body: any) => {
                    return body
                }))
            }
            this.roomUnseenCount({ towerId: data.towerId, roomId: data.roomId })
        })
    }

    async update(data: { towerId: string, roomId: string, message: { id: string, data: any } }): Promise<void> {
        return this.network.request('messenger/update', { towerId: data.towerId, roomId: data.roomId, message: data.message })
    }

    async remove(data: { towerId: string, roomId: string, messageId: string }): Promise<any> {
        return this.network.request('messenger/remove', { towerId: data.towerId, roomId: data.roomId, messageId: data.messageId }).then((body: any) => {
            this.memory.messages[data.roomId][this.memory.messages[data.roomId].get({ noproxy: true }).findIndex((m: IMessage) => m.id === data.messageId)]?.set(none)
            this.roomUnseenCount({ towerId: data.towerId, roomId: data.roomId })
            return body
        })
    }

    async read(data: { towerId: string, roomId: string, offset?: number, count?: number }): Promise<any> {
        return this.network.request('messenger/read', { towerId: data.towerId, roomId: data.roomId, offset: data.offset, count: data.count }).then((body: any) => {
            this.check(data.roomId)
            if (data.count === undefined || data.count > 1) {
                this.memory.messages[data.roomId].set(body.messages)
            }
            this.roomUnseenCount({ towerId: data.towerId, roomId: data.roomId })
            return body
        })
    }

    async lastMessages(): Promise<any> {
        return this.network.request('messenger/lastMessages', {}).then((body: any) => {
            let { rooms } = body
            let authors = rooms.map((room: any) => {
                if (this.memory.messages[room.id]?.get({ noproxy: true })?.length > 0) {
                    // do nothing
                } else {
                    this.check(room.id)
                    if (room.lastMessage) {
                        this.memory.messages[room.id].set([room.lastMessage])
                    } else {
                        this.memory.messages[room.id].set([])
                    }
                }
                return room.lastMessage
            })
                .filter((msg: any) => msg !== undefined)
                .map((msg: any) => msg.author)
            this.storage.factories.human?.createBatch(authors)
            this.memory.humans.set(memoryUtils.humans.prepareHumans(authors, { ...this.memory.humans.get({ noproxy: true }) }))
            return body
        })
    }

    async unssenCount(): Promise<any> {
        return this.network.request('messenger/unseenCount', {}).then((body: any) => {
            let { rooms } = body
            rooms.forEach((room: any) => {
                this.check(room.id)
                this.unseenMsgCount.set({ [room.id]: room.unseenMsgCount })
            })
            return body
        })
    }

    async roomUnseenCount(data: { towerId: string, roomId: string }): Promise<any> {
        return this.network.request('messenger/roomUnseenCount', { towerId: data.towerId, roomId: data.roomId }).then((body: any) => {
            let { room } = body
            this.check(room.id)
            this.unseenMsgCount.set({ [room.id]: room.unseenMsgCount })
            return body
        })
    }
}

export default MessengerService
