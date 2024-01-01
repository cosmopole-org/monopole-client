import * as React from 'react';
import { Card, CircularProgress, Fab, Paper, SwipeableDrawer } from '@mui/material';
import AppletHost from './AppletHost';
import { themeColor, themeColorName, themeColorSecondary } from '../../../App';
import { api } from '../../..';
import IRoom from '../../../api/models/room';
import Safezone, { shownFlags } from './Safezone';
import { useHookstate } from '@hookstate/core';
import { readyState } from './Desktop';
import Loading from './Loading';

let openAppletSheet = (room: IRoom, workerId: string) => { }
let closeAppletSheet = () => { }
let notifyAppletSheetReady = () => { }
let appletsheetOpen = false

const AppletSheet = () => {
    const [code, setCode]: [any, any] = React.useState(undefined)
    const [shown, setShown]: [boolean, any] = React.useState(false)
    const workerIdRef: any = React.useRef(undefined)
    const ready = useHookstate(readyState).get({ noproxy: true })
    const roomRef: any = React.useRef(undefined)
    React.useEffect(() => {
        const messageCallback = (e: any) => {
            let workerId = undefined
            let iframes = document.getElementsByTagName('iframe');
            for (let i = 0, iframe, win; i < iframes.length; i++) {
                iframe = iframes[i];
                win = iframe.contentWindow
                if (win === e.source) {
                    workerId = iframe.id.substring('safezone-'.length)
                    break
                }
            }
            let data = e.data
            if (workerId && (workerId === workerIdRef.current)) {
                if (data.key === 'onLoad') {
                    (document.getElementById(`safezone-${workerId}`) as any)?.contentWindow.postMessage({ key: 'setup', myHumanId: api.memory.myHumanId.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }) }, 'https://safezone.liara.run/')
                } else if (data.key === 'ready') {
                    if (!shownFlags[workerId].get({ noproxy: true })) {
                        (document.getElementById(`safezone-${workerId}`) as any)?.contentWindow.postMessage({ key: 'start' }, 'https://safezone.liara.run/')
                        shownFlags[workerId].set(true)
                    }
                    readyState.set(true)
                } else if (data.key === 'ask') {
                    let packet = data.packet
                    if (roomRef.current) {
                        api.services.worker.use({ packet, towerId: roomRef.current.towerId, roomId: roomRef.current.id, workerId: workerId })
                    }
                }
            }
        }
        window.addEventListener('message', messageCallback)
        let getAppletEvent = api.services.worker.onMachinePacketDeliver('get/applet', 'get/applet', (data: any) => {
            if (data.workerId === workerIdRef.current) {
                setCode(data.code)
            }
        })
        return () => {
            window.removeEventListener('message', messageCallback)
            getAppletEvent.unregister()
        }
    }, [])
    closeAppletSheet = () => setShown(false)
    openAppletSheet = (room: IRoom, workerId: string) => {
        workerIdRef.current = workerId
        roomRef.current = room
        setShown(true)
        api.services.worker.use({ towerId: room.towerId, roomId: room.id, workerId, packet: { tag: 'get/applet', secondaryColor: themeColorSecondary.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }), colors: themeColor.get({ noproxy: true }) } })
    }
    appletsheetOpen = shown
    return (
        <React.Fragment>
            <SwipeableDrawer anchor='bottom' open={shown} onOpen={() => { }} onClose={() => {
                readyState.set(false)
                setCode(undefined)
                setShown(false)
            }}
                disableSwipeToOpen
                PaperProps={{
                    style: {
                        borderRadius: '24px 24px 0px 0px',
                        minHeight: window.innerHeight * 80 / 100 + 'px',
                        height: window.innerHeight * 80 / 100 + 'px',
                        backgroundColor: themeColor.get({ noproxy: true })[50],
                        overflowY: 'auto'
                    }
                }}
            >
                <Card style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 100, height: 6, borderRadius: 3, background: themeColor.get({ noproxy: true })[100], top: 12 }} />
                <div style={{ width: '100%', height: 32 }} />
                {
                    code?.startsWith('safezone/') ? (
                        <Safezone code={code} workerId={workerIdRef.current} roomId={roomRef.current.id} towerId={roomRef.current.towerId} />
                    ) : (
                        <AppletHost.Host
                            appletKey='appletsheet'
                            entry={code ? 'Test' : 'Dummy'}
                            code={code ? code : 'class Dummy { constructor() {} onMount() {} render() { return "" } }'}
                            index={1}
                        />
                    )
                }
                {
                    (!code || (code && code?.startsWith('safezone/') && !ready)) ? (
                        <Loading onCancel={() => {
                            readyState.set(false)
                            setCode(undefined)
                            setShown(false)
                        }} />
                    ) : null
                }
            </SwipeableDrawer>
        </React.Fragment>
    );
}

export { AppletSheet, openAppletSheet, closeAppletSheet, notifyAppletSheetReady, appletsheetOpen }
