
import { Fab } from "@mui/material"

const SigmaFab = (props: { variant?: any, color?: any, children?: any, onClick?: any, style?: any, size?: any, className?: any, elevation?: number }) => {
    return (
        <Fab color={props.color ? props.color : 'secondary'} sx={{ boxShadow: props.elevation !== undefined ? props.elevation : 2 }} variant={props.variant} size={props.size} onClick={props.onClick} style={{ borderRadius: 16, ...props.style }}
            className={props.className}>
            {props.children ? props.children : null}
        </Fab>
    )
}

export default SigmaFab
