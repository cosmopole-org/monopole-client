
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import * as StatusBar from "./components/sections/StatusBar";
import './App.css';
import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import * as colors from "@mui/material/colors";
import Auth from "./components/pages/auth";
import Main from "./components/pages/main";
import Tower from "./components/pages/tower";
import Room from "./components/pages/room";
import Profile from './components/pages/profile';
import Splash from './components/pages/splash';
import CreateTower from './components/forms/createTower';
import CreateRoom from './components/forms/createRoom';
import UpdateProfile from './components/forms/updateProfile';
import Machines from './components/pages/machines';
import CreateMachine from './components/forms/createMachine';
import { hookstate, useHookstate } from '@hookstate/core';
import { switchColor } from './components/sections/StatusBar';
import TowerPicker from './components/pages/TowerPicker';
import Gallery from './components/pages/gallery';
import VideoPlayer from './components/pages/videoPlayer';
import AudioPlayer from './components/pages/audioPlayer';
import { resetApi } from '.';
import { Paper, Typography } from '@mui/material';
import { History } from '@mui/icons-material';

const useForceUpdate = () => {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

let forceUpdate = () => { };
const currentRoute = hookstate('')

export const fixedNightColor = {
    '500': '#292e39',
    '400': '#292e39',
    '200': '#2e3440',
    '100': '#3b4252',
    '50': '#434c5e',
    'plain': '#4c566a',
    'activeText': '#ffffff',
    'passiveText': '#dddddd'
}

let tempThemeColorName = localStorage.getItem('themeColor')
if (tempThemeColorName === null) {
    tempThemeColorName = 'night'
    localStorage.setItem('themeColor', tempThemeColorName)
}
export let themeColorName = hookstate(tempThemeColorName)

let colorFamily = { ...(colors as { [id: string]: any })[tempThemeColorName], plain: '#fff', activeText: '#333', passiveText: '#666' }
export let themeColor = hookstate(tempThemeColorName === 'night' ? fixedNightColor : colorFamily)
export let themeBasedTextColor = hookstate(tempThemeColorName === 'night' ? '#fff' : '#333')
export let themeColorSecGroup = hookstate(colors.blue)
var metaThemeColor = document.querySelector("meta[name=theme-color]");
metaThemeColor?.setAttribute("content", tempThemeColorName === 'night' ? fixedNightColor[50] : (colors as { [id: string]: any })[tempThemeColorName][50]);
const headerImageAddresses = {
    light: 'https://i.pinimg.com/564x/c2/fc/8b/c2fc8b9c90dd6cdfd10cc8a0bd09fcd2.jpg',
    dark: 'https://i.pinimg.com/564x/47/17/86/47178626549fe6895a69f65fbb877054.jpg'
}
export let headerImageAddress = hookstate(tempThemeColorName === 'night' ? headerImageAddresses.dark : headerImageAddresses.light)
let theme = createTheme({
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        color: tempThemeColorName === 'night' ? fixedNightColor['activeText'] : '#333'
                    }
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                list: {
                    '&[role="menu"]': {
                        backgroundColor: tempThemeColorName === 'night' ? fixedNightColor['plain'] : '#fff'
                    },
                },
            },
        }
    },
    palette: {
        mode: tempThemeColorName === 'night' ? 'dark' : 'light',
        primary: {
            main: themeColor.get({ noproxy: true })[200],
        },
        secondary: {
            main: colors.purple[200],
        },
        background: {
            paper: tempThemeColorName === 'night' ? fixedNightColor['plain'] : '#fff'
        }
    },
});
export let reconstructMaterialPalette = (name: string, color: any) => {
    localStorage.setItem('themeColor', name)
    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    metaThemeColor?.setAttribute("content", color[50]);
    themeColorName.set(name)
    theme = createTheme({
        components: {
            MuiTab: {
                styleOverrides: {
                    root: {
                        '&.Mui-selected': {
                            color: name === 'night' ? fixedNightColor['activeText'] : '#333'
                        }
                    },
                },
            },
            MuiMenu: {
                styleOverrides: {
                    list: {
                        '&[role="menu"]': {
                            backgroundColor: name === 'night' ? fixedNightColor['plain'] : '#fff'
                        },
                    },
                },
            }
        },
        palette: {
            mode: name === 'night' ? 'dark' : 'light',
            primary: {
                main: color[200],
            },
            secondary: {
                main: colors.purple[200],
            },
            background: {
                paper: name === 'night' ? fixedNightColor['plain'] : '#fff'
            }
        },
    });
    switchColor && switchColor(color[500], StatusBar.StatusThemes.DARK)
    themeColor.set(color)
    themeBasedTextColor.set(name === 'night' ? '#fff' : '#333')
    headerImageAddress.set(name === 'night' ? headerImageAddresses.dark : headerImageAddresses.light)
    forceUpdate()
}

let lastNaviationType: string | undefined = undefined
let loaded: boolean = false;
let historyStack: Array<{ id: string, path: string, initialData?: string }> = [];
let listeners: { [path: string]: (type: string) => void } = {};
let pages: { [id: string]: any } = {
    // activities
    'splash': Splash,
    'auth': Auth,
    'main': Main,
    'room': Room,
    'tower': Tower,
    'profile': Profile,
    'machines': Machines,
    'towerPicker': TowerPicker,
    'gallery': Gallery,
    'videoPlayer': VideoPlayer,
    'audioPlayer': AudioPlayer,
    // forms
    'createTower': CreateTower,
    'createRoom': CreateRoom,
    'updateProfile': UpdateProfile,
    'createMachine': CreateMachine
}

export let SigmaRouter = {
    reset: () => {
        historyStack = []
        listeners = {}
        lastNaviationType = undefined
        SigmaRouter.navigate('splash')
    },
    registerListener: (path: string, listener: (type: string) => void) => {
        listeners[path] = listener
    },
    unregisterListener: (path: string) => {
        delete listeners[path]
    },
    navigate: (path: string, options?: { overPrevious?: boolean, initialData?: any }) => {
        if (historyStack.length > 0 && !options?.overPrevious && listeners[historyStack[historyStack.length - 1].id]) {
            listeners[historyStack[historyStack.length - 1].id]('exit-left')
        }
        historyStack.push({ id: Math.random().toString(), path, initialData: options?.initialData })
        lastNaviationType = 'navigate'
        currentRoute.set(path)
    },
    back: () => {
        if (historyStack.length > 1) {
            listeners[historyStack[historyStack.length - 1].id] &&
                listeners[historyStack[historyStack.length - 1].id]('exit-right')
            historyStack.pop()
            lastNaviationType = 'back'
            listeners[historyStack[historyStack.length - 1].id] &&
                listeners[historyStack[historyStack.length - 1].id]('enter-left')
            setTimeout(() => {
                currentRoute.set(historyStack[historyStack.length - 1].id)
            }, 250);
        }
    },
    topPath: () => {
        return historyStack[historyStack.length - 1]?.path
    },
    bottomPath: () => {
        return historyStack[0]?.path
    },
    removeBottom: () => { historyStack.splice(0, 1) }
}

function App() {
    forceUpdate = useForceUpdate()
    const cr = useHookstate(currentRoute)
    useEffect(() => {
        if (!loaded) {
            loaded = true
            SigmaRouter.reset()
        }
    }, [])
    let result: Array<any> = []
    historyStack.forEach(({ id, path, initialData }, index) => {
        let Comp = pages[path]
        result.push(
            <Comp {...initialData as any} key={id} id={id} isOnTop={(historyStack.length - 1) === index} />
        )
    })
    return (
        <ThemeProvider theme={theme}>
            <div style={{ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: themeColor.get({ noproxy: true })['plain'] }}>
                {cr.get({ noproxy: true }).length > 0 ? result : null}
                <StatusBar.Component />
                <div
                    id={'lab-message-row'}
                    style={{
                        top: -10000,
                        height: 'auto',
                        width: 'auto',
                        maxWidth: 250,
                        position: "fixed",
                        marginLeft: 'auto',
                        marginRight: 8,
                        marginTop: 0,
                        display: 'flex'
                    }}
                >
                    <Paper
                        id={'lab-message-card'}
                        style={{
                            height: '100%',
                            width: 'auto',
                            minWidth: 100,
                            padding: 8,
                            marginLeft: 'auto',
                            marginRight: 0
                        }}
                        elevation={0}
                        className={""}
                    >
                        <div style={{ width: 'auto', height: '100%', position: 'relative' }}>
                            <Typography
                                variant={"caption"}
                                style={{
                                    textAlign: "left", fontWeight: 'bold', borderRadius: 8, marginTop: 0, height: 'auto'
                                }}
                            >
                                Keyhan
                            </Typography>
                            <Typography
                                id={'lab-message-data'}
                                style={{
                                    textAlign: "left", wordWrap: 'break-word',
                                    display: 'flex', wordBreak: 'break-word', fontSize: 14, height: 'auto',
                                    paddingBottom: 16
                                }}
                            >

                            </Typography>
                            <div style={{
                                width: 72, position: 'absolute', bottom: 0, right: 0, display: "flex",
                                paddingLeft: 8, paddingRight: 8,
                                borderRadius: "16px 16px 0px 16px"
                            }}>
                                <Typography
                                    style={{ textAlign: "right", flex: 1, fontSize: 12 }}
                                >
                                    {(new Date(Date.now())).toTimeString().substring(0, 5)}
                                </Typography>
                                <History
                                    style={{
                                        width: 16,
                                        height: 16,
                                        marginLeft: 2,
                                    }}
                                />
                            </div>
                        </div>
                    </Paper>
                    <div id={'lab-message-free-space'} style={{ marginTop: 'auto', marginBottom: 0, width: 0, height: 16 }}>

                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}

export let AppUtils = {
    reset: async () => {
        await resetApi()
        reconstructMaterialPalette('night', fixedNightColor)
        SigmaRouter.reset()
    }
}

export default App;
