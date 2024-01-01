import * as React from 'react';
import { Card, SwipeableDrawer } from '@mui/material';
import AppletHost from './AppletHost';
import { themeColor, themeColorName, themeColorSecondary } from '../../../App';
import { api } from '../../..';
import Safezone from './Safezone';

let openMachineSheet = (machineId: string) => { }
let closeMachineSheet = () => { }

const GlobalAppletSheet = () => {
    const [code, setCode]: [any, any] = React.useState(undefined)
    const [shown, setShown]: [boolean, any] = React.useState(false)
    const machineIdRef: any = React.useRef(undefined)
    closeMachineSheet = () => setShown(false)
    openMachineSheet = (machineId: string) => {
        machineIdRef.current = machineId
        api.services.worker.onMachinePacketDeliver('get/globalApplet', 'get/globalApplet', (data: any) => {
            if (data.machineId === machineId) {
                setCode(data.code)
            }
        })
        setShown(true)
        api.services.worker.use({ machineId, packet: { tag: 'get/globalApplet', secondaryColor: themeColorSecondary.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }), colors: themeColor.get({ noproxy: true }) } })
    }
    React.useEffect(() => {
        if (!shown) setCode(undefined)
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
                        <Safezone code={code} machineId={machineIdRef.current} />
                    ) : (
                        <AppletHost.Host
                            appletKey='globalAppletsheet'
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

export { GlobalAppletSheet, openMachineSheet, closeMachineSheet }
