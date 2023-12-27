import { ArrowBack, Call, CallEnd, Close, Explore, Home, LocationCity, MusicNote, Notifications, Rocket, Settings, Wallet } from "@mui/icons-material"
import { Badge, IconButton, Paper, Typography } from "@mui/material"
import { useState } from "react"
import { SigmaRouter, interfaceMode, themeBasedTextColor, themeColor } from "../../App"
import SigmaAvatar from "../custom/elements/SigmaAvatar"
import { api } from "../.."
import { useHookstate } from "@hookstate/core"
import { recentSpace } from "../pages/call"

const statusbarHeight = () => 40
const LeftControlTypes = {
    NOTIFICATIONS: 0,
    BACK: 1,
    CLOSE: 2,
    WALLET: 3,
    HOME: 4,
    CITY: 5
}
const RightControlTypes = {
    NONE: 0,
    COMMANDS: 1,
    SETTINGS: 2,
    EXPLORE: 3,
    AVATAR: 4,
    CALL: 5
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
let showAvatar: ((humanId: string) => void) | undefined = undefined
let avatarHumanId: string | undefined = undefined

const StatusBar = () => {
    const [leftControlType, setLeftControlType] = useState(LeftControlTypes.NOTIFICATIONS)
    const [rightControlType, setRightControlType] = useState(RightControlTypes.NONE)
    const [title, setTitle] = useState('')
    const calls = useHookstate(api.services.call.calls).get({ noproxy: true })
    let callCount = Object.keys(calls).length
    switchLeftControl = (type: number, functionality?: () => void) => {
        setLeftControlType(type)
        leftControlFunctionality = functionality
    }
    switchRightControl = (type: number, functionality?: () => void) => {
        setRightControlType(type)
        rightControlFunctionality = functionality
    }
    showAvatar = (humanId: string) => {
        avatarHumanId = humanId
    }
    switchTitle = (title: string) => setTitle(title)
    switchColor = (color: string, theme: number) => { }
    const isOnline = useHookstate(api.services.home.lastSeensDict).get({ noproxy: true })
    const isOs = useHookstate(interfaceMode).get({ noproxy: true }) === 'os'
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
                                        <Notifications style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} /> :
                                        leftControlType === LeftControlTypes.BACK ?
                                            <ArrowBack style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} /> :
                                            leftControlType === LeftControlTypes.CLOSE ?
                                                <Close style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} /> :
                                                leftControlType === LeftControlTypes.WALLET ?
                                                    <Wallet style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} /> :
                                                    leftControlType === LeftControlTypes.HOME ?
                                                        <Home style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} /> :
                                                        leftControlType === LeftControlTypes.CITY ?
                                                            <LocationCity style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} /> :
                                                            null
                                }
                            </IconButton>
                        )
                }
                {
                    ((SigmaRouter.topPath() === 'chat') && avatarHumanId) ?
                        (
                            <IconButton size={'small'} style={{ width: 32, height: 32, borderRadius: '50%', position: 'absolute', top: 4, left: 8 + 32 }}
                                onClick={() => {
                                    if (avatarHumanId) {
                                        SigmaRouter.navigate('profile', { initialData: { human: api.memory.known.humans.get({ noproxy: true })[avatarHumanId] } })
                                    }
                                }}>
                                <Badge color="secondary" overlap="circular" variant="dot" invisible={isOnline[avatarHumanId] !== -1}>
                                    <SigmaAvatar style={{ width: 24, height: 24, backgroundColor: themeColor.get({ noproxy: true })[100] }}>
                                        {api.memory.known.humans.get({ noproxy: true })[avatarHumanId].firstName.substring(0, 1)}
                                    </SigmaAvatar>
                                </Badge>
                            </IconButton>
                        ) : ((SigmaRouter.topPath() === 'main') && isOs) ? (
                            <IconButton size={'small'} style={{ width: 32, height: 32, borderRadius: '50%', position: 'absolute', top: 4, left: 16 + 32 }}
                                onClick={() => {
                                    SigmaRouter.navigate('explore')
                                }}
                            >
                                <Explore style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} />
                            </IconButton>
                        ) : null
                }
                <Typography
                    variant={'body1'} style={{ color: themeBasedTextColor.get({ noproxy: true }), position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)', display: 'flex' }}
                    onClick={() => {
                        if ((SigmaRouter.topPath() === 'chat') && avatarHumanId) {
                            SigmaRouter.navigate('profile', { initialData: { human: api.memory.known.humans.get({ noproxy: true })[avatarHumanId] } })
                        }
                    }}
                >
                    {((SigmaRouter.topPath() === 'chat') && avatarHumanId) ? api.memory.known.humans.get({ noproxy: true })[avatarHumanId].firstName : title}
                </Typography>
                {
                    rightControlType !== RightControlTypes.NONE ?
                        (
                            <IconButton
                                onClick={() => {
                                    if (rightControlType === RightControlTypes.AVATAR) {
                                        if (avatarHumanId) {
                                            SigmaRouter.navigate('profile', { initialData: { human: api.memory.known.humans.get({ noproxy: true })[avatarHumanId] } })
                                        }
                                    } else {
                                        rightControlFunctionality && rightControlFunctionality()
                                    }
                                }}
                                size="small" style={{ width: 32, height: 32, borderRadius: '50%', position: 'absolute', top: 4, right: 8 + 32 + 8 }}>
                                {
                                    rightControlType === RightControlTypes.CALL ? (
                                        <Call style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} />
                                    ) : rightControlType === RightControlTypes.SETTINGS ? (
                                        <Settings style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} />
                                    ) : rightControlType === RightControlTypes.EXPLORE ? (
                                        <Explore style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} />
                                    ) : null
                                }
                            </IconButton>
                        ) : null
                }
                {
                    SigmaRouter.topPath() === 'auth' || SigmaRouter.topPath() === 'audioPlayer' ?
                        null :
                        callCount > 0 ? (
                            <IconButton size="small" style={{ width: 32, height: 32, borderRadius: '50%', position: 'absolute', top: 4, right: 8 }}
                                onClick={() => {
                                    if (recentSpace && calls[recentSpace.id]) {
                                        SigmaRouter.navigate('call', { initialData: { room: recentSpace } });
                                    } else {
                                        let roomId = Object.keys(calls)[0]
                                        let tower = Object.values(api.memory.spaces.get({ noproxy: true })).find(tower => tower.rooms[roomId] !== undefined)
                                        let room = tower?.rooms[roomId]
                                        SigmaRouter.navigate('call', { initialData: { room } });
                                    }
                                }}
                            >
                                <CallEnd style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} />
                            </IconButton>
                        ) : (
                            <IconButton size="small" style={{ width: 32, height: 32, borderRadius: '50%', position: 'absolute', top: 4, right: 8 }}
                                onClick={() => {
                                    SigmaRouter.navigate('audioPlayer');
                                }}
                            >
                                <MusicNote style={{ fill: themeBasedTextColor.get({ noproxy: true }) }} />
                            </IconButton>
                        )
                }
            </Paper >
        )
}

export { StatusBar as Component, showAvatar, statusbarHeight, switchLeftControl, LeftControlTypes, switchRightControl, RightControlTypes, switchTitle, switchColor, StatusThemes }
