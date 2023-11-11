import { Avatar, Card, IconButton, Typography } from "@mui/material"
import { Description, MoreVert, Photo, Straighten } from "@mui/icons-material"
import { blue } from "@mui/material/colors"
import SigmaChip from "../elements/SigmaChip"

const FileCard = (props: { style?: any, onMoreClicked?: () => void }) => {
    return (
        <Card elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(100% - 64px)', padding: 16, height: 96, backgroundColor: blue[50], borderRadius: 24 }}>
            <div style={{width: '100%', height: 'auto', display: 'flex'}}>
            <Avatar style={{ width: 48, height: 48, backgroundColor: blue[500] }}>
                <Photo />
            </Avatar>
            <Typography style={{ marginTop: 12, marginLeft: 8 }}>
                Sample File
            </Typography>
            <IconButton style={{ position: 'absolute', right: 16, top: 24 }} onClick={() => {
                props.onMoreClicked && props.onMoreClicked()
            }}>
                <MoreVert />
            </IconButton>
            </div>
            <div style={{ display: 'flex', marginTop: 16 }}>
                <SigmaChip caption='Image / PNG' icon={<Description />}  />
                <SigmaChip style={{ marginLeft: 8 }} caption='1 MB' icon={<Straighten />} />
            </div>
        </Card>
    )
}

export default FileCard