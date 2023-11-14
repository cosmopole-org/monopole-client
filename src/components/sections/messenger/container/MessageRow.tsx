
import {
    Avatar,
} from "@mui/material";
import { themeColor } from "../../../../App";
import SigmaAvatar from "../../../custom/elements/SigmaAvatar";

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
                    <SigmaAvatar style={{ marginRight: -4, marginTop: 'auto', marginBottom: 0, width: 32, height: 32 }}>
                        A
                    </SigmaAvatar>
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
