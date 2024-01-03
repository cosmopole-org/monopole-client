import { Drawer } from "@mui/material";
import { hookstate, useHookstate } from "@hookstate/core";
import IRoom from "../../../api/models/room";
import MetaContent from "./metaContent";

export const metaNonTouchOpen = hookstate(false);

const MetaNonTouch = (props: { room: IRoom, onClose: () => void, container: HTMLElement, needToCloseRecorder?: boolean }) => {
    const open = useHookstate(metaNonTouchOpen);
    return (
        <Drawer
            anchor="bottom"
            open={open.get({ noproxy: true })}
            onClose={() => open.set(false)}
            PaperProps={{
                style: {
                    width: '100%',
                    height: window.innerHeight - 112,
                    borderRadius: '24px 24px 0px 0px'
                }
            }}
        >
            <MetaContent room={props.room} needToCloseRecorder={props.needToCloseRecorder} />
        </Drawer>
    )
}

export default MetaNonTouch
