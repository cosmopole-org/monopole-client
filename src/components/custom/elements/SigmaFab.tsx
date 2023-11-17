
import { Fab } from "@mui/material"

const SigmaFab = (props: { variant?: any, children?: any, onClick?: any, style?: any, size?: any, className?: any }) => {
    return (
        <Fab variant={props.variant} color="primary" size={props.size} onClick={props.onClick} style={{ ...props.style, borderRadius: 16 }}
            className={props.className}>
            {props.children ? props.children : null}
        </Fab>
    )
}

export default SigmaFab
