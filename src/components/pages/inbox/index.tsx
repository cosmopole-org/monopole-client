
import { useEffect } from "react"
import { SigmaRouter, themeColor } from "../../../App"
import SliderPage from "../../layouts/SliderPage"
import { LeftControlTypes, RightControlTypes, switchLeftControl, switchRightControl, switchTitle } from "../../sections/StatusBar"
import Inbox from "../../tabs/Inbox"

const InboxPage = (props: { id: string, isOnTop: boolean }) => {
    const close = () => {
      SigmaRouter.back()
    }
    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
            switchRightControl && switchRightControl(RightControlTypes.NONE)
            switchTitle && switchTitle('Inbox')
        }
    }, [props.isOnTop])
    return (
        <SliderPage id={props.id} style={{ backgroundColor: themeColor.get({ noproxy: true })[50] }}>
            <Inbox isOnTop={props.isOnTop} show={true} />
        </SliderPage>
    )
}

export default InboxPage
