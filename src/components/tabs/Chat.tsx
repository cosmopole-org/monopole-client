
import { api } from "../.."
import IRoom from "../../api/models/room"
import IMessage from "../../api/models/message"
import { useCallback, useEffect, useState } from "react"
import { hookstate, useHookstate } from "@hookstate/core"
import middleUtils from "../../api/utils/middle"
import Messages from "../sections/messenger/Message/Messages"
import utils from "../utils"
import ChatFooter from "../sections/ChatFooter"
import MessageMenu from "../custom/components/MessageMenu"
import { Fab, Paper } from "@mui/material"
import { themeColor } from "../../App"
import Quote from "../sections/messenger/embedded/Quote"
import { chatUtils } from "../sections/messenger/Message/DynamicHeightList"
import { MessageTypes } from "../../api/services/messenger.service"
import SigmaFab from "../custom/elements/SigmaFab"
import { Close } from "@mui/icons-material"

const Chat = (props: { show: boolean, room: IRoom }) => {
    api.services.messenger.check(props.room.id)
    const [pointedPostMessage, setPointedPostMessage] = useState(undefined)
    const [pointedMessage, setPointedMessage]: [any, (message: any) => void] = useState(undefined)
    const [action, setAction] = useState('')
    let msgs = useHookstate(api.memory.messages[props.room.id])
    let messagesList = msgs.get({ noproxy: true })
    useEffect(() => {
        api.services.messenger.onMessageReceived('chat', (data: any) => {
            let { message } = data
            if (props.room.id === message.roomId) {
                msgs.merge([data.message])
                setTimeout(chatUtils.scrollToChatEnd)
            }
        })
        api.services.messenger.onMessageEdited('chat', (data: any) => {
            let { message } = data
            if (props.room.id === message.roomId) {
                if (message.type === MessageTypes.TEXT) {
                    let oldMessage = msgs.get({ noproxy: true }).filter((msg: IMessage) => (msg.id === message.id))[0]
                    if (oldMessage) {
                        oldMessage.data.text = message.data.text
                        utils.sizer.measureTextMessageHeight(oldMessage, messagesList.length, messagesList);
                        chatUtils.clearMessageCache(messagesList.indexOf(oldMessage))
                        msgs.set([...msgs.get({ noproxy: true })])
                    }
                }
            }
        })
        api.services.messenger.read({ towerId: props.room.towerId, roomId: props.room.id })
    }, [])
    const onMessageSubmit = useCallback((text: string) => {
        let message: IMessage;
        if (pointedPostMessage) {
            message = pointedPostMessage
            message.data.text = text
            message.isDummy = true
            utils.sizer.measureTextMessageHeight(message, messagesList.length, messagesList);
            chatUtils.clearMessageCache(messagesList.indexOf(message))
            msgs.set([...msgs.get({ noproxy: true })])
            setPointedPostMessage(undefined)
            setPointedMessage(undefined)
            api.services.messenger.update({
                towerId: props.room.towerId,
                roomId: props.room.id,
                message: { id: (message as IMessage).id, data: { text } }
            }).then((body: any) => {
                let { message: updated } = body
                message.isDummy = false
                msgs.set([...msgs.get({ noproxy: true })])
            })
        } else {
            let draft = middleUtils.dummy.createDummyMessage(props.room.id, 'text', { text })
            utils.sizer.measureTextMessageHeight(draft, messagesList.length, messagesList)
            msgs.merge([draft])
            api.services.messenger.create({
                towerId: props.room.towerId,
                roomId: props.room.id,
                message: { type: 'text', data: { text } }
            }).then((body: any) => {
                let { message } = body
                draft.id = message.id
                draft.time = message.time
                draft.isDummy = false
                msgs.set([...msgs.get({ noproxy: true })])
            })
        }
    }, [setPointedPostMessage, setPointedMessage, pointedPostMessage, msgs, messagesList])
    return (
        <div
            style={{ width: '100%', height: 'calc(100% - 32px - 16px)', position: 'absolute', left: props.show ? 0 : '-100%', paddingTop: 32 + 16 }}
        >
            <div
                style={{ width: '100%', height: 'calc(100% - 56px)', position: 'relative' }}
            >
                <div
                    style={{ width: '100%', height: 'calc(100% - 56px)', position: 'relative', overflowY: 'auto' }}
                >
                    <Messages room={props.room} messages={messagesList} onMessageSelect={(message: any) => {
                        setPointedMessage(message)
                    }} />
                </div>
                <div style={{
                    width: '100%', height: 'auto', position: 'absolute', left: 0, bottom: 0
                }}>
                    {
                        pointedPostMessage !== undefined ? (
                            <Paper style={{
                                width: '100%', height: 56, borderRadius: 0, position: 'relative',
                                backgroundColor: themeColor.get({ noproxy: true })[50]
                            }}>
                                <Quote messageType={(pointedPostMessage as IMessage).type} message={pointedPostMessage} />
                                <SigmaFab variant={'extended'} size={'small'} onClick={() => { setPointedPostMessage(undefined) }} style={{
                                    position: 'absolute', right: 12, top: 12
                                }}>
                                    Cancel
                                    <Close />
                                </SigmaFab>
                            </Paper>
                        ) : null
                    }
                    <ChatFooter
                        style={{
                            borderRadius: 0, width: '100%',
                            minHeight: 56, height: 'auto',
                            backgroundColor: themeColor.get({ noproxy: true })[100],
                            display: 'flex', paddingTop: 2
                        }}
                        pointedMessage={pointedPostMessage} action={action} messages={messagesList} onMessageSubmit={onMessageSubmit} />
                </div>
            </div>
            <MessageMenu onClose={() => setPointedMessage(undefined)} shown={pointedMessage !== undefined}
                onEdit={() => {
                    setPointedPostMessage(pointedMessage)
                    setAction('edit')
                }}
                onDelete={() => {
                    if (pointedMessage) {
                        if (window.confirm('do you want to delete this message ?')) {
                            api.services.messenger.remove({ towerId: props.room.towerId, roomId: props.room.id, messageId: pointedMessage.id })
                        }
                    }
                }}
            />
        </div>
    )
}

export default Chat
