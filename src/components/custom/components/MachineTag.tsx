import { SmartToy } from "@mui/icons-material"
import { Avatar, Card, Rating, Typography } from "@mui/material"
import { blue } from "@mui/material/colors"

const MachineTag = (props: { onClick?: () => void }) => {
    return (
        <div style={{ position: 'relative', width: 112 + 8, height: 144, minWidth: 112 + 8, marginLeft: 8 }}
            onClick={props.onClick}>
            <Card style={{
                marginLeft: 8, marginTop: 28, width: '100%', height: 'calc(100% - 28px)',
                minWidth: '100%', backgroundColor: blue[100], borderRadius: 8
            }}>
                <Typography variant={'body2'} style={{ marginTop: 56, width: 112 + 8, textAlign: 'center' }}>
                    Sample Machine
                </Typography>
                <Rating style={{ marginTop: 8, width: 112, textAlign: 'center', transform: 'scale(0.85, 0.85)' }} value={3} readOnly />
            </Card>
            <Avatar style={{ position: 'absolute', left: 'calc(50% - 28px)', top: 0, width: 72, height: 72, backgroundColor: blue[500] }}>
                <SmartToy />
            </Avatar>
        </div>
    )
}

export default MachineTag
