import { useHookstate } from "@hookstate/core"
import { closeOverlaySafezone, overlaySafezoneData, themeBasedTextColor } from "../../../App"
import Safezone from "./Safezone"
import { CircularProgress, Paper } from "@mui/material"
import SigmaFab from "../elements/SigmaFab"
import { Close } from "@mui/icons-material"
import { readyState } from "./Desktop"

const Overlay = () => {
    const overlaySafezone = useHookstate(overlaySafezoneData).get({ noproxy: true })
    const ready = useHookstate(readyState).get({ noproxy: true })
    return overlaySafezone ? (
        <div style={{ width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: 99999 }}>
            <Safezone code={overlaySafezone.code} workerId={overlaySafezone.workerId} roomId={overlaySafezone.room.id} towerId={overlaySafezone.room.towerId} />
            {
                (!overlaySafezone.code || (overlaySafezone.code && overlaySafezone.code?.startsWith('safezone/') && !ready)) ? (
                    <Paper style={{ width: 56, height: 56, position: 'absolute', left: '50%', top: 'calc(50% - 16px)', transform: 'translate(-50%, -50%)', borderRadius: '50%' }}>
                        <CircularProgress style={{ width: '80%', height: '80%', margin: '10%' }} variant="indeterminate" />
                    </Paper>
                ) : null
            }
            {
                (!overlaySafezone.code || (overlaySafezone.code && overlaySafezone.code?.startsWith('safezone/') && !ready)) ? (
                    <SigmaFab onClick={() => {
                        closeOverlaySafezone()
                    }} variant="extended" style={{ position: 'absolute', left: '50%', top: 'calc(50% - 16px + 68px)', transform: 'translate(-50%, -50%)' }}>
                        <Close style={{ fill: themeBasedTextColor.get({ noproxy: true }), marginRight: 12 }} />
                        Cancel
                    </SigmaFab>
                ) : null
            }
        </div>
    ) : null
}

export default Overlay
