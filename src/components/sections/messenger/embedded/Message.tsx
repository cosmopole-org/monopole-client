import IMessage from "../../../../api/models/message"
import TextMessage from "../Message/TextMessage"
import MessageRow from "../container/MessageRow"

const Message = (props: { message: IMessage, side: string, messageType: string, lastOfSection?: boolean, firstOfSection?: boolean }) => {
    return (
        <MessageRow message={props.message} key={`chat-message-row-${props.message.id}`} side={props.side} lastOfSection={props.lastOfSection} firstOfSection={props.firstOfSection}>
            <TextMessage key={`chat-message-data-${props.message.id}`} message={props.message} side={props.side} lastOfSection={props.lastOfSection} firstOfSection={props.firstOfSection} />
        </MessageRow>
    )
}

export default Message
