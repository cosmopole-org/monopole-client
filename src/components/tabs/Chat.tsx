
import { api } from "../.."
import IRoom from "../../api/models/room"
import IMessage from "../../api/models/message"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { useHookstate } from "@hookstate/core"
import middleUtils from "../../api/utils/middle"
import Messages from "../sections/messenger/Message/Messages"
import utils from "../utils"
import ChatFooter from "../sections/ChatFooter"
import MessageMenu from "../custom/components/MessageMenu"
import { Paper } from "@mui/material"
import { themeColor, themeColorName } from "../../App"
import Quote from "../sections/messenger/embedded/Quote"
import { chatUtils } from "../sections/messenger/Message/DynamicHeightList"
import { MessageTypes } from "../../api/services/messenger.service"
import SigmaFab from "../custom/elements/SigmaFab"
import { Close } from "@mui/icons-material"
import Uploader from "../custom/components/Uploader"
import { notifyNewFileUploaded } from "./Files"
import formatter from "../utils/formatter"

const uploads: { [id: string]: { fn: (data: { doc: any, towerId: string, roomId: string }) => void, roomId: string } } = {}

const Chat = (props: { show: boolean, room: IRoom }) => {
    const inputFile = useRef(null)
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
                } else if ([MessageTypes.PHOTO, MessageTypes.AUDIO, MessageTypes.VIDEO, MessageTypes.DOCUMENT].includes(message.type)) {
                    let oldMessage = msgs.get({ noproxy: true }).filter((msg: IMessage) => (msg.id === message.id))[0]
                    if (oldMessage) {
                        oldMessage.data.docId = message.data.docId
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
            setTimeout(chatUtils.scrollToChatEnd)
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
            setTimeout(chatUtils.scrollToChatEnd)
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
    const onWidgetsClicked = useCallback(() => {
        inputFile.current && (inputFile.current as HTMLElement).click();
    }, [setPointedPostMessage, setPointedMessage, pointedPostMessage, msgs, messagesList])
    useEffect(() => {
        let { r, g, b } = formatter.hexToRGB(themeColor.get({ noproxy: true })[100]);
        let textColorUnit = themeColorName.get({ noproxy: true }) === 'night' ? 255 : 0;
        (document.getElementById('emojiPickerStyle') as HTMLStyleElement)?.sheet?.insertRule(`
            em-emoji-picker {
                --background-rgb: ${r}, ${g}, ${b};
                --border-radius: 0px;
                --rgb-background: ${r}, ${g}, ${b};
                --rgb-accent: ${textColorUnit}, ${textColorUnit}, ${textColorUnit};
                --rgb-color: ${textColorUnit}, ${textColorUnit}, ${textColorUnit};
                --rgb-input: ${textColorUnit}, ${textColorUnit}, ${textColorUnit};
            }
        `, 0)
        return () => {
            (document.getElementById('emojiPickerStyle') as HTMLStyleElement)?.sheet?.deleteRule(0)
        }
    }, [])
    return (
        <div
            style={{ width: '100%', height: 'calc(100% - 32px - 16px)', position: 'absolute', left: props.show ? 0 : '-100%', paddingTop: 32 + 16 }}
        >
            <Uploader folderId={props.room.id} inputFile={inputFile} room={props.room} onSelect={(file: any) => {
                const key = Math.random().toString().substring(2)
                let mimeType = file.type.split('/')
                let fileType = mimeType[0]
                let messageType = fileType === 'image' ? 'photo' : fileType
                let draft = middleUtils.dummy.createDummyMessage(props.room.id, messageType, { docId: key }, { local: file, tag: key })
                msgs.merge([draft])
                setTimeout(chatUtils.scrollToChatEnd)
                uploads[key] = {
                    fn: (data: { doc: any, towerId: string, roomId: string }) => {
                        api.services.messenger.create({
                            towerId: data.towerId,
                            roomId: data.roomId,
                            message: { type: data.doc.type === 'image' ? 'photo' : data.doc.type, data: { docId: data.doc.id } }
                        }).then((body: any) => {
                            let { message } = body
                            draft.id = message.id
                            draft.time = message.time
                            draft.data.docId = data.doc.id
                            draft.isDummy = false
                            msgs.set([...msgs.get({ noproxy: true })])
                        })
                    },
                    roomId: props.room.id
                }
                api.services.file.upload({ towerId: props.room.towerId, roomId: props.room.id, file, folderId: props.room.id, tag: key }).then((doc: any) => {
                    notifyNewFileUploaded(doc)
                    let itemUpload = uploads[key]
                    if (itemUpload && (itemUpload.roomId === props.room.id)) {
                        itemUpload.fn({ doc, roomId: props.room.id, towerId: props.room.towerId })
                    }
                })
            }} />
            {
                <Messages room={props.room} messages={messagesList} onMessageSelect={(message: any) => {
                    setPointedMessage(message)
                }} />
            }
            <div style={{
                width: '100%', height: 'auto', position: 'absolute', left: 0, bottom: 0
            }}>
                {
                    pointedPostMessage !== undefined ? (
                        <Paper style={{
                            width: '100%', height: 48, borderRadius: 0, position: 'relative',
                            backgroundColor: themeColor.get({ noproxy: true })[50]
                        }}>
                            <Quote messageType={(pointedPostMessage as IMessage).type} message={pointedPostMessage} />
                            <SigmaFab variant={'extended'} size={'small'} onClick={() => { setPointedPostMessage(undefined) }} style={{
                                position: 'absolute', right: 12, bottom: 4
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
                        paddingTop: 2, marginTop: 8
                    }}
                    pointedMessage={pointedPostMessage}
                    action={action}
                    messages={messagesList}
                    onMessageSubmit={onMessageSubmit}
                    onWidgetsClicked={onWidgetsClicked}
                />
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
