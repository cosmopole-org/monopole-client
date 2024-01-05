import { CircularProgress, Paper, Typography } from "@mui/material"
import SigmaFab from "../elements/SigmaFab"
import { Close } from "@mui/icons-material"
import { themeBasedTextColor, themeColor } from "../../../App"

const Loading = (props: { onCancel: () => void, overlay?: boolean, isWidget?: boolean }) => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'fixed', left: 0, top: 0 }}>
            {
                props.overlay ? (
                    <Paper style={{ position: 'absolute', left: '50%', top: 'calc(50% - 16px)', transform: 'translate(-50%, -50%)', borderRadius: 24, backgroundColor: themeColor.get({ noproxy: true })[100] }}>
                        {
                            props.isWidget ? (
                                <div style={{ width: 'auto', height: 'auto', position: 'relative', padding: 32 }}>
                                    <Paper style={{ width: 56, height: 56, borderRadius: '50%', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                                        <CircularProgress style={{ width: '80%', height: '80%', margin: '10%' }} variant="indeterminate" />
                                    </Paper>
                                </div>
                            ) : (
                                <div style={{ width: 'auto', height: 'auto', position: 'relative', padding: 32 }}>
                                    <Paper style={{ width: 56, height: 56, borderRadius: '50%', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                                        <CircularProgress style={{ width: '80%', height: '80%', margin: '10%' }} variant="indeterminate" />
                                    </Paper>
                                    <div style={{ width: 56, height: 56 }} />
                                    <Typography variant="body1" style={{ width: '100%', textAlign: 'center', marginTop: 12 }}>
                                        Loading Applet...
                                    </Typography>
                                    <SigmaFab
                                        style={{ marginTop: 32 }}
                                        onClick={() => {
                                            props.onCancel()
                                        }}
                                        variant="extended"
                                    >
                                        <Close style={{ fill: themeBasedTextColor.get({ noproxy: true }), marginRight: 12 }} />
                                        Cancel
                                    </SigmaFab>
                                </div>
                            )
                        }
                    </Paper>
                ) : (
                    <div style={{ position: 'absolute', left: '50%', top: 'calc(50% - 16px)', transform: 'translate(-50%, -50%)' }}>
                        <div style={{ width: 'auto', height: 'auto', position: 'relative', padding: 32 }}>
                            <Paper style={{ width: 56, height: 56, borderRadius: '50%', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                                <CircularProgress style={{ width: '80%', height: '80%', margin: '10%' }} variant="indeterminate" />
                            </Paper>
                            <div style={{ width: 56, height: 56 }} />
                            <Typography variant="body1" style={{ width: '100%', textAlign: 'center', marginTop: 12 }}>
                                Loading Applet...
                            </Typography>
                            <SigmaFab
                                style={{ marginTop: 32 }}
                                onClick={() => {
                                    props.onCancel()
                                }}
                                variant="extended"
                            >
                                <Close style={{ fill: themeBasedTextColor.get({ noproxy: true }), marginRight: 12 }} />
                                Cancel
                            </SigmaFab>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Loading
