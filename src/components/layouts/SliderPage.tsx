
import { useRef } from 'react';

const SliderPage = (props: { id: string, direction?: string, children: any, style?: any }) => {
    const containerRef = useRef(null)
    return (
        <div ref={containerRef} style={{
            width: '100%',
            height: '100%',
            ...props.style
        }}>
            {props.children}
        </div>
    )
}

export default SliderPage
