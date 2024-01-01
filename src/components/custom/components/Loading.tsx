import { CircularProgress, Paper } from "@mui/material"
import SigmaFab from "../elements/SigmaFab"
import { Close } from "@mui/icons-material"
import { themeBasedTextColor, themeColor } from "../../../App"

const Loading = (props: { onCancel: () => void }) => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'fixed', left: 0, top: 0 }}>
            <div style={{ width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, backgroundColor: themeColor.get({noproxy: true})[200], opacity: 0.35 }} />
            <Paper style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', borderRadius: 24 }}>
                <div style={{ width: 'auto', height: 'auto', position: 'relative', padding: 32 }}>
                    <Paper style={{ width: 56, height: 56, borderRadius: '50%', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                        <CircularProgress style={{ width: '80%', height: '80%', margin: '10%' }} variant="indeterminate" />
                    </Paper>
                    <div style={{ width: 56, height: 56 }} />
                    <SigmaFab
                        style={{ marginTop: 12 }}
                        onClick={() => {
                            props.onCancel()
                        }}
                        variant="extended"
                    >
                        <Close style={{ fill: themeBasedTextColor.get({ noproxy: true }), marginRight: 12 }} />
                        Cancel
                    </SigmaFab>
                </div>
            </Paper>
        </div>
    )
}

export default Loading
