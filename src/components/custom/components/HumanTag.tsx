import { Code, CopyAll, SmartToy } from "@mui/icons-material"
import { Box, Button, Card, Typography } from "@mui/material"
import { SigmaRouter, themeColor, themeColorName } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import SigmaFab from "../elements/SigmaFab"

const HumanTag = (props: { onClick?: () => void, human: any, caption: string, inExplore?: boolean }) => {
    return (
        <div
            style={{
                position: 'relative', width: 'calc(50% - 8px)', height: 180,
            }}>
            <Card elevation={0} style={{
                position: 'absolute', left: 8, top: 40, width: 'calc(100% - 16px)', height: 'calc(100% - 40px)',
                backgroundColor: themeColor.get({ noproxy: true })[props.inExplore ? 50 : 100], borderRadius: 24
            }}>
                <Typography variant={'body1'} style={{ marginTop: 56, width: '100%', textAlign: 'center' }}>
                    {props.human.firstName}
                </Typography>
                <Box style={{ marginTop: 16, width: '100%', textAlign: 'center' }}>
                    <Button style={{ borderRadius: 24, width: 'calc(100% - 16px)' }} variant="contained"
                        onClick={props.onClick}>
                        {props.caption}
                    </Button>
                </Box>
            </Card>
            <SigmaAvatar style={{ backgroundColor: props.human.color[themeColorName.get({noproxy: true}) === "night" ? 500 : 200], position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 16, width: 64, height: 64 }}>
                {props.human.firstName.substring(0, 1) + (props.human.lastName ? props.human.lastName.substring(0, 1) : '')}
            </SigmaAvatar>
        </div>
    )
}

export default HumanTag
