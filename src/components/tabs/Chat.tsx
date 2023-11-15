import { IconButton, InputBase, Paper } from "@mui/material"
import { InsertEmoticon, Send, Widgets } from "@mui/icons-material"
import Message from "../sections/messenger/embedded/Message"
import { themeColor } from "../../App"

const Chat = (props: { show: boolean }) => {
    return (
        <div
            style={{ width: '100%', height: 'calc(100% - 32px - 16px)', position: 'absolute', left: props.show ? 0 : '-100%', paddingTop: 32 + 16 }}
        >
            <div
                style={{ width: '100%', height: 'calc(100% - 56px)', position: 'relative' }}
            >
                <div
                    style={{ width: '100%', height: '100%', position: 'relative', overflowY: 'auto' }}
                >
                    <div style={{ width: '100%', height: 32 }} />
                    <Message side="right" messageType="text" firstOfSection />
                    <Message side="right" messageType="text" lastOfSection />
                    <Message side={'left'} separate messageType="text" firstOfSection />
                    <Message side={'left'} messageType="text" />
                    <Message side={'left'} messageType="text" lastOfSection />
                    <Message side={'right'} separate messageType="text" firstOfSection />
                    <Message side={'right'} messageType="text" />
                    <Message side={'right'} messageType="text" lastOfSection />
                    <Message side={'left'} separate messageType="text" firstOfSection />
                    <Message side={'left'} messageType="text" />
                    <Message side={'left'} messageType="text" lastOfSection />
                    <Message side={'right'} separate messageType="text" firstOfSection />
                    <Message side={'right'} messageType="text" />
                    <Message side={'right'} messageType="text" lastOfSection />
                    <div style={{ width: '100%', height: 84 }} />
                </div>
                <Paper style={{
                    borderRadius: 0, width: '100%',
                    minHeight: 56, height: 'auto', position: 'absolute', left: 0, bottom: 0, backgroundColor: themeColor.get({ noproxy: true })[100],
                    display: 'flex', paddingTop: 2
                }}>
                    <IconButton><InsertEmoticon /></IconButton>
                    <InputBase multiline placeholder="type your message..." style={{
                        flex: 1, height: '100%', borderRadius: 16, paddingLeft: 8, paddingRight: 8,
                        paddingTop: 8, paddingBottom: 6, marginTop: 8, marginBottom: 8,
                        backgroundColor: themeColor.get({ noproxy: true })[50]
                    }} />
                    <IconButton><Widgets /></IconButton>
                    <IconButton style={{ marginRight: 8 }}><Send /></IconButton>
                </Paper>
            </div>
        </div>
    )
}

export default Chat
