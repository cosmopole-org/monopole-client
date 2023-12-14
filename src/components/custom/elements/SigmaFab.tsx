
import { Fab } from "@mui/material"

const SigmaFab = (props: { variant?: any, children?: any, onClick?: any, style?: any, size?: any, className?: any }) => {
    return (
        <Fab sx={{ boxShadow: 2 }} variant={props.variant} color="primary" size={props.size} onClick={props.onClick} style={{ borderRadius: 16, ...props.style }}
            className={props.className}>
            {props.children ? props.children : null}
        </Fab>
    )
}

export default SigmaFab
