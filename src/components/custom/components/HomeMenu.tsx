import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import { Add, CameraAlt, CameraAltOutlined, Explore, Forum, Inbox, Mic, MicOutlined, MoreHoriz, MoreVert, Videocam, VideocamOutlined, WorkspacesOutlined } from '@mui/icons-material';
import { SigmaRouter } from '../../../App';

export default function HomeMenu(props: { style?: any }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <IconButton
                onClick={handleClick}
                sx={{ ml: 2 }}
                style={props.style}
            >
                <MoreHoriz />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    style: {
                        transform: 'translateY(-32px)',
                        maxWidth: 300,
                        borderRadius: 16,
                        position: 'fixed',
                        right: 72,
                        overflow: 'hidden'
                    },
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            bottom: 0,
                            right: 14,
                            width: 14,
                            height: 14,
                            transform: 'translateY(50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => {
                    SigmaRouter.navigate('explore')
                }}>
                    <ListItemIcon>
                        <Explore />
                    </ListItemIcon>
                    Explore
                </MenuItem>
                <MenuItem onClick={() => {
                    SigmaRouter.navigate('settings')
                }}>
                    <ListItemIcon>
                        <Explore />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={() => {
                    SigmaRouter.navigate('chats')
                }}>
                    <ListItemIcon>
                        <Forum />
                    </ListItemIcon>
                    Chats
                </MenuItem>
                <MenuItem onClick={() => {
                    SigmaRouter.navigate('inbox')
                }}>
                    <ListItemIcon>
                        <Inbox />
                    </ListItemIcon>
                    Inbox
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
