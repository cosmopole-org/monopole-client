import { useRef } from "react"
import { Avatar, Card, IconButton, Typography } from "@mui/material"
import { blue } from "@mui/material/colors"
import { ArrowBack, ArrowForward, ArrowRight, DarkMode, Edit, SmartToy } from "@mui/icons-material"
import SigmaSwitch from "../custom/elements/SigmaSwitch"
import { api } from "../.."
import { SigmaRouter } from "../../App"

const Settings = (props: { isOnTop: boolean, show: boolean }) => {
    const containerRef = useRef(null)
    let me = api.memory.humans.get({ noproxy: true })[api.memory.myHumanId.get({ noproxy: true })]
    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div style={{ width: '100%', height: 16 + 56 }} />
            <Card elevation={0} style={{
                padding: 16, backgroundColor: blue[100], borderRadius: 24, height: 'auto',
                marginLeft: 16, width: 'calc(100% - 64px)', paddingTop: 32, position: 'relative'
            }}>
                <Avatar style={{ width: 112, height: 112, background: blue[500], margin: '0 auto' }}>
                    {me.firstName.substring(0, 1) + (me.lastName ? me.lastName.substring(0, 1) : '')}
                </Avatar>
                <Typography variant={'h6'} style={{ width: '100%', textAlign: 'center', marginTop: 16 }}>
                    {me.firstName + (me.lastName ? (' ' + me.lastName) : '')}
                </Typography>
                <IconButton style={{ position: 'absolute', right: 16, top: 16 }}
                    onClick={() => {
                        SigmaRouter.navigate('updateProfile')
                    }}
                >
                    <Edit />
                </IconButton>
            </Card>
            <Card elevation={0} style={{
                paddingLeft: 16, paddingRight: 16, backgroundColor: blue[100], borderRadius: 24, height: 'auto', display: 'flex',
                marginLeft: 16, width: 'calc(100% - 64px)', position: 'relative', marginTop: 16, paddingTop: 8, paddingBottom: 8
            }}>
                <IconButton>
                    <DarkMode />
                </IconButton>
                <Typography style={{ flex: 1, marginTop: 8 }}>
                    Dark Theme
                </Typography>
                <SigmaSwitch />
            </Card>
            <Card
                elevation={0}
                style={{
                    paddingLeft: 16, paddingRight: 16, backgroundColor: blue[100], borderRadius: 24, height: 'auto', display: 'flex',
                    marginLeft: 16, width: 'calc(100% - 64px)', position: 'relative', marginTop: 16, paddingTop: 8, paddingBottom: 8
                }}
                onClick={() => {
                    SigmaRouter.navigate('machines')
                }}
            >
                <IconButton>
                    <SmartToy />
                </IconButton>
                <Typography style={{ flex: 1, marginTop: 8 }}>
                    My Machines
                </Typography>
                <IconButton>
                    <ArrowForward />
                </IconButton>
            </Card>
        </div>
    )
}

export default Settings
