import MwcDriver from "applet-mwc"
import { useEffect, useRef } from "react"
import { Applet, Controls } from "applet-vm"
import Native, { intervalHolder, timeoutHolder } from "./Native"

let hostLoaded: { [id: string]: boolean } = {}

const unloadAllHosts = () => {
    Object.keys(hostLoaded).forEach(key => {
        Object.values(intervalHolder[key]).forEach(interval => {
            clearInterval(interval)
        })
        delete intervalHolder[key]
        Object.values(timeoutHolder[key]).forEach(timeout => {
            clearTimeout(timeout)
        })
        delete timeoutHolder[key]
    })
    hostLoaded = {}
}

const Host = (props: { appletKey: string, code: string, index: number, entry: string, onClick?: () => void }) => {
    const hostContainerrId = `AppletHost:${props.appletKey}`
    const appletRef = useRef(new Applet(props.appletKey))
    const rootRef = useRef(null)
    useEffect(() => {
        hostLoaded[props.appletKey] = true
        appletRef.current.fill(props.code)
        appletRef.current.setContextBuilder((mod) => new Native(mod, Controls))
        let root = document.getElementById(hostContainerrId)
        if (root !== null) {
            let driver = new MwcDriver(appletRef.current, root)
            driver.start(props.entry)
        }
        setTimeout(() => {
            if (rootRef.current !== null) {
                let root = rootRef.current as HTMLElement
                root.style.transform = 'scale(1, 1)'
                root.style.opacity = '1'
            }
        }, (props.index + 1) * 75);
    }, [props.code])
    return (
        <div
            ref={rootRef}
            id={hostContainerrId}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                transform: 'scale(0.65, 0.65)',
                opacity: 0,
                transition: 'transform .35s'
            }}
            onClick={props.onClick}
        />
    )
}

export default { Host, unloadAllHosts }
