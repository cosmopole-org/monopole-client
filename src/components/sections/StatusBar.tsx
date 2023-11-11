import { ArrowBack, Dashboard, KeyboardCommandKey, Notifications, Settings } from "@mui/icons-material"
import { IconButton, Paper, Typography } from "@mui/material"
import { blue } from "@mui/material/colors"
import { useState } from "react"
import { SigmaRouter } from "../../App"

const statusbarHeight = () => 40
const LeftControlTypes = {
    NOTIFICATIONS: 0,
    BACK: 1
}
const RightControlTypes = {
    NONE: 0,
    COMMANDS: 1,
    SETTINGS: 2
}
const StatusThemes = {
    LIGHT: 0,
    DARK: 1
}
let leftControlFunctionality: (() => void) | undefined = undefined
let rightControlFunctionality: (() => void) | undefined = undefined
let switchLeftControl: ((type: number, functionality?: () => void) => void) | undefined = undefined
let switchRightControl: ((type: number, functionality?: () => void) => void) | undefined = undefined
let switchTitle: ((title: string) => void) | undefined = undefined
let switchColor: ((color: string, theme: number) => void) | undefined = undefined

const StatusBar = () => {
    const [leftControlType, setLeftControlType] = useState(LeftControlTypes.NOTIFICATIONS)
    const [rightControlType, setRightControlType] = useState(RightControlTypes.NONE)
    const [title, setTitle] = useState('')
    const [color, setColor] = useState(blue[500].toString())
    const [theme, setTheme] = useState(StatusThemes.LIGHT)
    switchLeftControl = (type: number, functionality?: () => void) => {
        setLeftControlType(type)
        leftControlFunctionality = functionality
    }
    switchRightControl = (type: number, functionality?: () => void) => {
        setRightControlType(type)
        rightControlFunctionality = functionality
    }
    switchTitle = (title: string) => setTitle(title)
    switchColor = (color: string, theme: number) => {
        setColor(color);
        setTheme(theme)
    }
    return SigmaRouter.topPath() === 'splash' ?
        null : (
            <Paper
                style={{
                    width: 'calc(100% - 16px)',
                    height: 40,
                    backgroundColor: color,
                    backdropFilter: 'blur(10px)',
                    zIndex: 99999,
                    position: 'fixed',
                    left: 8,
                    top: 8,
                    display: 'flex',
                    borderRadius: '24px 24px 24px 24px',
                    transition: 'color .5s'
                }}
            >
                {
                    SigmaRouter.topPath() === 'auth' ?
                        null :
                        (
                            <IconButton size={'small'} style={{ width: 32, height: 32, backgroundColor: color, borderRadius: '50%', position: 'absolute', top: 4, left: 8 }}
                                onClick={() => {
                                    leftControlFunctionality && leftControlFunctionality()
                                }}
                            >
                                {
                                    leftControlType === LeftControlTypes.NOTIFICATIONS ?
                                        <Notifications style={{ color: theme === StatusThemes.LIGHT ? '#666' : '#fff' }} /> :
                                        leftControlType === LeftControlTypes.BACK ?
                                            <ArrowBack style={{ color: theme === StatusThemes.LIGHT ? '#666' : '#fff' }} /> :
                                            null
                                }
                            </IconButton>
                        )
                }
                <Typography variant={'body1'} style={{ color: theme === StatusThemes.LIGHT ? '#666' : '#fff', position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)', display: 'flex' }}>
                    {title}
                </Typography>
                {
                    rightControlType === RightControlTypes.COMMANDS ?
                        (
                            <IconButton
                                onClick={() => {
                                    rightControlFunctionality && rightControlFunctionality()
                                }}
                                size="small" style={{ width: 32, height: 32, backgroundColor: color, borderRadius: '50%', position: 'absolute', top: 4, right: 8 + 32 + 8 }}>
                                <KeyboardCommandKey style={{ color: theme === StatusThemes.LIGHT ? '#666' : '#fff' }} />
                            </IconButton>
                        ) :
                        rightControlType === RightControlTypes.SETTINGS ?
                            (
                                <IconButton
                                    onClick={() => {
                                        rightControlFunctionality && rightControlFunctionality()
                                    }}
                                    size="small" style={{ width: 32, height: 32, backgroundColor: color, borderRadius: '50%', position: 'absolute', top: 4, right: 8 + 32 + 8 }}>
                                    <Settings style={{ color: theme === StatusThemes.LIGHT ? '#666' : '#fff' }} />
                                </IconButton>
                            ) :
                            null
                }
                {
                    SigmaRouter.topPath() === 'auth' ?
                        null :
                        (
                            <IconButton size="small" style={{ width: 32, height: 32, backgroundColor: color, borderRadius: '50%', position: 'absolute', top: 4, right: 8 }}>
                                <Dashboard style={{ color: theme === StatusThemes.LIGHT ? '#666' : '#fff' }} />
                            </IconButton>
                        )
                }
            </Paper>
        )
}

export { StatusBar as Component, statusbarHeight, switchLeftControl, LeftControlTypes, switchRightControl, RightControlTypes, switchTitle, switchColor, StatusThemes }