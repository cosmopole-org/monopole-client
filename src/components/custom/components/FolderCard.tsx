import { Avatar, Card, IconButton, Typography } from "@mui/material"
import { Folder, MoreVert } from "@mui/icons-material"
import { blue } from "@mui/material/colors"

const FolderCard = (props: { style?: any, onMoreClicked?: () => void }) => {
    return (
        <Card elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(50% - 56px)', padding: 16, height: 96, backgroundColor: blue[50], borderRadius: 24 }}>
            <Avatar style={{ width: 48, height: 48, backgroundColor: blue[500] }}>
                <Folder />                
            </Avatar>
            <Typography style={{ marginTop: 16 }}>
                Sample Folder
            </Typography>
            <IconButton style={{ position: 'absolute', right: 16, top: 24 }} onClick={() => {
                props.onMoreClicked && props.onMoreClicked()
            }}>
                <MoreVert />
            </IconButton>
        </Card>
    )
}

export default FolderCard
