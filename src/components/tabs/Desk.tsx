import { CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Desktop from 'sigma-desktop/dist/Desktop';
import { openAppletSheet } from "../custom/components/AppletSheet";

const Desk = (props: { editMode: boolean, show: boolean, desktopKey: string, workers: Array<any> }) => {
    const desktopWrapperRef = useRef(null)
    const [loadDesktop, setLoadDesktop] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setLoadDesktop(true)
        }, 750);
    }, [])
    return (
        <div
            ref={desktopWrapperRef}
            onClick={() => openAppletSheet()}
            style={{ display: props.show ? 'block' : 'none', width: '100%', height: 'calc(100% - 32px - 16px)', position: 'relative', paddingTop: 32 + 16, overflowY: 'auto' }}
        >
            {
                loadDesktop ? (
                    <Desktop.Host editMode={props.editMode} style={{ width: window.innerWidth }} desktopKey={props.desktopKey} />
                ) : (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <CircularProgress style={{
                            width: 40,
                            height: 40,
                            position: 'absolute',
                            left: 'calc(50% - 16px)',
                            top: 'calc(50% - 16px)',
                            transform: 'translate(-50%, -50%)'
                        }} />
                    </div>
                )
            }
        </div>
    )
}

export default Desk
