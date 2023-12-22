
import { api } from "../../.."
import IRoom from "../../../api/models/room"
import IMessage from "../../../api/models/message"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { useHookstate } from "@hookstate/core"
import middleUtils from "../../../api/utils/middle"
import Messages from "../../sections/messenger/Message/Messages"
import utils from "../../utils"
import ChatFooter from "../../sections/ChatFooter"
import MessageMenu from "../../custom/components/MessageMenu"
import { AppBar, Paper } from "@mui/material"
import { SigmaRouter, themeColor, themeColorName } from "../../../App"
import Quote from "../../sections/messenger/embedded/Quote"
import { chatUtils } from "../../sections/messenger/Message/DynamicHeightList"
import { MessageTypes } from "../../../api/services/messenger.service"
import SigmaFab from "../../custom/elements/SigmaFab"
import { Close } from "@mui/icons-material"
import Uploader from "../../custom/components/Uploader"
import { notifyNewFileUploaded } from "../../tabs/Files"
import formatter from "../../utils/formatter"
import Chat from "../../tabs/Chat"
import SliderPage from "../../layouts/SliderPage"
import { LeftControlTypes, RightControlTypes, showAvatar, switchLeftControl, switchRightControl, switchTitle } from "../../sections/StatusBar"

const ChatPage = (props: { room: IRoom, humanId: string, id: string, isOnTop: boolean }) => {
    const [needToCloseRecorder, setNeedToCloseRecorder] = useState(false)
    const close = () => {
        setNeedToCloseRecorder(true)
        SigmaRouter.back()
    }
    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
            showAvatar && showAvatar(props.humanId)
            switchTitle && switchTitle('Chat')
        }
    }, [props.isOnTop])
    return (
        <SliderPage id={props.id}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <div key={'room-background'} style={{ background: 'url(https://i.pinimg.com/564x/2a/cd/6e/2acd6e46cc2bdc218a9104a69c36868e.jpg)', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
                <div key={'room-background-overlay'} style={{
                    opacity: themeColorName.get({ noproxy: true }) === 'night' ? 0.85 : 0.65,
                    backgroundColor: themeColorName.get({ noproxy: true }) === 'night' ?
                        themeColor.get({ noproxy: true })[500] :
                        themeColor.get({ noproxy: true })[200],
                    width: '100%', height: '100%', position: 'absolute', left: 0, top: 0
                }} />
                <Chat show={true} room={props.room} needToCloseRecorder={needToCloseRecorder} />
                <AppBar>

                </AppBar>
            </div>
        </SliderPage>
    )
}

export default ChatPage
