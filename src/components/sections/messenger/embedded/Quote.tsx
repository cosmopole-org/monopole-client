import { Typography } from "@mui/material"
import IMessage from "../../../../api/models/message"
import IRoom from "../../../../api/models/room"
import AudioMessage from "../Message/AudioMessage"
import PhotoMessage from "../Message/PhotoMessage"
import TextMessage from "../Message/TextMessage"
import VideoMessage from "../Message/VideoMessage"
import MessageRow from "../container/MessageRow"
import { themeBasedTextColor, themeColor } from "../../../../App"

const Quote = (props: { message: IMessage, messageType: string, room: IRoom }) => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: themeColor.get({ noproxy: true })[100], paddingLeft: 16, marginBottom: 0, marginTop: 'auto' }}>
            <Typography
                variant={"caption"}
                style={{
                    textAlign: "left", fontWeight: 'bold', borderRadius: 8, marginTop: 0, height: 'auto',
                    background: 'transparent', color: themeBasedTextColor.get({ noproxy: true })
                }}
            >
                {(props.message as any).author.firstName}
            </Typography>
            <Typography
                style={{
                    textAlign: "left", wordWrap: 'break-word', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', overflow: 'hidden',
                    display: 'flex', wordBreak: 'break-word', fontSize: 14, height: 'auto', paddingBottom: 16,
                    color: themeBasedTextColor.get({ noproxy: true })
                }}
            >
                {props.messageType === 'text' ? props.message.data.text : props.messageType}
            </Typography>
        </div>
    )
}

export default Quote
