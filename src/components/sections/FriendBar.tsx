
import FriendTag from "../custom/components/FriendTag"
import { statusbarHeight } from "./StatusBar"

const FriendBar = (props: { containerRef: any, humans: Array<any> }) => {
    return (
        <div ref={props.containerRef} style={{
            width: '100%',
            height: 184,
            paddingTop: statusbarHeight() + 72,
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
                    props.humans.map((human: any) => (
                        <FriendTag key={`friend-tag-${human.id}`} human={human} />
                    ))
                }
            </div>
        </div>
    )
}

export default FriendBar
