
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
import TowerPicker from './components/pages/towerPicker';
import Gallery from './components/pages/gallery';
import VideoPlayer from './components/pages/videoPlayer';
import AudioPlayer from './components/pages/audioPlayer';
import { api, resetApi } from '.';
import { Avatar, Paper, Typography } from '@mui/material';
import { History } from '@mui/icons-material';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative } from 'swiper/modules';
import ManageHomeFolders from './components/forms/manageHomeFolders';
import Explore from './components/pages/explore';
import ChatPage from './components/pages/chat';
import { GlobalAppletSheet } from './components/custom/components/GlobalAppletSheet';
import toast, { Toaster } from 'react-hot-toast';
import SigmaAvatar from './components/custom/elements/SigmaAvatar';
import ITower from './api/models/tower';
import IRoom from './api/models/room';
import Call from './components/pages/call';

const useForceUpdate = () => {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

let forceUpdate = () => { };
const currentRoute = hookstate('')

export const fixedNightColor = {
    '500': '#092635',
    '400': '#0b2937',
    '200': '#0e2b3a',
    '100': '#122e3d',
    '50': '#153241',
    'plain': '#0b2937',
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
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: themeColor.get({ noproxy: true })[100],
                }
            }
        },
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
            main: tempThemeColorName === 'night' ? '#fff' : colors.purple[200],
        },
        background: {
            paper: tempThemeColorName === 'night' ? fixedNightColor[100] : '#fff'
        }
    },
});
export let reconstructMaterialPalette = (name: string, color: any) => {
    Object.values(api.memory.spaces.get({ noproxy: true })).forEach((t: any) => {
        t.wallpaper = undefined;
    });
    localStorage.setItem('themeColor', name)
    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    metaThemeColor?.setAttribute("content", color[50]);
    themeColorName.set(name)
    theme = createTheme({
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: color[100],
                    }
                }
            },
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
                main: name === 'night' ? '#fff' : colors.purple[200],
            },
            background: {
                paper: color[50]
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
    'explore': Explore,
    'chat': ChatPage,
    'call': Call,
    // forms
    'createTower': CreateTower,
    'createRoom': CreateRoom,
    'updateProfile': UpdateProfile,
    'createMachine': CreateMachine,
    'manageHomeFolders': ManageHomeFolders
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
    back: (doNotSlideBack?: boolean) => {
        if (historyStack.length > 1) {
            if (!doNotSlideBack) {
                swiper?.slidePrev();
            } else {
                historyStack.pop()
                lastNaviationType = 'back'
                setTimeout(() => {
                    currentRoute.set(historyStack[historyStack.length - 1].id)
                }, 250);
            }
        }
    },
    topInitData: () => {
        return historyStack[historyStack.length - 1]?.initialData
    },
    topPath: () => {
        return historyStack[historyStack.length - 1]?.path
    },
    bottomPath: () => {
        return historyStack[0]?.path
    },
    removeBottom: () => { historyStack.splice(0, 1) }
}

let swiper: any = undefined;

function App() {
    forceUpdate = useForceUpdate()
    const cr = useHookstate(currentRoute)
    useEffect(() => {
        swiper.slideNext();
    }, [cr.get({ noproxy: true })])
    let result: Array<any> = []
    historyStack.forEach(({ id, path, initialData }, index) => {
        let Comp = pages[path]
        result.push(
            <SwiperSlide key={id}>
                <Comp {...initialData as any} key={id} id={id} isOnTop={(historyStack.length - 1) === index} />
            </SwiperSlide>
        )
    })
    return (
        <ThemeProvider theme={theme}>
            <div style={{ width: '100%', height: window.innerHeight + 'px', minHeight: '-webkit-fill-available', overflow: 'hidden', backgroundColor: themeColor.get({ noproxy: true })['plain'] }}>
                <Swiper
                style={{
                    width: '100%',
                    height: '100%'
                }}
                    effect="creative"
                    creativeEffect={{
                        prev: {
                            shadow: true
                        },
                        next: {
                            translate: ["100%", 0, 0]
                        }
                    }}
                    modules={[EffectCreative]}
                    touchStartPreventDefault={false}
                    onSwiper={(s: any) => {
                        swiper = s;
                        swiper.update()
                        swiper.on('slideChange', function (event: any) {
                            if (event.activeIndex > event.previousIndex) {
                                // do nothing
                            } else {
                                SigmaRouter.back(true);
                            }
                        });
                        if (!loaded) {
                            loaded = true
                            SigmaRouter.navigate('splash')
                        }
                    }}
                >
                    {cr.get({ noproxy: true }).length > 0 ? result : null}
                </Swiper>
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
                <GlobalAppletSheet />
                <div style={{ position: 'absolute', zIndex: 99999 }}>
                    <Toaster />
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
