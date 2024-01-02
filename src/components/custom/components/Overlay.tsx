import { State, hookstate, useHookstate } from "@hookstate/core"
import AppletHost from "./AppletHost"
import { themeColor } from "../../../App"

export const overlaySafezoneData: State<any> = hookstate(undefined)

const Overlay = () => {
    const overlaySafezone = useHookstate(overlaySafezoneData).get({ noproxy: true })
    return overlaySafezone ?
        (
            <div style={{ width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: 99999 }}>
                <div style={{ width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, backgroundColor: themeColor.get({ noproxy: true })[200], opacity: 0.35 }} />
                <AppletHost.Host
                    overlay={true}
                    appletKey={overlaySafezoneData.get({ noproxy: true }).workerId}
                    code={overlaySafezoneData.get({ noproxy: true }).code}
                    room={overlaySafezoneData.get({ noproxy: true }).room}
                    index={0}
                    entry={'Test'}
                    onCancel={() => {
                        overlaySafezoneData.set(undefined)
                    }}
                />
            </div>
        ) :
        null
}

export default Overlay
