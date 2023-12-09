
import { useEffect, useRef } from 'react';
import { SigmaRouter } from '../../App';

const SliderPage = (props: { id: string, direction?: string, children: any }) => {
    const containerRef = useRef(null)
    return (
        <div ref={containerRef} style={{
            width: '100%',
            height: '100%'
        }}>
            {props.children}
        </div>
    )
}

export default SliderPage
