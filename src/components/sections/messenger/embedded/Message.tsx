import IMessage from "../../../../api/models/message"
import IRoom from "../../../../api/models/room"
import AudioMessage from "../Message/AudioMessage"
import PhotoMessage from "../Message/PhotoMessage"
import TextMessage from "../Message/TextMessage"
import VideoMessage from "../Message/VideoMessage"
import MessageRow from "../container/MessageRow"

const Message = (props: { room: IRoom, message: IMessage, side: string, messageType: string, lastOfSection?: boolean, firstOfSection?: boolean, onMessageSelect: (message: IMessage) => void }) => {
    return (
        <MessageRow onMessageSelect={props.onMessageSelect} message={props.message} key={`chat-message-row-${props.message.id}`} side={props.side} lastOfSection={props.lastOfSection} firstOfSection={props.firstOfSection}>
            {
                props.messageType === 'text' ? (
                    <TextMessage key={`chat-message-data-${props.message.id}`} message={props.message} side={props.side} lastOfSection={props.lastOfSection} firstOfSection={props.firstOfSection} />
                ) : props.messageType === 'photo' ? (
                    <PhotoMessage room={props.room} key={`chat-message-data-${props.message.id}`} message={props.message} side={props.side} lastOfSection={props.lastOfSection} firstOfSection={props.firstOfSection} />
                ) : props.messageType === 'video' ? (
                    <VideoMessage room={props.room} key={`chat-message-data-${props.message.id}`} message={props.message} side={props.side} lastOfSection={props.lastOfSection} firstOfSection={props.firstOfSection} />
                ) : props.messageType === 'audio' ? (
                    <AudioMessage room={props.room} key={`chat-message-data-${props.message.id}`} message={props.message} side={props.side} lastOfSection={props.lastOfSection} firstOfSection={props.firstOfSection} />
                ) : null
            }
        </MessageRow>
    )
}

export default Message
