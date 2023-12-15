import { useRef } from "react"

const useFriends = () => {
    const friendsContainerRef = useRef(null)
    const collapseCallback = (v: boolean, collapsibleScrollTop: number) => {
        if (friendsContainerRef.current !== null) {
            let pulseContainer = friendsContainerRef.current as HTMLElement
            pulseContainer.style.top = `${-collapsibleScrollTop / 2}px`
            pulseContainer.style.zIndex = (v ? 0 : 1).toString()
            pulseContainer.style.opacity = (v ? 0 : 1).toString()
        }
    }
    return { collapseCallback, friendsContainerRef }
}

export default useFriends
