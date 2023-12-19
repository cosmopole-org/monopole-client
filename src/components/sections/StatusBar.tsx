import { ArrowBack, Close, Dashboard, Explore, Feed, Home, KeyboardCommandKey, MusicNote, Notifications, Settings, Wallet } from "@mui/icons-material"
import { IconButton, Paper, Typography } from "@mui/material"
import { useState } from "react"
import { SigmaRouter, themeBasedTextColor, themeColor } from "../../App"

const statusbarHeight = () => 40
const LeftControlTypes = {
    NOTIFICATIONS: 0,
    BACK: 1,
    CLOSE: 2,
    WALLET: 3,
    HOME: 4
}
const RightControlTypes = {
    NONE: 0,
    COMMANDS: 1,
    SETTINGS: 2,
    EXPLORE: 3
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

    }
    return SigmaRouter.topPath() === 'splash' ?
        null : (
            <Paper
                style={{
                    width: 'calc(100% - 16px)',
                    height: 40,
                    backgroundColor: themeColor.get({ noproxy: true })[200].toString(),
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
                            <IconButton size={'small'} style={{ width: 32, height: 32, borderRadius: '50%', position: 'absolute', top: 4, left: 8 }}
                                onClick={() => {
                                    leftControlFunctionality && leftControlFunctionality()
                                }}
                            >
                                {
                                    leftControlType === LeftControlTypes.NOTIFICATIONS ?
                                        <Notifications style={{ color: themeBasedTextColor.get({ noproxy: true }) }} /> :
                                        leftControlType === LeftControlTypes.BACK ?
                                            <ArrowBack style={{ color: themeBasedTextColor.get({ noproxy: true }) }} /> :
                                            leftControlType === LeftControlTypes.CLOSE ?
                                                <Close style={{ color: themeBasedTextColor.get({ noproxy: true }) }} /> :
                                                leftControlType === LeftControlTypes.WALLET ?
                                                    <Wallet style={{ color: themeBasedTextColor.get({ noproxy: true }) }} /> :
                                                    leftControlType === LeftControlTypes.HOME ?
                                                        <Home style={{ color: themeBasedTextColor.get({ noproxy: true }) }} /> :
                                                        null
                                }
                            </IconButton>
                        )
                }
                <Typography variant={'body1'} style={{ color: themeBasedTextColor.get({ noproxy: true }), position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)', display: 'flex' }}>
                    {title}
                </Typography>
                {
                    rightControlType !== RightControlTypes.NONE ?
                        (
                            <IconButton
                                onClick={() => {
                                    rightControlFunctionality && rightControlFunctionality()
                                }}
                                size="small" style={{ width: 32, height: 32, borderRadius: '50%', position: 'absolute', top: 4, right: 8 + 32 + 8 }}>
                                {
                                    rightControlType === RightControlTypes.COMMANDS ? (
                                        <KeyboardCommandKey style={{ color: themeBasedTextColor.get({ noproxy: true }) }} />
                                    ) : rightControlType === RightControlTypes.SETTINGS ? (
                                        <Settings style={{ color: themeBasedTextColor.get({ noproxy: true }) }} />
                                    ) : rightControlType === RightControlTypes.EXPLORE ? (
                                        <Explore style={{ color: themeBasedTextColor.get({ noproxy: true }) }} />
                                    ) : null
                                }
                            </IconButton>
                        ) : null
                }
                {
                    SigmaRouter.topPath() === 'auth' || SigmaRouter.topPath() === 'audioPlayer' ?
                        null :
                        (
                            <IconButton size="small" style={{ width: 32, height: 32, borderRadius: '50%', position: 'absolute', top: 4, right: 8 }}
                                onClick={() => {
                                    SigmaRouter.navigate('audioPlayer');
                                }}
                            >
                                <MusicNote style={{ color: themeBasedTextColor.get({ noproxy: true }) }} />
                            </IconButton>
                        )
                }
            </Paper>
        )
}

export { StatusBar as Component, statusbarHeight, switchLeftControl, LeftControlTypes, switchRightControl, RightControlTypes, switchTitle, switchColor, StatusThemes }
