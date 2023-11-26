import { InsertEmoticon, Send, Widgets } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import IMessage from "../../api/models/message";
import { themeColor, themeColorName } from "../../App";

const ChatFooter = (props: { style?: any, messages: Array<IMessage>, onWidgetsClicked: () => void, onMessageSubmit: (text: string) => void, pointedMessage: any, action: any }) => {
    const [value, setValue] = useState(props.pointedMessage?.type === 'text' ? props.pointedMessage.data.text : '')
    const inputbaseRef = useRef(null)
    useEffect(() => {
        if (props.pointedMessage) {
            setValue(props.pointedMessage?.type === 'text' ? props.pointedMessage.data.text : '')
        }
    }, [props.pointedMessage])
    return (
        <Paper style={props.style}>
            <IconButton><InsertEmoticon /></IconButton>
            <InputBase ref={inputbaseRef} multiline placeholder="type your message..." style={{
                flex: 1, height: '100%', borderRadius: 16, paddingLeft: 8, paddingRight: 8,
                paddingTop: 8, paddingBottom: 6, marginTop: 8, marginBottom: 8,
                backgroundColor: themeColorName.get({ noproxy: true }) === 'night' ?
                    themeColor.get({ noproxy: true })['plain'] :
                    themeColor.get({ noproxy: true })[50]
            }} value={value} onChange={e => {
                setValue(e.target.value)
            }} />
            <IconButton onClick={() => props.onWidgetsClicked()}><Widgets /></IconButton>
            <IconButton disabled={(value.length === 0) || (value === props.pointedMessage?.data?.text)} style={{ marginRight: 8 }}
                onClick={() => {
                    let text = value
                    if (text.length === 0) return;
                    if (props.pointedMessage && (props.pointedMessage.data.text === text)) return;
                    setValue('')
                    props.onMessageSubmit(text)
                }}>
                <Send />
            </IconButton>
        </Paper>
    )
}

export default ChatFooter
