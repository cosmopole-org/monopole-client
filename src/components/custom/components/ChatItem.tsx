
import { Card, Typography } from "@mui/material"
import { SigmaRouter, themeBasedTextColor, themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import { useHookstate } from "@hookstate/core"
import { api } from "../../.."

const ChatItem = (props: { chat: any, style?: any, onMoreClicked?: () => void }) => {
    const mainRoom: any = Object.values(props.chat.rooms)[0]
    const messagesList = useHookstate(api.memory.messages[mainRoom.id]).get({ noproxy: true })
    return (
        <div style={{ ...props.style, display: 'flex', position: 'relative', width: '100%', height: 64 }}
            onClick={() => {
                SigmaRouter.navigate('chat', { initialData: { room: mainRoom } })
            }}>
            <SigmaAvatar style={{ width: 56, height: 56 }}>
                {props.chat.title.substring(0, 1)}
            </SigmaAvatar>
            <div style={{ width: '100%', height: '100%', marginLeft: 8, paddingTop: 4 }}>
                <Typography variant='body1' style={{ fontWeight: 'bold', color: themeBasedTextColor.get({ noproxy: true }) }}>
                    {props.chat.title}
                </Typography>
                <Typography variant="body2" style={{ color: themeBasedTextColor.get({ noproxy: true }) }}>
                    {messagesList?.length > 0 ? messagesList[messagesList.length - 1].data.text : `Operator: Welcome to ${props.chat.title} tower !`}
                </Typography>
            </div>
            <Typography variant="caption" style={{ position: 'absolute', top: 4, right: 0, color: themeBasedTextColor.get({ noproxy: true }) }}>
                yesterday 13:05
            </Typography>
            <div style={{ opacity: 0.25, width: 'calc(100% - 56px)', height: 1, backgroundColor: themeBasedTextColor.get({ noproxy: true }), position: 'absolute', left: 56, bottom: 0 }} />
        </div >
    )
}

export default ChatItem
