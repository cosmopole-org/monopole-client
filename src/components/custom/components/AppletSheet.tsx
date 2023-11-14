import * as React from 'react';
import { Card, SwipeableDrawer } from '@mui/material';
import AppletHost from './AppletHost';
import sampleApplet from '../../../resources/code/sampleApplet';
import { themeColor } from '../../../App';

let openAppletSheet = () => {}

const AppletSheet = () => {
    const [shown, setShown] = React.useState(false)
    openAppletSheet = () => setShown(true)
    return (
        <React.Fragment>
            <SwipeableDrawer anchor='bottom' open={shown} onOpen={() => { }} onClose={() => setShown(false)}
                PaperProps={{
                    style: {
                        borderRadius: '24px 24px 0px 0px',
                        minHeight: window.innerHeight * 80 / 100 + 'px',
                        height: window.innerHeight * 80 / 100 + 'px',
                        backgroundColor: themeColor.get({noproxy: true})[100]
                    }
                }}
            >
                <Card style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 100, height: 6, borderRadius: 3, background: themeColor.get({noproxy: true})[50], top: 12 }} />
                <div style={{width: '100%', height: 32}} />
                <AppletHost.Host appletKey='appletsheet' code={sampleApplet} index={1} />
            </SwipeableDrawer>
        </React.Fragment >
    );
}

export { AppletSheet, openAppletSheet }
