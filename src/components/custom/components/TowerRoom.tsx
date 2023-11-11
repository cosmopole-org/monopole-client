import { MoreVert, People } from "@mui/icons-material"
import { Avatar, IconButton, Typography } from "@mui/material"
import { blue } from "@mui/material/colors"

const TowerRoom = (props: { onClick: () => void, openMenu?: (roomId: string) => void, room: any }) => {
    return (
        <div
            onClick={props.onClick}
            style={{ textAlign: 'left', width: '100%', borderRadius: 16, marginTop: 8, backgroundColor: blue[50], paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, display: 'flex' }}>
            <Avatar style={{ width: 40, height: 40, backgroundColor: blue[500] }}>
                {props.room.title.substring(0, 1)}
            </Avatar>
            <Typography style={{ marginLeft: 8, marginTop: 8, maxWidth: 200, flex: 1 }}>
                {props.room.title}
            </Typography>
            <People style={{ marginLeft: 32, marginTop: 8 }} />
            <Typography style={{ marginLeft: 8, marginTop: 8, marginRight: 16 }}>
                3
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
