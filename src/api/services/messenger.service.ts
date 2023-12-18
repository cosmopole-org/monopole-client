import { State, hookstate } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import IMessage from "../models/message"
import { none } from "@hookstate/core"
import memoryUtils from "../utils/memory"
import encodingUtils from "../utils/encoding"

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
            }
        })

        this.onMessageReceived('messenger-service', (data: any) => {
            let { message } = data
            this.check(message.roomId)
            this.memory.messages[message.roomId].merge([message])
        })
    }

    check(roomId: string) {
        if (!this.memory.messages[roomId]) this.memory.messages[roomId] = hookstate([])
    }

    onMessageReceived(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('message/onCreate', (data: any) => {
            let { message } = data
            if ((message.type === MessageTypes.TEXT) && message.data.distributionMessage) {
                (window as any).decrypt(message.roomId, message.authorId, message.data.text, message.data.distributionMessage, (decrypted: string) => {
                    message.data.text = decrypted
                    callback(data)
                })
            } else {
                callback(data)
            }
        }, tag)
    }

    onMessageEdited(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('message/onUpdate', (data: any) => {
            let { message } = data
            if ((message.type === MessageTypes.TEXT) && message.data.distributionMessage) {
                (window as any).decrypt(message.roomId, message.authorId, message.data.text, message.data.distributionMessage, (decrypted: string) => {
                    message.data.text = decrypted
                    callback(data)
                })
            } else {
                callback(data)
            }
        }, tag)
    }

    private onMessageDeleted(tag: string, callback: (data: any) => void) {
        this.network.addUpdateListener('message/onRemove', (data: any) => {
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
                                data: { text: encodingUtils.b64.bytesToBase64(encrypted), distributionMessage: dm }
                            }
                        }))
                    })
                } else {
                    resolve(this.network.request('messenger/create', { towerId: data.towerId, roomId: data.roomId, message: data.message }))
                }
            } else {
                resolve(this.network.request('messenger/create', { towerId: data.towerId, roomId: data.roomId, message: data.message }))
            }
        })
    }

    async update(data: { towerId: string, roomId: string, message: { id: string, data: any } }): Promise<void> {
        return this.network.request('messenger/update', { towerId: data.towerId, roomId: data.roomId, message: data.message })
    }

    async remove(data: { towerId: string, roomId: string, messageId: string }): Promise<any> {
        return this.network.request('messenger/remove', { towerId: data.towerId, roomId: data.roomId, messageId: data.messageId }).then((body: any) => {
            this.memory.messages[data.roomId][this.memory.messages[data.roomId].get({ noproxy: true }).findIndex((m: IMessage) => m.id === data.messageId)]?.set(none)
            return body
        })
    }

    async read(data: { towerId: string, roomId: string, offset?: number, count?: number }): Promise<any> {
        return this.network.request('messenger/read', { towerId: data.towerId, roomId: data.roomId, offset: data.offset, count: data.count }).then((body: any) => {
            this.check(data.roomId)
            this.memory.messages[data.roomId].set(body.messages)
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
}

export default MessengerService
