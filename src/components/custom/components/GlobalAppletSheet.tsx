import * as React from 'react';
import { Card, SwipeableDrawer } from '@mui/material';
import AppletHost from './AppletHost';
import { themeColor } from '../../../App';
import { api } from '../../..';

let openMachineSheet = (machineId: string) => { }

const GlobalAppletSheet = () => {
    const [code, setCode] = React.useState(undefined)
    const [shown, setShown] = React.useState(false)
    openMachineSheet = (machineId: string) => {
        api.services.worker.onMachinePacketDeliver('get/globalApplet', (data: any) => {
            if (data.machineId === machineId) {
                setCode(data.code)
            }
        })
        setShown(true)
        api.services.worker.use({ machineId, packet: { tag: 'get/globalApplet', colors: themeColor.get({ noproxy: true }) } })
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
                <AppletHost.Host
                    appletKey='global_appletsheet'
                    entry={code ? 'Test' : 'Dummy'}
                    code={code ? code : 'class Dummy { constructor() {} onMount() {} render() { return "" } }'}
                    index={1}
                />
            </SwipeableDrawer>
        </React.Fragment>
    );
}

export { GlobalAppletSheet, openMachineSheet }