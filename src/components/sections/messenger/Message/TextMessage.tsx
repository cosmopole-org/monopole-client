
import {
    Paper,
    Typography
} from "@mui/material";
import {
    DoneAll
} from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import './bubble.css'

const TextMessage = (props: { side: string, separate?: boolean, lastOfSection?: boolean, firstOfSection?: boolean }) => {
    return (
        <Paper
            style={{
                height: 'auto',
                width: 'auto',
                minWidth: 100,
                borderRadius: props.side === 'left' ?
                    `${props.firstOfSection ? 24 : 8}px 24px 24px 8px` :
                    `24px ${props.firstOfSection ? 24 : 8}px 8px 24px`,
                position: "relative",
                zIndex: 0,
                padding: 8,
                backgroundColor: props.side === 'left' ? '#fff' : blue[200]
            }}
            elevation={0}
            className={(props.side === 'right' ? "bubble" : "bubble2") + (props.lastOfSection ? (" " + props.side) : "")}
        >
            <Typography
                variant={"caption"}
                style={{
                    textAlign: "left", fontWeight: 'bold', borderRadius: 8, marginTop: 0,
                    background: 'transparent', color: props.side === 'left' ? '#666' : '#000'
                }}
            >
                Keyhan
            </Typography>
            <Typography
                style={{
                    textAlign: "left", wordWrap: 'break-word',
                    display: 'flex', wordBreak: 'break-word', fontSize: 14, height: 'auto',
                    paddingBottom: 8, color: props.side === 'left' ? '#666' : '#000'
                }}
            >
                {'This is a test message from Sigma...'}
            </Typography>
            <div style={{
                width: 72, position: 'absolute', bottom: 0, right: 0, display: "flex",
                paddingLeft: 8, paddingRight: 8,
                borderRadius: "16px 16px 0px 16px"
            }}>
                <Typography
                    style={{ textAlign: "right", flex: 1, fontSize: 12 }}
                >
                    {(new Date(Date.now())).toTimeString().substring(0, 5)}
                </Typography>
                <DoneAll
                    style={{
                        width: 16,
                        height: 16,
                        marginLeft: 2
                    }}
                />
            </div>
        </Paper>
    );
}

export default TextMessage;
