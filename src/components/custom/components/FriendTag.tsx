import { SmartToy } from "@mui/icons-material"
import { Card, Typography } from "@mui/material"
import { SigmaRouter, themeColor, themeColorName } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import IHuman from "../../../api/models/human"

const FriendTag = (props: { human: IHuman }) => {
    return (
        <div style={{ position: 'relative', width: 120, height: 168, minWidth: 120, marginLeft: 8 }}>
            <Card elevation={0} onClick={() => SigmaRouter.navigate('profile', { initialData: { human: props.human } })} style={{
                marginLeft: 8, marginTop: 8, width: '100%', height: 'calc(100% - 28px)', position: 'relative',
                minWidth: '100%', backgroundColor: themeColor.get({ noproxy: true })[100], borderRadius: 24
            }}>
                <SigmaAvatar style={{ backgroundColor: (props.human as any).color[themeColorName.get({noproxy: true}) === "night" ? 500 : 200], position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 16, width: 72, height: 72 }}>
                    {props.human.firstName.substring(0, 1)}
                </SigmaAvatar>
                <Typography variant={'body2'} style={{ marginTop: 100, width: '100%', textAlign: 'center' }}>
                    {props.human.firstName}
                </Typography>
            </Card>
        </div>
    )
}

export default FriendTag
