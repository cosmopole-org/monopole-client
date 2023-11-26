import * as React from 'react';
import { Edit } from '@mui/icons-material';
import { Card, Drawer } from '@mui/material';
import SigmaMenuItem from '../elements/SigmaMenuItem';
import { themeColor } from '../../../App';

const FileMenu = (props: { shown: boolean, onClose: () => void, onRename: () => void, onDelete: () => void }) => {
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
                        props.onRename();
                        props.onClose();
                    }}
                    icon={Edit}
                    caption='Rename'
                />
                <SigmaMenuItem
                    onClick={() => {
                        props.onDelete();
                        props.onClose();
                    }}
                    icon={Edit}
                    caption='Delete'
                />
            </Drawer>
        </React.Fragment >
    );
}

export default FileMenu
