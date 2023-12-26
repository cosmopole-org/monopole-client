
import IRoom from "../../../api/models/room"
import { useEffect, useState } from "react"
import { AppBar } from "@mui/material"
import { SigmaRouter, themeColor, themeColorName } from "../../../App"
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
            showAvatar && showAvatar(props.humanId)
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
            switchRightControl && switchRightControl(RightControlTypes.CALL, () => SigmaRouter.navigate('call', { initialData: { room: props.room } }))
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
