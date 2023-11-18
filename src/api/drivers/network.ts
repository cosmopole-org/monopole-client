
import { Socket, io } from 'socket.io-client';
import config from '../../config';
import { api } from '../..';

class NetworkDriver {

    socket: Socket;
    updateListeners: { [id: string]: { [id: string]: (update: any) => void } } = {}

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
            callback && callback[update.packet.tag] && callback[update.packet.tag](update)
        })
    }

    addUpdateListener(key: string, callback: (update: any) => void, tag: string) {
        if (!this.updateListeners[key]) this.updateListeners[key] = {}
        this.updateListeners[key][tag] = callback
    }

    request(path: string, body: any): Promise<void> {
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
