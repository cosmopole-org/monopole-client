import { CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Desktop from '../custom/components/Desktop';
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
            style={{ width: '100%', height: 'calc(100% - 32px - 16px)', position: 'absolute', left: props.show ? 0 : '-100%', paddingTop: 32 + 16 }}
        >
            <div
                ref={desktopWrapperRef}
                onClick={() => openAppletSheet()}
                style={{ width: '100%', height: '100%', position: 'relative', overflowY: 'auto' }}
            >
                <Desktop.Host showDesktop={loadDesktop} editMode={props.editMode} style={{ width: window.innerWidth }} desktopKey={props.desktopKey} />
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    {
                        loadDesktop ?
                            null : (
                                <CircularProgress style={{
                                    width: 40,
                                    height: 40,
                                    position: 'absolute',
                                    left: 'calc(50% - 16px)',
                                    top: 'calc(50% - 16px)',
                                    transform: 'translate(-50%, -50%)'
                                }} />
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default Desk
