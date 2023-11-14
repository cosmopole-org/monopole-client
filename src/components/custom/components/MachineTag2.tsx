import { Code, CopyAll, SmartToy } from "@mui/icons-material"
import { Box, Button, Card, Typography } from "@mui/material"
import { SigmaRouter, themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import SigmaFab from "../elements/SigmaFab"

const MachineTag2 = (props: { onClick?: () => void, machine: any }) => {
    return (
        <div
            style={{
                position: 'relative', width: 'calc(50% - 8px)', height: 180,
            }}
            onClick={props.onClick}>
            <Card elevation={0} style={{
                position: 'absolute', left: 8, top: 40, width: 'calc(100% - 16px)', height: 'calc(100% - 40px)',
                backgroundColor: themeColor.get({ noproxy: true })[50], borderRadius: 24
            }}>
                <Typography variant={'body1'} style={{ marginTop: 56, width: '100%', textAlign: 'center' }}>
                    {props.machine.name}
                </Typography>
                <Box style={{ marginTop: 16, width: '100%', textAlign: 'center' }}>
                    <Button style={{ borderRadius: 24, width: 'calc(100% - 16px)' }} variant="contained"
                        onClick={() => {
                            SigmaRouter.navigate('profile', { initialData: { machine: props.machine } })
                        }}>
                        View
                    </Button>
                </Box>
            </Card>
            <SigmaAvatar style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 16, width: 64, height: 64 }}>
                <SmartToy />
            </SigmaAvatar>
            {
                props.machine.secret ?
                    (
                        <SigmaFab
                            size={'small'}
                            style={{ position: 'absolute', left: '50%', transform: 'translateX(+40px)', top: 28 }}
                            onClick={() => {
                                navigator.clipboard.writeText(props.machine.secret.token);
                                alert('machine token copied to clipboard.')
                            }}
                        >
                            <Code />
                        </SigmaFab>
                    ) :
                    null
            }
        </div>
    )
}

export default MachineTag2
