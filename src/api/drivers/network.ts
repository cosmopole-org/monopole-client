
import { Socket, io } from 'socket.io-client';
import config from '../../config';
import { api } from '../..';

class NetworkDriver {

    socket: Socket;
    updateListeners: { [id: string]: (update: any) => void } = {}

    constructor() {
        this.socket = io(config.GATEWAY_ADDRESS)
        this.socket.on('connect', () => {
            api.services.human && api.services.human.signIn()
        })
        this.listenToUpdate()
    }

    listenToUpdate() {
        this.socket.on('update', (update: any) => {
            let callback = this.updateListeners[update.type]
            callback && callback(update)
        })
    }

    addUpdateListener(key: string, callback: (update: any) => void) {
        this.updateListeners[key] = callback
    }

    request(path: string, body: any): Promise<void> {
        console.log('requesting', path, body)
        return new Promise((resolve, reject) => {
            this.socket.emit(path, body, Math.random(), (body: any) => {
                console.log('responsed', path, body)
                if (body.success) {
                    resolve(body)
                } else {
                    reject(body.error)
                }
            })
        })
    }
}

export default NetworkDriver
