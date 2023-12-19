import { Description, InsertEmoticon, Mic, Send, Widgets } from "@mui/icons-material";
import { IconButton, InputBase, Paper, TextField, selectClasses } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import IMessage from "../../api/models/message";
import { themeColor, themeColorName } from "../../App";
import Picker from "@emoji-mart/react"
import pickerData from "@emoji-mart/data"
import { setChatKeyboardOpen } from "../pages/room/metaTouch";
import VoiceRecorder from "../custom/components/VoiceRecorder";

const ChatFooter = (props: { style?: any, messages: Array<IMessage>, onVoiceRecorded: (blob: any) => void, onWidgetsClicked: () => void, onMessageSubmit: (text: string) => void, pointedMessage: any, action: any }) => {
    const [value, setValue] = useState(props.pointedMessage?.type === 'text' ? props.pointedMessage.data.text : '')
    const inputbaseRef = useRef(null)
    const [showEmoji, setShowEmoji] = useState(false)
    const valueBackup = useRef(value)
    const [selectionStart, setSelectionStart] = useState()
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
    const updateSelectionStart = (e: any) => setSelectionStart(e.target.selectionStart);
    useEffect(() => {
        if (props.pointedMessage) {
            setValue(props.pointedMessage?.type === 'text' ? props.pointedMessage.data.text : '')
        } else {
            setValue(valueBackup.current)
        }
    }, [props.pointedMessage])
    useEffect(() => setChatKeyboardOpen(showEmoji), [showEmoji])
    return (
        <Paper style={props.style}>
            {
                showVoiceRecorder ? (
                    <VoiceRecorder
                        onCancel={() => setShowVoiceRecorder(false)}
                        onVoiceRecorded={(blob: any) => {
                            setShowVoiceRecorder(false)
                            props.onVoiceRecorded(blob)
                        }} />
                ) : null
            }
            <div style={{ width: '100%', height: 'auto', display: 'flex' }}>
                <IconButton onClick={() => setShowEmoji(!showEmoji)}><InsertEmoticon /></IconButton>
                <InputBase
                    onMouseUp={updateSelectionStart}
                    ref={inputbaseRef}
                    multiline
                    placeholder="type your message..."
                    style={{
                        flex: 1, height: 'auto', borderRadius: 16, paddingLeft: 8, paddingRight: 8,
                        border: 'none', minHeight: 32,
                        paddingTop: 8, marginTop: 8, marginBottom: 8,
                        backgroundColor: themeColorName.get({ noproxy: true }) === 'night' ?
                            themeColor.get({ noproxy: true })['plain'] :
                            themeColor.get({ noproxy: true })[50],
                        color: themeColorName.get({ noproxy: true }) === 'night' ? '#fff' : '#000'
                    }} value={value} onChange={e => {
                        if (!props.pointedMessage) {
                            valueBackup.current = e.target.value
                        }
                        setValue(e.target.value)
                    }} />
                <IconButton onClick={() => setShowVoiceRecorder(true)}><Mic /></IconButton>
                <IconButton onClick={() => props.onWidgetsClicked()}><Description /></IconButton>
                <IconButton disabled={(value.length === 0) || (value === props.pointedMessage?.data?.text)} style={{ marginRight: 8 }}
                    onClick={() => {
                        let text = value
                        if (text.length === 0) return;
                        if (props.pointedMessage && (props.pointedMessage.data.text === text)) return;
                        setValue('')
                        if (!props.pointedMessage) valueBackup.current = ''
                        setShowEmoji(false)
                        props.onMessageSubmit(text)
                    }}>
                    <Send />
                </IconButton>
            </div>
            {
                showEmoji ? (
                    <Picker data={pickerData} onEmojiSelect={(e: any) => {
                        let newText = value
                        if (selectionStart !== undefined) {
                            newText = newText.slice(0, selectionStart) + e.native + newText.slice(selectionStart)
                        } else {
                            newText = newText + e.native
                        }
                        if (!props.pointedMessage) {
                            valueBackup.current = newText
                        }
                        setValue(newText)
                    }} perLine={Math.floor(window.innerWidth / 36)} />
                ) : null
            }
        </Paper>
    )
}

export default ChatFooter
