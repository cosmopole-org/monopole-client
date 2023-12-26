
import { useEffect } from "react"
import { SigmaRouter, themeColor } from "../../../App"
import SliderPage from "../../layouts/SliderPage"
import Chats from "../../tabs/Chats"
import { LeftControlTypes, RightControlTypes, switchLeftControl, switchRightControl, switchTitle } from "../../sections/StatusBar"
import Home from "../../tabs/Home"

const HomePage = (props: { id: string, isOnTop: boolean }) => {
    const close = () => {
      SigmaRouter.back()
    }
    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
            switchRightControl && switchRightControl(RightControlTypes.NONE)
            switchTitle && switchTitle('Towers')
        }
    }, [props.isOnTop])
    return (
        <SliderPage id={props.id} style={{ backgroundColor: themeColor.get({ noproxy: true })[50] }}>
            <Home isOnTop={props.isOnTop} show={true} isPage />
        </SliderPage>
    )
}

export default HomePage
