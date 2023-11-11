import { Chip } from "@mui/material"
import { blue } from "@mui/material/colors"

const SigmaChip = (props: { caption: string, icon: any, style?: any }) => {
    return (
        <Chip style={{ ...props.style, borderRadius: 16, backgroundColor: blue[100] }} icon={props.icon} label={props.caption} />
    )
}

export default SigmaChip
