import { State, hookstate, useHookstate } from "@hookstate/core"
import { themeBasedTextColor, themeColor, themeColorName, themeColorSecondary } from "../../../App"
import Safezone, { shownFlags } from "./Safezone"
import { CircularProgress, Paper } from "@mui/material"
import SigmaFab from "../elements/SigmaFab"
import { Close } from "@mui/icons-material"
import { readyState } from "./Desktop"
import { useEffect, useRef, useState } from "react"
import Loading from "./Loading"
import { appletsheetOpen } from "./AppletSheet"
import { api } from "../../.."
import IRoom from "../../../api/models/room"

export const overlaySafezoneData: State<any> = hookstate(undefined)

const Overlay = () => {
    const overlaySafezone = useHookstate(overlaySafezoneData).get({ noproxy: true })
    const [shown, setShown]: [boolean, any] = useState(false)
    const workerIdRef: any = useRef(undefined)
    const ready = useHookstate(readyState).get({ noproxy: true })
    const roomRef: any = useRef(undefined)
    useEffect(() => {
        window.onfocus = () => {
            overlaySafezoneData.set(undefined)
        }
        const messageCallback = (e: any) => {
            let workerId = undefined
            let iframes = document.getElementsByTagName('iframe');
            for (let i = 0, iframe, win; i < iframes.length; i++) {
                iframe = iframes[i];
                win = iframe.contentWindow
                if (win === e.source) {
                    workerId = iframe.id.substring('safezone-'.length)
                    break
                }
            }
            let data = e.data
            if (workerId) {
                if (data.key === 'onLoad') {
                    (document.getElementById(`safezone-${workerId}`) as any)?.contentWindow.postMessage({ key: 'setup', myHumanId: api.memory.myHumanId.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }) }, 'https://safezone.liara.run/')
                } else if (data.key === 'ready') {
                    if (!shownFlags[workerId].get({ noproxy: true })) {
                        (document.getElementById(`safezone-${workerId}`) as any)?.contentWindow.postMessage({ key: 'start' }, 'https://safezone.liara.run/')
                        shownFlags[workerId].set(true)
                    }
                    readyState.set(true)
                } else if (data.key === 'ask') {
                    let packet = data.packet
                    if (roomRef.current) {
                        api.services.worker.use({ packet, towerId: roomRef.current.towerId, roomId: roomRef.current.id, workerId: workerId })
                    }
                } else if (data.key === 'done') {
                    overlaySafezoneData.set(undefined)
                }
            }
        }
        window.addEventListener('message', messageCallback)
        return () => {
            window.removeEventListener('message', messageCallback)
        }
    }, [])
    return overlaySafezone ? (
        <div style={{ width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: 99999 }}>
            <Safezone code={overlaySafezone.code} workerId={overlaySafezone.workerId} roomId={overlaySafezone.room.id} towerId={overlaySafezone.room.towerId} />
            {
                (!overlaySafezone.code || (overlaySafezone.code && overlaySafezone.code?.startsWith('safezone/') && !ready)) ? (
                    <Loading
                        onCancel={() => {
                            overlaySafezoneData.set(undefined)
                        }}
                    />
                ) : null
            }
        </div>
    ) : null
}

export default Overlay
