
import { SigmaRouter } from "../../App"
import MachineTag from "../custom/components/MachineTag"
import { statusbarHeight } from "./StatusBar"

const MachineBar = (props: { containerRef: any, machines: Array<any> }) => {
    return (
        <div ref={props.containerRef} style={{
            width: '100%',
            height: 160,
            paddingTop: statusbarHeight() + 84,
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
                    props.machines.map((machine: any) => (
                        <MachineTag key={`machine-tag-${machine.id}`} onClick={() => {
                            SigmaRouter.navigate('profile', { initialData: { machine } })
                        }} />
                    ))
                }
            </div>
        </div>
    )
}

export default MachineBar
