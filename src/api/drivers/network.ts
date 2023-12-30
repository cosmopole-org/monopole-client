
import { Socket, io } from 'socket.io-client';
import config from '../../config';
import { api } from '../..';

class NetworkDriver {

    socket: Socket;
    updateListeners: { [id: string]: { [id: string]: (update: any) => void } } = {}
    operationTags: { [id: string]: string } = {}

    constructor() {
        this.socket = io(config.GATEWAY_ADDRESS)
        this.socket.on('connect', () => {
            api.services.human && api.services.human.signIn()
        })
        this.listenToUpdate()
    }

    listenToUpdate() {
        this.socket.on('update', (update: any) => {
            console.log(update)
            let callback = this.updateListeners[update.type]
            if (callback) {
                if (update.packet?.tag) {
                    let rs = Object.keys(this.operationTags).filter(tag => {
                        return (this.operationTags[tag] === update.packet.tag)
                    })
                    if (rs.length > 0) {
                        rs.forEach(r => (callback[r] && callback[r](update)))
                    } else {
                        callback[update.packet.tag] && callback[update.packet.tag](update)
                    }
                } else {
                    Object.values(callback).map(subCallback => {
                        subCallback(update)
                    })
                }
            }
        })
    }

    addUpdateListener(key: string, callback: (update: any) => void, tag: string, opTag?: string) {
        if (opTag) {
            this.operationTags[tag] = opTag
        }
        if (!this.updateListeners[key]) this.updateListeners[key] = {}
        this.updateListeners[key][tag !== undefined ? tag : Math.random()] = callback
    }

    removeUpdateListener(key: string, tag: string) {
        if (!this.updateListeners[key]) this.updateListeners[key] = {}
        delete this.updateListeners[key][tag]
    }

    request(path: string, body: any): Promise<any> {
        console.log('requesting', path, body)
        return new Promise((resolve, reject) => {
            this.socket.emit(path, body, Math.random(), (body: any) => {
                console.log('responsed', path, body)
                if (body.success) {
                    resolve(body)
                } else {
                    console.log('error !')
                    //reject(body.error)
                }
            })
        })
    }
}

export default NetworkDriver
