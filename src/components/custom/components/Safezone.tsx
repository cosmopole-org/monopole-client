import { useEffect, useState } from "react"
import { api } from "../../.."
import { themeColorName } from "../../../App"
import { CircularProgress } from "@mui/material"

const Safezone = (props: { code: string, machineId?: string, workerId?: string, towerId?: string, roomId?: string }) => {
    const [show, setShow] = useState(false)
    useEffect(() => {
        let eventController = api.services.worker.onMachinePacketDeliver('response', (data: any) => {
            (document.querySelector("iframe") as any)?.contentWindow.postMessage({ key: 'response', packet: data }, 'https://safezone.liara.run/')
        })
        let eventController2 = api.services.worker.onMachinePacketDeliver('push', (data: any) => {
            (document.querySelector("iframe") as any)?.contentWindow.postMessage({ key: 'push', packet: data }, 'https://safezone.liara.run/')
        })
        window.onmessage = e => {
            let data = e.data
            if (data.key === 'onLoad') {
                (document.querySelector("iframe") as any)?.contentWindow.postMessage({ key: 'setup', myHumanId: api.memory.myHumanId.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }) }, 'https://safezone.liara.run/')
            } else if (data.key === 'ready') {
                setShow(true)
            } else if (data.key === 'ask') {
                let packet = data.packet
                api.services.worker.use({ machineId: props.machineId, packet, towerId: props.towerId, roomId: props.roomId, workerId: props.workerId })
            }
        }
        return () => {
            eventController.unregister()
            eventController2.unregister()
        }
    }, [])
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <iframe
                key='globalAppletsheet'
                id='globalAppletsheet'
                frameBorder={0}
                width="100%"
                height="100%"
                src={`https://safezone.liara.run/${props.code.substring('safezone/'.length)}?random=${Math.random()}`}
                style={{ opacity: show ? 1 : 0, transition: 'opacity 500ms' }}
            />
            {
                !show ? (
                    <CircularProgress style={{ position: 'absolute', left: 'calc(50% - 16px)', top: 'calc(50% - 16px)', transform: 'translate(-50%, -50%)' }} variant="indeterminate" />
                ) : null
            }
        </div>
    )
}

export default Safezone
