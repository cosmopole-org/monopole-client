import { IconButton, Paper } from "@mui/material"
import { InsertEmoticon, Send, Widgets } from "@mui/icons-material"
import Message from "../sections/messenger/embedded/Message"
import { themeColor } from "../../App"
import { api } from "../.."
import IRoom from "../../api/models/room"
import IMessage from "../../api/models/message"
import { useEffect, useRef } from "react"
import { hookstate, useHookstate } from "@hookstate/core"
import middleUtils from "../../api/utils/middle"
import ChatInput from "../sections/ChatInput"
import Messages from "../sections/messenger/Message/Messages"
import utils from "../utils"

let messages: { [id: string]: any } = {}

const Chat = (props: { show: boolean, room: IRoom }) => {
    if (!messages[props.room.id]) messages[props.room.id] = hookstate([])
    let msgs = useHookstate(messages[props.room.id])
    let myHumanId = useHookstate(api.memory.myHumanId).get({ noproxy: true })
    let messagesList = msgs.get({ noproxy: true })
    const chatInputControl = useRef({
        clear: () => { },
        getValue: () => ('')
    })
    useEffect(() => {
        api.services.messenger.onMessageReceived('chat', (data: any) => {
            msgs.merge([data.message])
        })
        api.services.messenger.read({ towerId: props.room.towerId, roomId: props.room.id }).then((body: any) => {
            messages[props.room.id].set(body.messages)
        })
    }, [])
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
                    <Messages room={props.room} messages={messagesList} />
                </div>
                <Paper style={{
                    borderRadius: 0, width: '100%',
                    minHeight: 56, height: 'auto', position: 'absolute', left: 0, bottom: 0, backgroundColor: themeColor.get({ noproxy: true })[100],
                    display: 'flex', paddingTop: 2
                }}>
                    <IconButton><InsertEmoticon /></IconButton>
                    <ChatInput control={chatInputControl.current} />
                    <IconButton><Widgets /></IconButton>
                    <IconButton style={{ marginRight: 8 }}
                        onClick={() => {
                            const text = chatInputControl.current.getValue();
                            if (text.length == 0) return;
                            chatInputControl.current.clear();
                            let draft = middleUtils.dummy.createDummyMessage(props.room.id, 'text', { text })
                            utils.sizer.measureTextMessageHeight(draft, messagesList.length, messagesList)
                            msgs.merge([draft])
                            api.services.messenger.create({
                                towerId: props.room.towerId,
                                roomId: props.room.id,
                                message: { type: 'text', data: { text } }
                            }).then((body: any) => {
                                let { message } = body
                                draft.isDummy = false
                                draft.time = message.time
                                msgs.set([...msgs.get({ noproxy: true })])
                            })
                        }}>
                        <Send />
                    </IconButton>
                </Paper>
            </div>
        </div>
    )
}

export default Chat
