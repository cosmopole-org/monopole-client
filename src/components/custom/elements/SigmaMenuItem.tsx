import MenuItem from '@mui/material/MenuItem';
import { Typography } from '@mui/material';

const SigmaMenuItem = (props: { onClick: any, icon: any, caption: string }) => {
    let Icon = props.icon
    return (
        <MenuItem onClick={props.onClick}>
            <Icon />
            <Typography style={{ marginLeft: 8 }}>{props.caption}</Typography>
        </MenuItem>
    );
}

export default SigmaMenuItem
