import TextMessage from "../Message/TextMessage"
import MessageRow from "../container/MessageRow"

const Message = (props: { side: string, separate?: boolean, messageType: string, lastOfSection?: boolean, firstOfSection?: boolean }) => {
    return (
        <MessageRow side={props.side} separate={props.separate} lastOfSection={props.lastOfSection}>
            <TextMessage side={props.side} separate={props.separate} lastOfSection={props.lastOfSection} firstOfSection={props.firstOfSection} />
        </MessageRow>
    )
}

export default Message
