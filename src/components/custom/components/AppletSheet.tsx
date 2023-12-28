import * as React from 'react';
import { Card, SwipeableDrawer } from '@mui/material';
import AppletHost from './AppletHost';
import { themeColor, themeColorName, themeColorSecondary } from '../../../App';
import { api } from '../../..';
import IRoom from '../../../api/models/room';
import Safezone from './Safezone';
import room from '../../../api/drivers/database/schemas/room';

let openAppletSheet = (room: IRoom, workerId: string) => { }

const AppletSheet = () => {
    const [code, setCode]: [any, any] = React.useState(undefined)
    const [shown, setShown]: [boolean, any] = React.useState(false)
    const workerIdRef: any = React.useRef(undefined)
    const roomRef: any = React.useRef(undefined)    
    openAppletSheet = (room: IRoom, workerId: string) => {
        workerIdRef.current = workerId
        roomRef.current = room
        api.services.worker.onMachinePacketDeliver('get/applet', (data: any) => {
            if (data.workerId === workerId) {
                setCode(data.code)
            }
        })
        setShown(true)
        api.services.worker.use({ towerId: room.towerId, roomId: room.id, workerId, packet: { tag: 'get/applet', secondaryColor: themeColorSecondary.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }), colors: themeColor.get({ noproxy: true }) } })
    }
    React.useEffect(() => {
        if (!shown) {
            setCode(undefined)

        }
    }, [shown]);
    return (
        <React.Fragment>
            <SwipeableDrawer anchor='bottom' open={shown} onOpen={() => { }} onClose={() => setShown(false)}
                disableSwipeToOpen
                PaperProps={{
                    style: {
                        borderRadius: '24px 24px 0px 0px',
                        minHeight: window.innerHeight * 80 / 100 + 'px',
                        height: window.innerHeight * 80 / 100 + 'px',
                        backgroundColor: themeColor.get({ noproxy: true })[50]
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
            </SwipeableDrawer>
        </React.Fragment>
    );
}

export { AppletSheet, openAppletSheet }
