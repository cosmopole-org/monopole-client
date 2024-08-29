import { SmartToy } from "@mui/icons-material"
import { Avatar, Box, Button, Card, Rating, Typography } from "@mui/material"
import { SigmaRouter, themeColor, themeColorName } from "../../../App"
import IMachine from "../../../api/models/machine"
import SigmaAvatar from "../elements/SigmaAvatar"

const MachineTag = (props: { machine: IMachine }) => {
    return (
        <div style={{ position: 'relative', width: 112 + 8, height: 160, minWidth: 112 + 8, marginLeft: 8 }}>
            <Card elevation={0} style={{
                marginLeft: 8, marginTop: 28, width: '100%', height: 'calc(100% - 28px)',
                minWidth: '100%', backgroundColor: themeColor.get({noproxy: true})[100], borderRadius: 24
            }}>
                <Typography variant={'body2'} style={{ marginTop: 56, width: 112 + 8, textAlign: 'center' }}>
                    {props.machine.name}
                </Typography>
                <Box style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>
                    <Button style={{ borderRadius: 24, width: 'calc(100% - 16px)' }} variant="contained"
                        onClick={() => {
                            SigmaRouter.navigate('profile', { initialData: { machine: props.machine } })
                        }}>
                        View
                    </Button>
                </Box>
            </Card>
            <SigmaAvatar style={{
                backgroundColor: (props.machine as any).color[themeColorName.get({noproxy: true}) === "night" ? 500 : 200],
                position: 'absolute', left: 'calc(50% - 28px)', top: 0, width: 72, height: 72
            }}>
                <SmartToy />
            </SigmaAvatar>
        </div>
    )
}

export default MachineTag
