import { useRef } from "react"
import MachineBar from "../sections/MachineBar"

const useMachines = () => {
    const pulseContainerRef = useRef(null)
    const collapseCallback = (v: boolean, collapsibleScrollTop: number) => {
        if (pulseContainerRef.current !== null) {
            let pulseContainer = pulseContainerRef.current as HTMLElement
            pulseContainer.style.top = `${-collapsibleScrollTop / 2}px`
            pulseContainer.style.zIndex = (v ? 0 : 1).toString()
            pulseContainer.style.opacity = (v ? 0 : 1).toString()
        }
    }
    return { collapseCallback, pulseContainerRef }
}

export default useMachines
