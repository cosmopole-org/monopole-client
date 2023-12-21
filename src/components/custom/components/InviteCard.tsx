import { Card, Typography } from "@mui/material"
import SigmaBadgeButton from "../elements/SigmaBadgeButton"
import { themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import { api } from "../../.."

const InviteCard = (props: { invite: any, style?: any, onInviteResolve?: () => void }) => {
    return (
        <Card elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(100% - 32px)', padding: 16, height: 120, backgroundColor: themeColor.get({ noproxy: true })[50], borderRadius: 24 }}>
            <SigmaAvatar style={{ width: 48, height: 48 }}>
                {props.invite.tower.title.substring(0, 1)}
            </SigmaAvatar>
            <Typography variant={'body1'} style={{ marginTop: 8, width: '100%', textAlign: 'left', display: 'flex', height: 20 }}>
                {props.invite.tower.title} invited you to their tower
            </Typography>
            <div style={{ display: 'flex', marginTop: 16 }}>
                <SigmaBadgeButton caption='Accept' onClick={() => {
                    api.services.invite.accept({ towerId: props.invite.towerId, inviteId: props.invite.id }).then((body: any) => {
                        props.onInviteResolve && props.onInviteResolve()
                    })
                }} />
                <SigmaBadgeButton style={{ marginLeft: 8 }} caption='Decline' onClick={() => {
                    api.services.invite.decline({ towerId: props.invite.towerId, inviteId: props.invite.id }).then((body: any) => {
                        props.onInviteResolve && props.onInviteResolve()
                    })
                }} />
            </div>
        </Card>
    )
}

export default InviteCard
