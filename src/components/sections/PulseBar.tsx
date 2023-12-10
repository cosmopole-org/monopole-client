
import StoryAvatar from "../custom/components/StoryAvatar"
import { statusbarHeight } from "./StatusBar"

const PulseBar = (props: { pulseContainerRef: any }) => {
    return (
        <div ref={props.pulseContainerRef} style={{
            width: '100%',
            height: 64,
            paddingTop: statusbarHeight() + 80,
            overflowX: 'auto',
            position: 'absolute',
            left: 0,
            top: 0,
            opacity: 1,
            transition: 'opacity .5s',
            zIndex: 0
        }}>
            <div style={{ width: 'auto', height: '100%', display: 'flex', position: 'relative' }}>
                {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
                        <StoryAvatar key={`story-avatar-${index}`} />
                    ))
                }
            </div>
        </div>
    )
}

export default PulseBar
