import { Chip } from "@mui/material"
import { themeColor } from "../../../App"

const SigmaChip = (props: { caption: string, icon: any, style?: any }) => {
    return (
        <Chip style={{ ...props.style, borderRadius: 16, backgroundColor: themeColor.get({noproxy: true})[100] }} icon={props.icon} label={props.caption} />
    )
}

export default SigmaChip
