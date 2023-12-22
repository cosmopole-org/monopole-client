
import { Badge, Card, Paper, Typography } from "@mui/material"
import { SigmaRouter, themeBasedTextColor, themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import { useHookstate } from "@hookstate/core"
import { api } from "../../.."
import utils from "../../utils"
import { Done, DoneAll } from "@mui/icons-material"

const ChatItem = (props: { chat: any, style?: any, onMoreClicked?: () => void }) => {
    const mainRoom: any = Object.values(props.chat.tower.rooms)[0]
    const messagesList = useHookstate(api.memory.messages[mainRoom.id]).get({ noproxy: true })
    const ids = props.chat.id.split('-')
    const myHumanId = useHookstate(api.memory.myHumanId).get({ noproxy: true })
    const unseenCount = useHookstate(api.services.messenger.unseenMsgCount).get({ noproxy: true })[props.chat.roomId]
    const peerId = ids[0] === myHumanId ? ids[1] : ids[0]
    const humans = useHookstate(api.memory.humans).get({ noproxy: true })
    const isOnline = useHookstate(api.services.home.lastSeensDict).get({ noproxy: true })[peerId]
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
                SigmaRouter.navigate('chat', { initialData: { room: mainRoom, humanId: peerId } })
            }}>
            <Badge color="secondary" overlap="circular" variant="dot" invisible={isOnline !== -1}>
                <SigmaAvatar style={{ width: 56, height: 56 }}>
                    {(peer.firstName + ' ' + peer.lastName).substring(0, 1)}
                </SigmaAvatar>
            </Badge>
            <div style={{ width: '100%', height: '100%', marginLeft: 8, paddingTop: 4 }}>
                <Typography variant='body1' style={{ fontWeight: 'bold', color: themeBasedTextColor.get({ noproxy: true }) }}>
                    {peer.firstName + ' ' + peer.lastName}
                </Typography>
                <Typography variant="body2" style={{
                    maxWidth: 'calc(100% - 112px)',
                    color: themeBasedTextColor.get({ noproxy: true }),
                    wordWrap: 'break-word', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', overflow: 'hidden'
                }}>
                    {lastMessage ? lastMessage.type === 'text' ? lastMessage.data.text : ['photo', 'audio', 'video'].includes(lastMessage.type) ? lastMessage.type : `unsupported message type` : `Empty chat`}
                </Typography>
            </div>
            <Typography variant="caption" style={{ position: 'absolute', top: 16, right: 16, color: themeBasedTextColor.get({ noproxy: true }) }}>
                {lastMessage ? (utils.formatter.default.formatDate(lastMessage.time) + ' ' + utils.formatter.default.formatTime(lastMessage.time)) : '-'}
            </Typography>
            <div style={{
                position: 'absolute',
                right: unseenCount === 0 ? 16 : 12,
                bottom: unseenCount === 0 ? 16 : 12,
                display: 'flex'
            }}>
                {
                    lastMessage ?
                        lastMessage.authorId !== myHumanId ?
                            null :
                            lastMessage.seen ? (
                                <DoneAll
                                    style={{
                                        width: 16,
                                        height: 16,
                                        marginTop: 4,
                                        fill: themeBasedTextColor.get({ noproxy: true })
                                    }}
                                />
                            ) : (
                                <Done
                                    style={{
                                        width: 16,
                                        height: 16,
                                        marginTop: 4,
                                        fill: themeBasedTextColor.get({ noproxy: true })
                                    }}
                                />
                            ) :
                        null
                }
                {
                    lastMessage ?
                        !unseenCount ?
                            null :
                            <Typography
                                variant="caption"
                                style={{
                                    marginLeft: 4,
                                    width: 'auto',
                                    height: 'auto',
                                    minWidth: 20,
                                    minHeight: 20,
                                    padding: 2,
                                    borderRadius: '50%',
                                    color: themeBasedTextColor.get({ noproxy: true }),
                                    backgroundColor: themeColor.get({ noproxy: true })[200],
                                    textAlign: 'center'
                                }}
                            >
                                {unseenCount}
                            </Typography> :
                        null
                }
            </div>
        </div >
    )
}

export default ChatItem
