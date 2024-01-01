import * as React from 'react';
import { Card, CircularProgress, Fab, Paper, SwipeableDrawer } from '@mui/material';
import AppletHost from './AppletHost';
import { closeOverlaySafezone, themeBasedTextColor, themeColor, themeColorName, themeColorSecondary } from '../../../App';
import { api } from '../../..';
import IRoom from '../../../api/models/room';
import Safezone, { shownFlags } from './Safezone';
import room from '../../../api/drivers/database/schemas/room';
import { Close } from '@mui/icons-material';
import { closeMachineSheet } from './GlobalAppletSheet';
import SigmaFab from '../elements/SigmaFab';
import { useHookstate } from '@hookstate/core';
import { readyState } from './Desktop';

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
        api.services.worker.onMachinePacketDeliver('get/applet', 'get/applet', (data: any) => {
            if (data.workerId === workerIdRef.current) {
                setCode(data.code)
            }
        })
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
                        <Paper style={{ width: 56, height: 56, position: 'absolute', left: '50%', top: 'calc(50% - 16px)', transform: 'translate(-50%, -50%)', borderRadius: '50%' }}>
                            <CircularProgress style={{ width: '80%', height: '80%', margin: '10%' }} variant="indeterminate" />
                        </Paper>
                    ) : null
                }
                {
                    (!code || (code && code?.startsWith('safezone/') && !ready)) ? (
                        <SigmaFab onClick={() => {
                            readyState.set(false)
                            setCode(undefined)
                            setShown(false)
                        }} variant="extended" style={{ position: 'absolute', left: '50%', top: 'calc(50% - 16px + 68px)', transform: 'translate(-50%, -50%)' }}>
                            <Close style={{ fill: themeBasedTextColor.get({ noproxy: true }), marginRight: 12 }} />
                            Cancel
                        </SigmaFab>
                    ) : null
                }
            </SwipeableDrawer>
        </React.Fragment>
    );
}

export { AppletSheet, openAppletSheet, closeAppletSheet, notifyAppletSheetReady, appletsheetOpen }
