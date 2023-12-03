import * as React from 'react';
import { Add, Edit, KeyboardCommandKey } from '@mui/icons-material';
import { Card, Divider, Drawer, SwipeableDrawer } from '@mui/material';
import SigmaMenuItem from '../elements/SigmaMenuItem';
import { themeColor } from '../../../App';
import { desktopEditMode } from '../../tabs/Desk';

const RoomControl = (props: { toggleEditMode: (v: boolean) => void, openToolbox: () => void, shown: boolean, onClose: () => void }) => {
    return (
        <React.Fragment>
            <SwipeableDrawer anchor='bottom' open={props.shown} onOpen={() => { }} onClose={() => props.onClose()}
                disableSwipeToOpen
                PaperProps={{
                    style: {
                        borderRadius: '24px 24px 0px 0px'
                    }
                }}
            >
                <Card style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 100, height: 6, borderRadius: 3, background: themeColor.get({ noproxy: true })[50], top: 12 }} />
                <div style={{ width: '100%', height: 32 }} />
                <SigmaMenuItem onClick={() => { props.onClose(); props.openToolbox(); }} icon={Add} caption='Add new machine' />
                <SigmaMenuItem onClick={() => { props.onClose(); props.toggleEditMode(!desktopEditMode.get({ noproxy: true })); }} icon={Edit} caption={desktopEditMode.get({ noproxy: true }) ? 'Stop edit Mode' : 'Start edit mode'} />
                <Divider />
                <SigmaMenuItem onClick={() => { props.onClose(); }} icon={KeyboardCommandKey} caption='Start the timer' />
                <SigmaMenuItem onClick={() => { props.onClose(); }} icon={KeyboardCommandKey} caption='Create new whiteboard' />
                <SigmaMenuItem onClick={() => { props.onClose(); }} icon={KeyboardCommandKey} caption='Start a call' />
                <SigmaMenuItem onClick={() => { props.onClose(); }} icon={KeyboardCommandKey} caption='Upload new file' />
            </SwipeableDrawer>
        </React.Fragment >
    );
}

export default RoomControl
