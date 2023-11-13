import { useEffect, useRef } from "react"
import { Avatar, Card, Typography } from "@mui/material"
import { blue } from "@mui/material/colors"
import { LeftControlTypes, RightControlTypes, switchLeftControl, switchRightControl, switchTitle } from "../../sections/StatusBar"
import { SigmaRouter } from "../../../App"
import SliderPage from "../../layouts/SliderPage"
import IHuman from "../../../api/models/human"
import IMachine from "../../../api/models/machine"

const Profile = (props: { id: string, isOnTop: boolean, human?: IHuman, machine?: IMachine }) => {
    const containerRef = useRef(null)
    useEffect(() => {
        switchTitle && switchTitle(props.human ? 'Human Profile' : props.machine ? 'Machine Profile' : '')
        switchLeftControl && switchLeftControl(LeftControlTypes.BACK, () => SigmaRouter.back())
        switchRightControl && switchRightControl(RightControlTypes.NONE)
    }, [])
    let title = props.human ?
        (props.human.firstName + (props.human.lastName ? ` ${props.human.lastName}` : '')) :
        props.machine ?
            props.machine?.name :
            ''
    let titleShort = props.human ?
        (props.human.firstName.substring(0, 1) + (props.human.lastName ? props.human.lastName.substring(0, 1) : '')) :
        props.machine ?
            props.machine?.name.substring(0, 1) :
            ''
    return (
        <SliderPage id={props.id}>
            <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: blue[50] }}>
                <div style={{ width: '100%', height: 16 + 56 }} />
                <Card elevation={0} style={{
                    padding: 16, backgroundColor: blue[100], borderRadius: 24, height: 'auto',
                    marginLeft: 16, width: 'calc(100% - 64px)', paddingTop: 32, position: 'relative'
                }}>
                    <Avatar style={{ width: 112, height: 112, background: blue[500], margin: '0 auto' }}>
                        {titleShort}
                    </Avatar>
                    <Typography variant={'h6'} style={{ width: '100%', textAlign: 'center', marginTop: 16 }}>
                        {title}
                    </Typography>
                </Card>
            </div>
        </SliderPage>
    )
}

export default Profile
