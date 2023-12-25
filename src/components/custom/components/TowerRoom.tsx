import { Call, MoreVert, People } from "@mui/icons-material"
import { Avatar, Badge, IconButton, Typography } from "@mui/material"
import { themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import { useHookstate } from "@hookstate/core"
import { api } from "../../.."

const TowerRoom = (props: { onClick: () => void, openMenu?: (roomId: string) => void, room: any }) => {
    const calls = useHookstate(api.services.call.calls).get({ noproxy: true })
    return (
        <div
            onClick={props.onClick}
            style={{ textAlign: 'left', width: 'calc(100% - 32px)', borderRadius: 16, marginTop: 8, backgroundColor: themeColor.get({ noproxy: true })[50], paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, display: 'flex' }}>
            <Badge invisible={!calls[props.room.id]} color="secondary" overlap="circular" variant="standard" badgeContent={<Call style={{ width: 12, height: 12 }} />}>
                <SigmaAvatar style={{ width: 40, height: 40 }}>
                    {props.room.title.substring(0, 1)}
                </SigmaAvatar>
            </Badge>
            <Typography style={{ marginLeft: 8, marginTop: 8, maxWidth: 200, flex: 1 }}>
                {props.room.title}
            </Typography>
            <IconButton onClick={e => {
                e.stopPropagation()
                props.openMenu && props.openMenu(props.room.id)
            }}>
                <MoreVert />
            </IconButton>
        </div>
    )
}

export default TowerRoom
