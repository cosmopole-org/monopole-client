
import { useEffect } from "react"
import { SigmaRouter, themeColor } from "../../../App"
import SliderPage from "../../layouts/SliderPage"
import Chats from "../../tabs/Chats"
import { LeftControlTypes, RightControlTypes, switchLeftControl, switchRightControl, switchTitle } from "../../sections/StatusBar"
import Settings from "../../tabs/Settings"

const SettingsPage = (props: { id: string, isOnTop: boolean }) => {
    const close = () => {
      SigmaRouter.back()
    }
    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
            switchRightControl && switchRightControl(RightControlTypes.NONE)
            switchTitle && switchTitle('Settings')
        }
    }, [props.isOnTop])
    return (
        <SliderPage id={props.id} style={{ backgroundColor: themeColor.get({ noproxy: true })[50] }}>
            <Settings isOnTop={props.isOnTop} show={true} />
        </SliderPage>
    )
}

export default SettingsPage
