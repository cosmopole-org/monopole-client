import { Add } from "@mui/icons-material"
import MachineTag from "../custom/components/MachineTag"
import MachineTag2 from "../custom/components/MachineTag2"
import SigmaFab from "../custom/elements/SigmaFab"
import { SigmaRouter } from "../../App"
import { useHookstate } from "@hookstate/core"
import { api } from "../.."
import IMachine from "../../api/models/machine"

const Inventions = (props: { show: boolean }) => {
    const machines = useHookstate(api.memory.machines).get({ noproxy: true })
    return (
        <div
            style={{ display: props.show ? 'block' : 'none', width: '100%', height: 'calc(100% - 32px - 16px)', position: 'relative', paddingTop: 32 + 16 }}
        >
            <div
                style={{
                    width: '100%', height: '100%', position: 'relative', overflowY: 'auto',
                    display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', paddingLeft: 8, paddingRight: 8
                }}
            >
                {
                    (Object.values(machines) as Array<IMachine>).filter((m: IMachine) => m.secret).map((machine: IMachine) => (
                        <MachineTag2 key={`invention-${machine.id}`} machine={machine} />
                    ))
                }
            </div>
            <SigmaFab
                style={{ position: 'absolute', right: 16, bottom: 16 }}
                onClick={() => {
                    SigmaRouter.navigate('createMachine')
                }}>
                <Add />
            </SigmaFab>
        </div>
    )
}

export default Inventions
