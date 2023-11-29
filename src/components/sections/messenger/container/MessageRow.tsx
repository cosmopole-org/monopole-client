
import {
    Fade,
} from "@mui/material";
import SigmaAvatar from "../../../custom/elements/SigmaAvatar";
import IMessage from "../../../../api/models/message";

const MessageRow = (props: { message: IMessage, side: string, children: any, lastOfSection?: boolean, firstOfSection?: boolean }) => {
    return (
        <Fade in={true}>
            <div
                style={{
                    height: `calc(100% - 16px - ${props.message.meta?.value2 ? props.message.meta.value2 : 0}px)`,
                    width: 'auto',
                    maxWidth: props.side === 'left' ? 300 : 250,
                    position: "relative",
                    marginLeft: props.side === 'left' ? 8 : 'auto',
                    marginRight: props.side === 'left' ? 'auto' : 8,
                    marginTop: 12,
                    transform: `translateY(${props.lastOfSection ? 16 : 0}px)`,
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
                        <div style={{ marginTop: 'auto', marginBottom: 0, minWidth: props.lastOfSection ? 0 : 16,
                        width: props.lastOfSection ? 0 : 16, height: 16 }}>

                        </div>
                    ) : null
                }
            </div>
        </Fade>
    );
}

export default MessageRow;
