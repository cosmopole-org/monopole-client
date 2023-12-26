import { useRef } from "react";
import DynamicHeightList from "./DynamicHeightList";
import IRoom from "../../../../api/models/room";
import IMessage from "../../../../api/models/message";

export let shouldShowAnim = () => true;

const Messages = (props: { room: IRoom, messages: Array<IMessage>, onMessageSelect: (message: IMessage) => void }) => {

    const visibleItems = useRef({});
    const firstVisibleItemIndex = useRef(0);
    const dayViewer = useRef(null);

    return (
        <DynamicHeightList
            messages={props.messages}
            messageCount={props.messages.length}
            visibleItems={visibleItems}
            firstVisibleItemIndex={firstVisibleItemIndex.current}
            dayViewer={dayViewer}
            room={props.room}
            onMessageSelect={props.onMessageSelect}
        />
    );
};

export default Messages;
