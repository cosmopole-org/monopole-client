import { Avatar } from "@mui/material"
import { themeColor, themeColorName } from "../../../App"

const SigmaAvatar = (props: { children?: any, style?: any }) => {
    return (
        <Avatar style={{ ...props.style, backgroundColor: themeColor.get({ noproxy: true })[200], color: themeColorName.get({noproxy: true}) === 'night' ? '#fff' : '#000' }}>
            {props.children}
        </Avatar>
    )
}

export default SigmaAvatar
