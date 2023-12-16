
import { Card, Typography } from "@mui/material"
import { SigmaRouter, themeBasedTextColor, themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import { useHookstate } from "@hookstate/core"
import { api } from "../../.."
import utils from "../../utils"

const ChatItem = (props: { chat: any, style?: any, onMoreClicked?: () => void }) => {
    const mainRoom: any = Object.values(props.chat.tower.rooms)[0]
    const messagesList = useHookstate(api.memory.messages[mainRoom.id]).get({ noproxy: true })
    const ids = props.chat.id.split('-')
    const myHumanId = useHookstate(api.memory.myHumanId).get({ noproxy: true })
    const peerId = ids[0] === myHumanId ? ids[1] : ids[0]
    const humans = useHookstate(api.memory.humans).get({ noproxy: true })
    const peer = humans[peerId]
    if (!peer) {
        return null
    }
    const lastMessage = messagesList ? messagesList[messagesList.length - 1] : undefined
    if (!lastMessage) {
        return null
    }
    return (
        <div style={{ ...props.style, borderRadius: 24, paddingTop: 8, paddingLeft: 8, display: 'flex', position: 'relative', width: '100%', height: 64, backgroundColor: themeColor.get({ noproxy: true })[100] }}
            onClick={() => {
                SigmaRouter.navigate('chat', { initialData: { room: mainRoom } })
            }}>
            <SigmaAvatar style={{ width: 56, height: 56 }}>
                {(peer.firstName + ' ' + peer.lastName).substring(0, 1)}
            </SigmaAvatar>
            <div style={{ width: '100%', height: '100%', marginLeft: 8, paddingTop: 4 }}>
                <Typography variant='body1' style={{ fontWeight: 'bold', color: themeBasedTextColor.get({ noproxy: true }) }}>
                    {peer.firstName + ' ' + peer.lastName}
                </Typography>
                <Typography variant="body2" style={{ color: themeBasedTextColor.get({ noproxy: true }) }}>
                    {lastMessage ? lastMessage.type === 'text' ? lastMessage.data.text : ['photo', 'audio', 'video'].includes(lastMessage.type) ? lastMessage.type  : `unsupported message type` : `Empty chat`}
                </Typography>
            </div>
            <Typography variant="caption" style={{ position: 'absolute', top: 16, right: 16, color: themeBasedTextColor.get({ noproxy: true }) }}>
                {lastMessage ? (utils.formatter.default.formatDate(lastMessage.time) + ' ' + utils.formatter.default.formatTime(lastMessage.time)) : '-'}
            </Typography>
        </div >
    )
}

export default ChatItem
