import { memo, useEffect, useState } from "react"
import { api } from "../../.."
import { themeColorName } from "../../../App"
import { CircularProgress } from "@mui/material"
import { State, hookstate, useHookstate } from "@hookstate/core"

export const shownFlags: { [id: string]: State<boolean> } = {}

const Safezone = (props: { code: string, machineId?: string, workerId?: string, towerId?: string, roomId?: string }) => {
    if (!shownFlags[props.workerId ? props.workerId : props.machineId ? props.machineId : '']) {
        shownFlags[props.workerId ? props.workerId : props.machineId ? props.machineId : ''] = hookstate(false)
    }
    const show = useHookstate(shownFlags[props.workerId ? props.workerId : props.machineId ? props.machineId : '']).get({ noproxy: true })
    const identifier = `safezone-${props.workerId ? props.workerId : props.machineId}`
    useEffect(() => {
        let eventController = api.services.worker.onMachinePacketDeliver(`response-${identifier}`, 'response', (data: any) => {
            if (props.workerId) {
                if (data.workerId === props.workerId) {
                    (document.getElementById(identifier) as any)?.contentWindow.postMessage({ key: 'response', packet: data }, 'https://safezone.liara.run/')
                }
            } else {
                (document.getElementById(identifier) as any)?.contentWindow.postMessage({ key: 'response', packet: data }, 'https://safezone.liara.run/')
            }
        })
        let eventController2 = api.services.worker.onMachinePacketDeliver(`push-${identifier}`, 'push', (data: any) => {
            if (props.workerId) {
                if (data.workerId === props.workerId) {
                    (document.getElementById(identifier) as any)?.contentWindow.postMessage({ key: 'push', packet: data }, 'https://safezone.liara.run/')
                }
            } else {
                (document.getElementById(identifier) as any)?.contentWindow.postMessage({ key: 'push', packet: data }, 'https://safezone.liara.run/')
            }
        })
        return () => {
            eventController.unregister()
            eventController2.unregister()
        }
    }, [])
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <iframe
                name={identifier}
                key={identifier}
                id={identifier}
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

export default memo(Safezone, () => true)
