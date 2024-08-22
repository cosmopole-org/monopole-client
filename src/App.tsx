
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
import { State, hookstate, useHookstate } from '@hookstate/core';
import { switchColor } from './components/sections/StatusBar';
import TowerPicker from './components/pages/towerPicker';
import Gallery from './components/pages/gallery';
import VideoPlayer from './components/pages/videoPlayer';
import AudioPlayer from './components/pages/audioPlayer';
import { api, resetApi } from '.';
import { CircularProgress, IconButton, Paper, Typography } from '@mui/material';
import { Close, History } from '@mui/icons-material';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative } from 'swiper/modules';
import ManageHomeFolders from './components/forms/manageHomeFolders';
import Explore from './components/pages/explore';
import ChatPage from './components/pages/chat';
import { GlobalAppletSheet } from './components/custom/components/GlobalAppletSheet';
import { Toaster } from 'react-hot-toast';
import Call from './components/pages/call';
import SnMain from './components/pages/main/sn';
import ChatsPage from './components/pages/chats';
import SettingsPage from './components/pages/settings';
import InboxPage from './components/pages/inbox';
import HomePage from './components/pages/home';
import Overlay, { overlaySafezoneData } from './components/custom/components/Overlay';
import useSafezone from './components/hooks/useSafezone';

export const darkWallpapers = [
    'https://i.pinimg.com/564x/85/38/d0/8538d0c0cc4ef43eaaccfca3060ad2db.jpg',
    'https://i.pinimg.com/564x/6f/17/b6/6f17b6acf760db99cb3a0515798937ac.jpg',
    'https://i.pinimg.com/564x/16/ea/2a/16ea2abe1d973acfdcbfe0e411fa7ed1.jpg',
    'https://i.pinimg.com/564x/6b/64/10/6b6410ec170a6447823a7c606f389dda.jpg',
    'https://i.pinimg.com/564x/c8/fb/d9/c8fbd9f8e240be49465781c734219789.jpg'
]

export const lightWallpapers = [
    'https://i.pinimg.com/564x/8c/0a/f5/8c0af58e75fb51ded414e430425c04dd.jpg',
    'https://i.pinimg.com/564x/12/15/c1/1215c1d4a2d7271cf1209b703bbb3b34.jpg',
    'https://i.pinimg.com/564x/98/4a/a1/984aa1708a8304e958360c6275712a1d.jpg',
    'https://i.pinimg.com/564x/b5/70/68/b57068e5e9bfee48dc07eb73a4736f76.jpg',
    'https://i.pinimg.com/564x/ca/1b/be/ca1bbeb87e3ab7c32c7846df9cdef545.jpg'
]

let tempInterfaceMode = localStorage.getItem('interfaceMode')
if (tempInterfaceMode === null) {
    tempInterfaceMode = 'sn'
    localStorage.setItem('interfaceMode', tempInterfaceMode)
}
export const interfaceMode = hookstate(tempInterfaceMode)
export const switchInterfaceMode = (val: string) => {
    localStorage.setItem('interfaceMode', val)
    interfaceMode.set(val)
    setTimeout(() => {
        SigmaRouter.reset()
    })
}

const useForceUpdate = () => {
    const [, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

export let forceUpdate = () => { };
const currentRoute = hookstate('')

export const fixedNightColor = {
    '500': '#1e2135',
    '400': '#1e2135',
    '200': '#282b42',
    '100': '#36394f',
    '50': '#424559',
    'plain': '#36394f',
    'activeText': '#ffffff',
    'passiveText': '#dddddd',
    'antiColor': '#fff',
    'absolutePlain': '#1e2135'
}

let tempThemeColorName = localStorage.getItem('themeColor')
if (tempThemeColorName === null) {
    tempThemeColorName = 'night'
    localStorage.setItem('themeColor', tempThemeColorName)
}
export let themeColorName = hookstate(tempThemeColorName)

let colorFamily = { ...(colors as { [id: string]: any })[tempThemeColorName], absolutePlain: '#fff', plain: '#fff', activeText: '#333', passiveText: '#666' }
export let themeColor = hookstate(tempThemeColorName === 'night' ? fixedNightColor : colorFamily)
export let themeBasedTextColor = hookstate(tempThemeColorName === 'night' ? '#fff' : '#333')
export let themeColorSecondary = hookstate(tempThemeColorName === 'night' ? '#fff' : colors.purple[200])
let metaThemeColor = document.querySelector("meta[name=theme-color]");
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
    themeColorSecondary.set(name === 'night' ? '#fff' : colors.purple[200])
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
    'sn': SnMain,
    'chats': ChatsPage,
    'settings': SettingsPage,
    'inbox': InboxPage,
    'home': HomePage,
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
    navigate: (path: string, options?: { overPrevious?: boolean, vertical?: boolean, initialData?: any }) => {
        if (historyStack.length > 0 && !options?.overPrevious && listeners[historyStack[historyStack.length - 1].id]) {
            listeners[historyStack[historyStack.length - 1].id]('exit-left')
        }
        if (options?.vertical) {
            
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
export let switchSwipeable = (val: boolean) => {
    if (interfaceMode.get({ noproxy: true }) === 'os' && historyStack.length <= 2) {
        swiper.allowTouchMove = false
    } else {
        swiper.allowTouchMove = val
    }
}

function App() {
    forceUpdate = useForceUpdate()
    const cr = useHookstate(currentRoute)
    const safezone = useSafezone()
    const overlaySafezone = useHookstate(overlaySafezoneData).get({ noproxy: true })
    useEffect(() => {
        if (historyStack.length > 2) {
            swiper.allowTouchMove = true
        } else {
            swiper.allowTouchMove = false
        }
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
                {
                    overlaySafezone ? <Overlay /> : null

                }
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


const GoogleDocumentViewer = () => {
    const [documentContent, setDocumentContent] = useState('');
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch(
                    'https://www.googleapis.com/drive/v3/files/DOCUMENT_ID/export?mimeType=text/html',
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer YOUR_ACCESS_TOKEN`,
                        },
                    }
                );
                setDocumentContent(await response.json());
            } catch (error) {
                console.error('Error fetching Google Document:', error);
            }
        };
        fetchDocument();
    }, []);
    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: documentContent }} />
        </div>
    );
};
