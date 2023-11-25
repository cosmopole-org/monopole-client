import IMessage from "../../../../api/models/message"
import TextMessage from "../Message/TextMessage"
import MessageRow from "../container/MessageRow"

const Quote = (props: { message: IMessage, messageType: string }) => {
    return (
        <TextMessage isQuote key={`chat-message-data-${props.message.id}`} message={props.message} />
    )
}

export default Quote
