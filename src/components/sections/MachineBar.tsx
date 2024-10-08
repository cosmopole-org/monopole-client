
import IMachine from "../../api/models/machine";
import { allThemeColors } from "../../App";
import MachineTag from "../custom/components/MachineTag"
import { statusbarHeight } from "./StatusBar"

const MachineBar = (props: { containerRef: any, machines: Array<any> }) => {
    props.machines.forEach((mac: IMachine) => {
        if (!(mac as any).color) {
            (mac as any).color = allThemeColors[Math.floor(Math.random() * allThemeColors.length)];
        }
    });
    return (
        <div ref={props.containerRef} style={{
            width: '100%',
            height: 184,
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
                    props.machines.map((machine: any) => (
                        <MachineTag key={`machine-tag-${machine.id}`} machine={machine} />
                    ))
                }
            </div>
        </div>
    )
}

export default MachineBar
