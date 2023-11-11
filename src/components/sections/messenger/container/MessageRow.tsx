
import {
    Avatar,
} from "@mui/material";
import { blue } from "@mui/material/colors";

const MessageRow = (props: { side: string, separate?: boolean, children: any, lastOfSection?: boolean }) => {
    return (
        <div
            style={{
                height: 'auto',
                width: 'auto',
                maxWidth: props.side === 'left' ? 300 : 250,
                position: "relative",
                marginLeft: props.side === 'left' ? 8 : 'auto',
                marginRight: props.side === 'left' ? 'auto' : 8,
                marginTop: props.separate ? 16 : 4,
                display: 'flex'
            }}
        >
            {
                (props.side === 'left' && props.lastOfSection) ? (
                    <Avatar style={{ marginRight: -4, backgroundColor: blue[500], marginTop: 'auto', marginBottom: 0, width: 32, height: 32 }}>
                        A
                    </Avatar>
                ) : (
                    <div style={{ marginTop: 'auto', marginBottom: 0, width: 42, height: 42 }}>
                       
                    </div>
                )
            }
            {props.children}
            {
                (props.side === 'right') ? (
                    <div style={{ marginTop: 'auto', marginBottom: 0, width: props.lastOfSection ? 0 : 18, height: 16 }}>
                       
                    </div>
                ) : null
            }
        </div>
    );
}

export default MessageRow;
