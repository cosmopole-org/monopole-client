import { useEffect, useRef } from "react"
import { Avatar, Card, Typography } from "@mui/material"
import { blue } from "@mui/material/colors"
import { LeftControlTypes, switchLeftControl } from "../../sections/StatusBar"
import { SigmaRouter } from "../../../App"
import SliderPage from "../../layouts/SliderPage"

const Profile = (props: { id: string, isOnTop: boolean }) => {
    const containerRef = useRef(null)
    useEffect(() => {
        switchLeftControl && switchLeftControl(LeftControlTypes.BACK, () => SigmaRouter.back())
    }, [])
    return (
        <SliderPage id={props.id}>
            <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: blue[50] }}>
                <div style={{ width: '100%', height: 16 + 56 }} />
                <Card elevation={0} style={{
                    padding: 16, backgroundColor: blue[100], borderRadius: 24, height: 'auto',
                    marginLeft: 16, width: 'calc(100% - 64px)', paddingTop: 32, position: 'relative'
                }}>
                    <Avatar style={{ width: 112, height: 112, background: blue[500], margin: '0 auto' }}>
                        SM
                    </Avatar>
                    <Typography variant={'h6'} style={{ width: '100%', textAlign: 'center', marginTop: 16 }}>
                        Sample Machine
                    </Typography>
                </Card>
            </div>
        </SliderPage>
    )
}

export default Profile
