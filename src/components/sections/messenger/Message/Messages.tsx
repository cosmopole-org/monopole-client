import { useRef } from "react";
import { Paper, Typography } from "@mui/material";
import DynamicHeightList from "./DynamicHeightList";
import IRoom from "../../../../api/models/room";
import IMessage from "../../../../api/models/message";
import { History } from "@mui/icons-material";

export let shouldShowAnim = () => true;

const Messages = (props: { room: IRoom, messages: Array<IMessage>, onMessageSelect: (message: IMessage) => void }) => {

    const holderRef = useRef(null);
    const visibleItems = useRef({});
    const firstVisibleItemIndex = useRef(0);
    const dayViewer = useRef(null);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflowX: 'hidden', overflowY: 'auto' }} ref={holderRef}>
            <DynamicHeightList
                messages={props.messages}
                messageCount={props.messages.length}
                visibleItems={visibleItems}
                firstVisibleItemIndex={firstVisibleItemIndex.current}
                dayViewer={dayViewer}
                room={props.room}
                onMessageSelect={props.onMessageSelect}
            />
            <div style={{ width: '100%', height: 56 }} />
            <Paper
                style={{
                    position: 'absolute',
                    borderRadius: 12,
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8,
                    top: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: firstVisibleItemIndex.current ? 'block' : 'none',
                    zIndex: 3
                }}
            >
                <Typography
                    ref={dayViewer}
                    style={{
                        fontSize: 14,
                        borderRadius: 12
                    }}>

                </Typography>
            </Paper>

            <div
                id={'lab-message-row'}
                style={{
                    top: -10000,
                    height: 'auto',
                    width: 'auto',
                    maxWidth: 250,
                    position: "fixed",
                    marginLeft: 'auto',
                    marginRight: 8,
                    marginTop: 0,
                    display: 'flex'
                }}
            >
                <Paper
                    id={'lab-message-card'}
                    style={{
                        height: '100%',
                        width: 'auto',
                        minWidth: 100,
                        padding: 8,
                        marginLeft: 'auto',
                        marginRight: 0
                    }}
                    elevation={0}
                    className={""}
                >
                    <div style={{ width: 'auto', height: '100%', position: 'relative' }}>
                        <Typography
                            variant={"caption"}
                            style={{
                                textAlign: "left", fontWeight: 'bold', borderRadius: 8, marginTop: 0, height: 'auto'
                            }}
                        >
                            Keyhan
                        </Typography>
                        <Typography
                            id={'lab-message-data'}
                            style={{
                                textAlign: "left", wordWrap: 'break-word',
                                display: 'flex', wordBreak: 'break-word', fontSize: 14, height: 'auto',
                                paddingBottom: 16
                            }}
                        >

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
                            <History
                                style={{
                                    width: 16,
                                    height: 16,
                                    marginLeft: 2,
                                }}
                            />
                        </div>
                    </div>
                </Paper>
                <div id={'lab-message-free-space'} style={{ marginTop: 'auto', marginBottom: 0, width: 0, height: 16 }}>

                </div>
            </div>

        </div>
    );
};

export default Messages;
