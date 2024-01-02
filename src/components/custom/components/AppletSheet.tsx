import * as React from 'react';
import { Card, CircularProgress, Fab, Paper, SwipeableDrawer, Typography } from '@mui/material';
import AppletHost from './AppletHost';
import { themeBasedTextColor, themeColor, themeColorName, themeColorSecondary } from '../../../App';
import { api } from '../../..';
import IRoom from '../../../api/models/room';
import { useHookstate } from '@hookstate/core';
import Loading from './Loading';
import useSafezone from '../../hooks/useSafezone';
import { Close } from '@mui/icons-material';
import SigmaFab from '../elements/SigmaFab';

let openAppletSheet = (room: IRoom, workerId: string) => { }
let closeAppletSheet = () => { }
let notifyAppletSheetReady = () => { }
let appletsheetOpen = false

const AppletSheet = () => {
    const [code, setCode]: [any, any] = React.useState(undefined)
    const [shown, setShown]: [boolean, any] = React.useState(false)
    const workerIdRef: any = React.useRef(undefined)
    const roomRef: any = React.useRef(undefined)
    const safezoneRepo = useSafezone()
    const safezoneRef: any = React.useRef(undefined)
    const readyState = useHookstate(safezoneRef.current?.ready)
    const ready = readyState?.get({ noproxy: true })
    React.useEffect(() => {
        let getAppletEvent = api.services.worker.onMachinePacketDeliver('get/applet', 'get/applet', (data: any) => {
            if (data.workerId === workerIdRef.current) {
                setCode(data.code)
            }
        })
        return () => {
            getAppletEvent.unregister()
        }
    }, [])
    closeAppletSheet = () => setShown(false)
    openAppletSheet = (room: IRoom, workerId: string) => {
        workerIdRef.current = workerId
        roomRef.current = room
        safezoneRef.current = safezoneRepo.accessSafeZoneController().findById(workerId)
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
                <AppletHost.Host
                    appletKey={'desktop-sheet-' + workerIdRef.current}
                    entry={code ? 'Test' : 'Dummy'}
                    code={code ? code : 'class Dummy { constructor() {} onMount() {} render() { return "" } }'}
                    index={1}
                    room={roomRef.current}
                    onCancel={() => {
                        setCode(undefined)
                        setShown(false)
                    }}
                />
                {
                    !code ? (
                        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                            <div style={{ width: 'auto', height: 'auto', position: 'relative', padding: 32, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                <Paper style={{ width: 56, height: 56, borderRadius: '50%', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                                    <CircularProgress style={{ width: '80%', height: '80%', margin: '10%' }} variant="indeterminate" />
                                </Paper>
                                <div style={{ width: 56, height: 56 }} />
                                <Typography variant="body1" style={{ width: 250, textAlign: 'center', marginTop: 12 }}>
                                    Connecting to Applet...
                                </Typography>
                                <SigmaFab
                                    style={{ marginTop: 32 }}
                                    onClick={() => {
                                        setCode(undefined)
                                        setShown(false)
                                    }}
                                    variant="extended"
                                >
                                    <Close style={{ fill: themeBasedTextColor.get({ noproxy: true }), marginRight: 12 }} />
                                    Cancel
                                </SigmaFab>
                            </div>
                        </div>
                    ) : null
                }
            </SwipeableDrawer>
        </React.Fragment>
    );
}

export { AppletSheet, openAppletSheet, closeAppletSheet, notifyAppletSheetReady, appletsheetOpen }
