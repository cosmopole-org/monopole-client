
import { useEffect, useRef, useState } from 'react';
import { api } from '../..';
import { State, hookstate } from '@hookstate/core';
import IRoom from '../../api/models/room';
import { themeColorName } from '../../App';

let safezoneRunning = false
class SafeZoneController {
    private static _instance: SafeZoneController
    static get instance() {
        return SafeZoneController._instance
    }
    private safezones: { [id: string]: SafeZoneUnit }
    constructor() {
        SafeZoneController._instance = this
        this.safezones = {}
    }
    findById(id: string) {
        return this.safezones[id]
    }
    create(props: { room?: IRoom, id: string }) {
        this.safezones[props.id] = new SafeZoneUnit(props)
    }
}

class SafeZoneUnit {
    static types = {
        WIDGET: 'widget',
        ROOM_APPLET: 'room_applet',
        GLOBAL_APPLET: 'global_applet'
    }
    shown: State<boolean>
    ready: State<boolean>
    room?: IRoom
    machineId?: string
    workerId?: string
    constructor(props: { room?: IRoom, id: string }) {
        this.room = props.room
        if (this.room) {
            this.workerId = props.id
        } else {
            this.machineId = props.id
        }
        this.ready = hookstate(false)
        this.shown = hookstate(false)
    }
    reset() {
        this.ready.set(false)
        this.shown.set(false)
    }
}

const useSafezone = () => {
    const accessSafeZoneController = () => {
        return SafeZoneController.instance
    }
    useEffect(() => {
        if (!safezoneRunning) {
            const messageCallback = (e: any) => {
                let id = undefined
                let iframes = document.getElementsByTagName('iframe');
                for (let i = 0, iframe, win; i < iframes.length; i++) {
                    iframe = iframes[i];
                    win = iframe.contentWindow
                    if (win === e.source) {
                        id = iframe.id.substring('safezone-'.length)
                        break
                    }
                }
                let data = e.data
                if (id) {
                    let safezone = accessSafeZoneController().findById(id)
                    if (data.key === 'onLoad') {
                        (document.getElementById(`safezone-${id}`) as any)?.contentWindow.postMessage({ key: 'setup', myHumanId: api.memory.myHumanId.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }) }, 'https://safezone.liara.run/')
                    } else if (data.key === 'ready') {
                        if (!safezone.shown.get({ noproxy: true })) {
                            (document.getElementById(`safezone-${id}`) as any)?.contentWindow.postMessage({ key: 'start' }, 'https://safezone.liara.run/')
                            safezone.shown.set(true)
                        }
                    } else if (data.key === 'ask') {
                        let packet = data.packet
                        if (safezone.room) {
                            let r = safezone.room as IRoom
                            api.services.worker.use({ packet, towerId: r.towerId, roomId: r.id, workerId: id })
                        } else {
                            api.services.worker.use({ packet, machineId: id })
                        }
                    }
                }
            }
            window.addEventListener('message', messageCallback)
            new SafeZoneController()
            safezoneRunning = true
        }
    }, [])
    return { accessSafeZoneController }
}

export default useSafezone
