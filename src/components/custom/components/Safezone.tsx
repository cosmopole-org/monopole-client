import { useEffect } from "react"
import { api } from "../../.."

const Safezone = (props: { code: string, machineId?: string, workerId?: string, towerId?: string, roomId?: string }) => {
    useEffect(() => {
        let eventController = api.services.worker.onMachinePacketDeliver('response', (data: any) => {
            (document.querySelector("iframe") as any)?.contentWindow.postMessage({ key: 'response', packet: data, myHumanId: api.memory.myHumanId.get({ noproxy: true }) }, 'http://localhost:3001')
        })
        let eventController2 = api.services.worker.onMachinePacketDeliver('push', (data: any) => {
            (document.querySelector("iframe") as any)?.contentWindow.postMessage({ key: 'push', packet: data, myHumanId: api.memory.myHumanId.get({ noproxy: true }) }, 'http://localhost:3001')
        })
        window.onmessage = e => {
            let data = e.data
            if (data.key === 'ask') {
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
        <iframe
            key='globalAppletsheet'
            id='globalAppletsheet'
            frameBorder={0}
            width="100%"
            height="100%"
            src="https://safezone.liara.run/"
        />
    )
}

export default Safezone
