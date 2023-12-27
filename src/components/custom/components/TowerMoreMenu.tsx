import * as React from 'react';
import { Add, Delete, Edit, KeyboardCommandKey } from '@mui/icons-material';
import { Card, Divider, Drawer } from '@mui/material';
import SigmaMenuItem from '../elements/SigmaMenuItem';
import { SigmaRouter, themeColor } from '../../../App';
import { api } from '../../..';

const TowerMoreMenu = (props: { shown: boolean, onClose: () => void, tower: any }) => {
    return (
        <React.Fragment>
            <Drawer anchor='bottom' open={props.shown} onClose={() => props.onClose()}
                PaperProps={{
                    style: {
                        borderRadius: '24px 24px 0px 0px'
                    }
                }}
            >
                <Card style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 100, height: 6, borderRadius: 3, background: themeColor.get({ noproxy: true })[50], top: 12 }} />
                <div style={{ width: '100%', height: 32 }} />
                <SigmaMenuItem
                    onClick={() => {
                        props.onClose();
                        SigmaRouter.navigate('createTower', { initialData: { tower: props.tower } })
                    }}
                    icon={Edit}
                    caption='Edit Tower'
                />
                <SigmaMenuItem
                    onClick={() => {
                        if (window.confirm('do you want to delete this tower ?')) {
                            props.onClose();
                            api.services.tower.remove({ towerId: props.tower.id })
                        }
                    }}
                    icon={Delete}
                    caption='Delete Tower'
                />
                <Divider />
            </Drawer>
        </React.Fragment >
    );
}

export default TowerMoreMenu
