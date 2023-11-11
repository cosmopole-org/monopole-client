import * as React from 'react';
import { Add, Edit, KeyboardCommandKey } from '@mui/icons-material';
import { Card, Divider, Drawer } from '@mui/material';
import SigmaMenuItem from '../elements/SigmaMenuItem';
import { blue } from '@mui/material/colors';
import { SigmaRouter } from '../../../App';

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
                <Card style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 100, height: 6, borderRadius: 3, background: blue[50], top: 12 }} />
                <div style={{ width: '100%', height: 32 }} />
                <SigmaMenuItem
                    onClick={() => {
                        props.onClose();
                        SigmaRouter.navigate('createTower', { initialData: { tower: props.tower } })
                    }}
                    icon={Edit}
                    caption='Edit Tower'
                />
                <Divider />
                <SigmaMenuItem onClick={() => { props.onClose(); }} icon={KeyboardCommandKey} caption='Start the timer' />
            </Drawer>
        </React.Fragment >
    );
}

export default TowerMoreMenu
