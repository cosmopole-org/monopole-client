import { api } from "../.."
import IMessage from "../../api/models/message"

const measureTextMessageHeight = (message: IMessage, index: number, messages: Array<IMessage>) => {
    let prevMessage: IMessage = messages[index - 1]
    let isFirstOfSection = (prevMessage && (prevMessage.authorId !== message.authorId)) || !prevMessage
    let nextMessage: IMessage = messages[index + 1]
    let isLastOfSection = (nextMessage && (nextMessage.authorId !== message.authorId)) || !nextMessage
    let messageRow = document.getElementById('lab-message-row')
    let messageFS = document.getElementById('lab-message-free-space')
    let messageData = document.getElementById('lab-message-data')
    let messageCard = document.getElementById('lab-message-card')
    if (messageData && messageRow && messageFS && messageCard) {
        messageRow.style.marginTop = '0px'
        messageFS.style.width = isLastOfSection ? '0px' : '18px'
        messageCard.className = "bubble" + (isLastOfSection ? (" " + "right") : "")
        messageCard.style.width = `${message.authorId === api.memory.myHumanId.get({ noproxy: true }) ? 300 : 250}px`
        messageData.innerHTML = message.data.text as string
        let value1 = messageRow.offsetHeight + Math.floor(messageData.offsetHeight / 24) * 4 + (isFirstOfSection ? 0 : 4)
        message.meta = { value1, value2: 8, measuredHeight: value1}
    }
}

const measurePhotoMessageHeight = (message: IMessage, index: number, messages: Array<IMessage>) => {
    let prevMessage: IMessage = messages[index - 1]
    let isFirstOfSection = (prevMessage && (prevMessage.authorId !== message.authorId)) || !prevMessage
    let nextMessage: IMessage = messages[index + 1]
    let isLastOfSection = (nextMessage && (nextMessage.authorId !== message.authorId)) || !nextMessage
    if (isLastOfSection) return 240
    else return 250
}

export {
    measureTextMessageHeight,
    measurePhotoMessageHeight
}