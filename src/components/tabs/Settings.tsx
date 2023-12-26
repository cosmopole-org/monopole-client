import { useRef } from "react"
import { Card, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import * as colors from '@mui/material/colors'
import { ArrowForward, Edit, Logout, SmartToy } from "@mui/icons-material"
import { api } from "../.."
import { SigmaRouter, fixedNightColor, interfaceMode, reconstructMaterialPalette, switchInterfaceMode, themeColor, themeColorName } from "../../App"
import SigmaAvatar from "../custom/elements/SigmaAvatar"
import { useAuth0 } from "@auth0/auth0-react"
import { useHookstate } from "@hookstate/core"

const Settings = (props: { isOnTop: boolean, show: boolean }) => {
    const containerRef = useRef(null)
    const { logout } = useAuth0()
    const im = useHookstate(interfaceMode).get({ noproxy: true })
    const handleColorChange = (event: SelectChangeEvent) => {
        let colorFamily = {}
        if (event.target.value === 'night') {
            colorFamily = fixedNightColor
        } else {
            colorFamily = { ...(colors as { [id: string]: any })[event.target.value.toString()], antiColor: '#000', absolutePlain: '#fff', plain: '#fff', activeText: '#333', passiveText: '#666' }
        }
        reconstructMaterialPalette(event.target.value, colorFamily)
    };
    const handleInterfaceChange = (event: SelectChangeEvent) => {
        switchInterfaceMode(event.target.value)
    };
    let me = api.memory.humans.get({ noproxy: true })[api.memory.myHumanId.get({ noproxy: true })]
    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div style={{ width: '100%', height: 16 + 56 }} />
            <Card elevation={0} style={{
                padding: 16, backgroundColor: themeColor.get({ noproxy: true })[100], borderRadius: 24, height: 'auto',
                marginLeft: 16, width: 'calc(100% - 64px)', paddingTop: 32, position: 'relative'
            }}>
                <SigmaAvatar style={{ width: 112, height: 112, margin: '0 auto' }}>
                    {me.firstName.substring(0, 1) + (me.lastName ? me.lastName.substring(0, 1) : '')}
                </SigmaAvatar>
                <Typography variant={'h6'} style={{ width: '100%', textAlign: 'center', marginTop: 16 }}>
                    {me.firstName + (me.lastName ? (' ' + me.lastName) : '')}
                </Typography>
                <IconButton style={{ position: 'absolute', right: 16, top: 16 }}
                    onClick={() => {
                        SigmaRouter.navigate('updateProfile')
                    }}
                >
                    <Edit />
                </IconButton>
            </Card>
            <Card
                elevation={0}
                style={{
                    paddingLeft: 16, paddingRight: 16, backgroundColor: themeColor.get({ noproxy: true })[100], borderRadius: 24, height: 'auto', display: 'flex',
                    marginLeft: 16, width: 'calc(100% - 64px)', position: 'relative', marginTop: 16, paddingTop: 8, paddingBottom: 8
                }}
                onClick={() => {
                    SigmaRouter.navigate('machines')
                }}
            >
                <IconButton>
                    <SmartToy />
                </IconButton>
                <Typography style={{ flex: 1, marginTop: 8 }}>
                    My Machines
                </Typography>
                <IconButton>
                    <ArrowForward />
                </IconButton>
            </Card>
            <FormControl
                style={{ marginLeft: 16, marginTop: 24, marginRight: 16, width: 'calc(100% - 32px)' }}
            >
                <InputLabel id="settings-color-select-label">Color</InputLabel>
                <Select
                    labelId="settings-color-select-label"
                    id="settings-color-select"
                    value={themeColorName.get({ noproxy: true }).toString()}
                    label="Color"
                    onChange={handleColorChange}
                    style={{
                        borderRadius: 24,
                        backgroundColor: themeColor.get({ noproxy: true })[100],
                        paddingLeft: 8
                    }}
                >
                    <MenuItem key={`settings-theme-color-night`} value={'night'}>night</MenuItem>
                    {
                        Object.keys(colors).filter(c => c !== 'common').map(c => (
                            <MenuItem key={`settings-theme-color-${c}`} value={c}>{c}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <FormControl
                style={{ marginLeft: 16, marginTop: 24, marginRight: 16, width: 'calc(100% - 32px)' }}
            >
                <InputLabel id="settings-interface-mode-select-label">Interface Mode</InputLabel>
                <Select
                    labelId="settings-interface-mode-select-label"
                    id="settings-interface-mode-select"
                    value={im}
                    label="Interface Mode"
                    onChange={handleInterfaceChange}
                    style={{
                        borderRadius: 24,
                        backgroundColor: themeColor.get({ noproxy: true })[100],
                        paddingLeft: 8
                    }}
                >
                    <MenuItem key={`settings-interface-select-item-sn`} value={'sn'}>Social Network Mode</MenuItem>
                    <MenuItem key={`settings-interface-select-item-os`} value={'os'}>Operating System Mode</MenuItem>
                </Select>
            </FormControl>
            <Card
                elevation={0}
                style={{
                    paddingLeft: 16, paddingRight: 16, backgroundColor: themeColor.get({ noproxy: true })[100], borderRadius: 24, height: 'auto', display: 'flex',
                    marginLeft: 16, width: 'calc(100% - 64px)', position: 'relative', marginTop: 16, paddingTop: 8, paddingBottom: 8
                }}
                onClick={() => {
                    if (window.confirm('do you want to sign out ?')) {
                        api.services.human.signOut()
                        logout()
                    }
                }}
            >
                <IconButton>
                    <Logout />
                </IconButton>
                <Typography style={{ flex: 1, marginTop: 8 }}>
                    Sign Out
                </Typography>
                <IconButton>
                    <ArrowForward />
                </IconButton>
            </Card>
        </div>
    )
}

export default Settings
