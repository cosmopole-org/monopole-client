
import { useEffect, useRef } from 'react';
import { SigmaRouter } from '../../App';

const SliderPage = (props: { id: string, direction?: string, children: any }) => {
    const containerRef = useRef(null)
    useEffect(() => {
        SigmaRouter.registerListener(props.id, (type: string) => {
            if (containerRef.current !== null) {
                let container = containerRef.current as HTMLElement
                if (type === 'enter-right') {
                    container.style.transition = `transform ${props.direction === 'up' ? '400ms' : '150ms'}, opacity ${props.direction === 'up' ? '400ms' : '150ms'}`
                    container.style.opacity = '1'
                    if (props.direction === 'up') {
                        container.style.transform = `translateY(0px)`
                    } else {
                        container.style.transform = 'translateX(0px, 0px)'
                    }
                } else if (type === 'enter-left') {
                    container.style.transition = `transform ${props.direction === 'up' ? '400ms' : '250ms'}, opacity ${props.direction === 'up' ? '400ms' : '250ms'}`
                    container.style.opacity = '1'
                    if (props.direction === 'up') {
                        container.style.transform = `translateY(0px)`
                    } else {
                        container.style.transform = 'translateX(0px)'
                    }
                } else if (type === 'exit-left') {
                    container.style.transition = `transform ${props.direction === 'up' ? '400ms' : '500ms'}, opacity ${props.direction === 'up' ? '400ms' : '500ms'}`
                    if (props.direction === 'up') {
                        container.style.opacity = '1'
                        // do nothing
                    } else {
                        container.style.opacity = '0'
                        container.style.transform = 'translateX(-50%)'
                    }
                } else if (type === 'exit-right') {
                    container.style.transition = `transform ${props.direction === 'up' ? '250ms' : '250ms'}, opacity ${props.direction === 'up' ? '250ms' : '250ms'}`
                    container.style.opacity = props.direction === 'up' ? '1' : '0'
                    if (props.direction === 'up') {
                        container.style.transform = `translateY(100%)`
                    } else {
                        container.style.transform = 'translateX(25%)'
                    }
                }
            }
        })
        setTimeout(() => {
            if (containerRef.current !== null) {
                let container = containerRef.current as HTMLElement
                container.style.transition = `transform ${props.direction === 'up' ? '400ms' : '250ms'}, opacity ${props.direction === 'up' ? '400ms' : '250ms'}`
                container.style.opacity = '1'
                if (props.direction === 'up') {
                    container.style.transform = `translateY(0px)`
                } else {
                    container.style.transform = 'translateX(0px)'
                }
            }
        })
        return () => {
            SigmaRouter.unregisterListener(props.id)
        }
    }, [])
    return (
        <div ref={containerRef} style={{
            width: '100%', height: '100%', position: 'absolute', left: 0,
            transform: props.direction === 'up' ? 'translate(0px, 100%)' : 'translateX(50%)',
            top: 0, opacity: props.direction === 'up' ? 1 : 0, zIndex: 2,
            transition: `transform ${props.direction === 'up' ? '400ms' : '250ms'}, opacity ${props.direction === 'up' ? '400ms' : '250ms'}`
        }}>
            {props.children}
        </div>
    )
}

export default SliderPage
