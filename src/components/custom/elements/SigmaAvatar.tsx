import { Avatar } from "@mui/material"
import { themeColor } from "../../../App"

const SigmaAvatar = (props: { children?: any, style?: any }) => {
    return (
        <Avatar style={{ ...props.style, backgroundColor: themeColor.get({ noproxy: true })[300] }}>
            {props.children}
        </Avatar>
    )
}

export default SigmaAvatar
