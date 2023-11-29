import { Avatar, Card, IconButton, Typography } from "@mui/material"
import { Folder, MoreVert } from "@mui/icons-material"
import { themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import IFolder from "../../../api/models/folder"

const FolderCard = (props: { style?: any, onMoreClicked?: () => void, folder: IFolder, onnSelect: () => void }) => {
    return (
        <Card onClick={props.onnSelect} elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(50% - 56px)', padding: 16, height: 96, backgroundColor: themeColor.get({noproxy: true})[50], borderRadius: 24 }}>
            <SigmaAvatar style={{ width: 48, height: 48 }}>
                <Folder />                
            </SigmaAvatar>
            <Typography style={{ maxWidth: 'calc(100% - 16px)', marginTop: 16, wordWrap: 'break-word', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {props.folder.title}
            </Typography>
            <IconButton style={{ position: 'absolute', right: 16, top: 24 }} onClick={e => {
                e.stopPropagation()
                props.onMoreClicked && props.onMoreClicked()
            }}>
                <MoreVert />
            </IconButton>
        </Card>
    )
}

export default FolderCard
