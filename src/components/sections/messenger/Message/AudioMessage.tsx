
import {
    Paper,
    Typography
} from "@mui/material";
import {
    DoneAll, History
} from "@mui/icons-material";
import './bubble.css'
import { themeColor } from "../../../../App";
import IMessage from "../../../../api/models/message";
import Image from "../../../custom/components/Image";
import IRoom from "../../../../api/models/room";
import Waveform from "../../../custom/components/AudioWave/Waveform";

const AudioMessage = (props: { room: IRoom, message: IMessage, side?: string, lastOfSection?: boolean, firstOfSection?: boolean, isQuote?: boolean }) => {
    return (
        <Paper
            style={{
                height: 76,
                width: 200,
                minWidth: 200,
                borderRadius: props.isQuote ? 0 :
                    props.side === 'left' ?
                        `${props.firstOfSection ? 24 : 8}px 24px 24px 8px` :
                        `24px ${props.firstOfSection ? 24 : 8}px 8px 24px`,
                background: (props.side === 'right' || props.isQuote) ?
                    `linear-gradient(135deg, ${themeColor.get({ noproxy: true })[500]}, ${themeColor.get({ noproxy: true })[200]}) border-box` :
                    themeColor.get({ noproxy: true })['plain'],
                marginLeft: props.side === 'left' ? 0 : 'auto',
                marginRight: props.side === 'left' ? 'auto' : 0,
                position: 'relative',
                padding: 4
            }}
            elevation={0}
            className={props.isQuote ? '' : (props.side === 'right' ? "bubble" : "bubble2") + (props.lastOfSection ? (" " + props.side) : "")}
        >
            <div style={{ width: 'auto', height: '100%', position: 'relative' }}>
                {
                    props.message.data.docId ? (
                        <Image
                            local={props.message.isDummy ? props.message.meta.local : undefined}
                            style={{
                                height: 48,
                                width: 48,
                                borderRadius: '24px 8px 8px 8px',
                                position: 'absolute',
                                left: 2,
                                top: 6
                            }}
                            docId={props.message.data.docId}
                            room={props.room}
                            tag={`${props.room.id}-${props.message.id}`}
                            isPreview
                            key={`message-doc-cover-${props.message.id}`}
                        />
                    ) : null
                }
                {
                    (props.message.data.docId && !props.message.isDummy) ? (
                        <Waveform
                            style={{ width: 128, position: 'absolute', left: 60, top: 8 }}
                            docId={props.message.data.docId}
                            tag={`${props.room.id}-${props.message.id}-waveform`}
                            room={props.room}
                            isPreview={true}
                        />
                    ) : null
                }
                <Typography
                    variant={"caption"}
                    style={{
                        borderRadius: props.isQuote ? 0 :
                            props.side === 'left' ?
                                `${props.firstOfSection ? 24 : 8}px 24px 24px 8px` :
                                `8px ${props.firstOfSection ? 24 : 24}px 8px 24px`,
                        paddingLeft: 8, paddingRight: 8, paddingBottom: 2, paddingTop: 4,
                        textAlign: "left", fontWeight: 'bold', marginTop: 0, height: 'auto', position: 'absolute', left: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', color: props.side === 'left' ? themeColor.get({ noproxy: true })['activeText'] : '#fff'
                    }}
                >
                    Keyhan
                </Typography>
                {
                    props.isQuote ?
                        null :
                        (
                            <div style={{
                                width: 'auto', position: 'absolute', bottom: 0, right: 0, display: "flex",
                                paddingLeft: 8, paddingRight: 8, paddingBottom: 2, paddingTop: 4,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                borderRadius: props.isQuote ? 0 :
                                    props.side === 'left' ?
                                        `${props.firstOfSection ? 24 : 8}px 24px 24px 8px` :
                                        `24px 8px 8px 8px`,
                            }}>
                                <Typography
                                    style={{ textAlign: "right", flex: 1, fontSize: 12, color: props.side === 'left' ? themeColor.get({ noproxy: true })['activeText'] : '#fff' }}
                                >
                                    {(new Date(props.message.time)).toTimeString().substring(0, 5)}
                                </Typography>
                                {
                                    (props.message as any).isDummy ? (
                                        <History
                                            style={{
                                                width: 16,
                                                height: 16,
                                                marginLeft: 2,
                                                fill: props.side === 'left' ? themeColor.get({ noproxy: true })['activeText'] : '#fff'
                                            }}
                                        />
                                    ) : (
                                        <DoneAll
                                            style={{
                                                width: 16,
                                                height: 16,
                                                marginLeft: 2,
                                                fill: props.side === 'left' ? themeColor.get({ noproxy: true })['activeText'] : '#fff'
                                            }}
                                        />
                                    )
                                }
                            </div>
                        )
                }
            </div>
        </Paper >
    );
}

export default AudioMessage;
