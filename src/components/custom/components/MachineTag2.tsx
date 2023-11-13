import { SmartToy } from "@mui/icons-material"
import { Avatar, Box, Button, Card, IconButton, Rating, Typography } from "@mui/material"
import { blue } from "@mui/material/colors"

const MachineTag2 = (props: { onClick?: () => void, machine: any }) => {
    return (
        <div
            style={{
                position: 'relative', width: 'calc(50% - 8px)', height: 196,
            }}
            onClick={props.onClick}>
            <Card elevation={0} style={{
                position: 'absolute', left: 8, top: 56, width: 'calc(100% - 16px)', height: 'calc(100% - 56px)',
                backgroundColor: blue[50], borderRadius: 24
            }}>
                <Typography variant={'body2'} style={{ marginTop: 56, width: '100%', textAlign: 'center' }}>
                    {props.machine.name}
                </Typography>
                <Box style={{ marginTop: 16, width: '100%', textAlign: 'center' }}>
                    <Button style={{borderRadius: 24, width: 'calc(100% - 16px)'}} variant="contained">
                        View
                    </Button>
                </Box>
            </Card>
            <Avatar style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 16, width: 88, height: 88, backgroundColor: blue[500] }}>
                <SmartToy />
            </Avatar>
        </div>
    )
}

export default MachineTag2
