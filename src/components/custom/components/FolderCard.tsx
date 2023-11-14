import { Avatar, Card, IconButton, Typography } from "@mui/material"
import { Folder, MoreVert } from "@mui/icons-material"
import { themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"

const FolderCard = (props: { style?: any, onMoreClicked?: () => void }) => {
    return (
        <Card elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(50% - 56px)', padding: 16, height: 96, backgroundColor: themeColor.get({noproxy: true})[50], borderRadius: 24 }}>
            <SigmaAvatar style={{ width: 48, height: 48 }}>
                <Folder />                
            </SigmaAvatar>
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
