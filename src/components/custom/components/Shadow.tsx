import { useEffect, useRef } from "react"

let exitShadow: (() => void) | undefined

const Shadow = () => {
    let shadowRef = useRef(null)
    exitShadow = () => {
        setTimeout(() => {
            if (shadowRef.current !== null) {
                let shadow = shadowRef.current as HTMLElement
                shadow.style.opacity = '0'
            }
        });
    }
    useEffect(() => {
        setTimeout(() => {
            if (shadowRef.current !== null) {
                let shadow = shadowRef.current as HTMLElement
                shadow.style.opacity = '0.5'
            }
        });
    }, [])
    return (
        <div ref={shadowRef} style={{
            width: '100%', height: '100%', background: 'rgba(0, 0, 0, 1)',
            opacity: 0, position: 'absolute', left: 0, top: 0, transition: 'opacity 350ms'
        }} />
    )
}

export { Shadow, exitShadow }
