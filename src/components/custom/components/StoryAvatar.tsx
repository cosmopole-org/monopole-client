import { Avatar } from "@mui/material"
import { themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"

const StoryAvatar = () => {
    return (
        <SigmaAvatar style={{ width: 48, height: 48, maxWidth: 48, marginLeft: 16, border: '3px solid ' + themeColor.get({ noproxy: true })[100] }}>
            A
        </SigmaAvatar>
    )
}

export default StoryAvatar
