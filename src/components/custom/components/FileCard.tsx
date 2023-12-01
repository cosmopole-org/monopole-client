import { Card, IconButton, Typography } from "@mui/material"
import { Description, MoreVert, Photo, Straighten } from "@mui/icons-material"
import SigmaChip from "../elements/SigmaChip"
import { themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import Image from "./Image"
import { useRef } from "react"
import IRoom from "../../../api/models/room"
import formatter from "../../utils/formatter"

const FileCard = (props: { style?: any, onSelect: () => void, onMoreClicked?: () => void, doc: any, room: IRoom }) => {
    const imageKey = useRef(props.doc.id + '-' + Math.random())
    return (
        <Card elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(100% - 64px)', padding: 16, height: 96, backgroundColor: themeColor.get({ noproxy: true })[50], borderRadius: 24 }}
            onClick={() => {
                props.onSelect()
            }}>
            <div style={{ width: '100%', height: 'auto', display: 'flex' }}>
                <SigmaAvatar style={{ width: 48, height: 48 }}>
                    <Image
                        key={imageKey.current}
                        tag={imageKey.current}
                        docId={props.doc.id}
                        room={props.room} isPreview
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                    />
                </SigmaAvatar>
                <Typography style={{
                    maxWidth: 'calc(100% - 100px)', marginTop: 12, marginLeft: 8, wordWrap: 'break-word', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', overflow: 'hidden'
                }}>
                    {props.doc.metadata.title}
                </Typography>
                <IconButton style={{ position: 'absolute', right: 16, top: 24 }} onClick={e => {
                    e.stopPropagation();
                    props.onMoreClicked && props.onMoreClicked()
                }}>
                    <MoreVert />
                </IconButton>
            </div>
            <div style={{ display: 'flex', marginTop: 16 }}>
                <SigmaChip caption={`${props.doc.type} / ${props.doc.metadata.extension}`} icon={<Description />} />
                <SigmaChip style={{ marginLeft: 8 }} caption={formatter.formatBytes(props.doc.metadata.size)} icon={<Straighten />} />
            </div>
        </Card>
    )
}

export default FileCard
