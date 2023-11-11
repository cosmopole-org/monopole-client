
import { Fab } from "@mui/material"
import { blue } from "@mui/material/colors"

const SigmaFab = (props: { children?: any, onClick?: any, style?: any }) => {
    return (
        <Fab color="primary" onClick={props.onClick} style={{ ...props.style, borderRadius: 16 }}>
            {props.children ? props.children : null}
        </Fab>
    )
}

export default SigmaFab
