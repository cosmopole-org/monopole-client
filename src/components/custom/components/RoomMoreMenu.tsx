import * as React from 'react';
import { Delete, Edit, KeyboardCommandKey } from '@mui/icons-material';
import { Card, Divider, Drawer } from '@mui/material';
import SigmaMenuItem from '../elements/SigmaMenuItem';
import { SigmaRouter, themeColor } from '../../../App';
import { api } from '../../..';

const RoomMoreMenu = (props: { shown: boolean, onClose: () => void, onOpeningNewPage?: () => void, room: any }) => {
    return (
        <React.Fragment>
            <Drawer anchor='bottom' open={props.shown} onClose={() => props.onClose()}
                PaperProps={{
                    style: {
                        borderRadius: '24px 24px 0px 0px'
                    }
                }}
            >
                <Card style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 100, height: 6, borderRadius: 3, background: themeColor.get({noproxy: true})[50], top: 12 }} />
                <div style={{ width: '100%', height: 32 }} />
                <SigmaMenuItem
                    onClick={() => {
                        props.onClose();
                        props.onOpeningNewPage && props.onOpeningNewPage();
                        SigmaRouter.navigate('createRoom', { initialData: { room: props.room, towerId: props.room.towerId } })
                    }}
                    icon={Edit}
                    caption='Edit Room'
                />
                <SigmaMenuItem
                    onClick={() => {
                        props.onClose();
                        if (window.confirm('are you sure you want to delete this room ?')) {
                            api.services.room.remove({ towerId: props.room.towerId, roomId: props.room.id })
                        }
                    }}
                    icon={Delete}
                    caption='Delete Room'
                />
                <Divider />
            </Drawer>
        </React.Fragment >
    );
}

export default RoomMoreMenu
