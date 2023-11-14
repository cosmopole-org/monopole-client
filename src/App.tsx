
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import * as StatusBar from "./components/sections/StatusBar";
import './App.css';
import { useEffect, useState } from "react";
import { Shadow, exitShadow } from "./components/custom/components/Shadow";
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
import { AppletSheet } from './components/custom/components/AppletSheet';
import Machines from './components/pages/machines';
import CreateMachine from './components/forms/createMachine';
import { hookstate } from '@hookstate/core';
import { switchColor } from './components/sections/StatusBar';

const useForceUpdate = () => {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

let forceUpdate = () => {};

let tempThemeColorName = localStorage.getItem('themeColor')
if (tempThemeColorName === null) {
    tempThemeColorName = 'blue'
    localStorage.setItem('themeColor', tempThemeColorName)
}
export let themeColorName = hookstate(tempThemeColorName)
export let themeColor = hookstate((colors as { [id: string]: any })[tempThemeColorName])
let theme = createTheme({
    palette: {
        primary: {
            main: themeColor.get({noproxy: true})[300],
        },
        secondary: {
            main: colors.purple[400],
        },
    },
});
export let reconstructMaterialPalette = (name: string, color: any) => {
    localStorage.setItem('themeColor', name)
    themeColorName.set(name)
    theme = createTheme({
        palette: {
            primary: {
                main: color[300],
            },
            secondary: {
                main: colors.purple[400],
            },
        },
    });
    switchColor && switchColor(color[300], StatusBar.StatusThemes.DARK)
    themeColor.set(color)
    forceUpdate()
}

let lastNaviationType: string | undefined = undefined
let loaded: boolean = false;
let historyStack: Array<{ id: string, path: string, initialData?: string }> = [];
let listeners: { [path: string]: (type: string) => void } = {};
let refToCurrentRouteStateChanger: ((path: string) => void) | undefined = undefined;
let pages: { [id: string]: any } = {
    // activities
    'splash': Splash,
    'auth': Auth,
    'main': Main,
    'room': Room,
    'tower': Tower,
    'profile': Profile,
    'machines': Machines,
    // forms
    'createTower': CreateTower,
    'createRoom': CreateRoom,
    'updateProfile': UpdateProfile,
    'createMachine': CreateMachine
}

export let SigmaRouter = {
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
        refToCurrentRouteStateChanger && refToCurrentRouteStateChanger(path)
    },
    back: () => {
        if (historyStack.length > 1) {
            if (historyStack[historyStack.length - 1].path === 'room') {
                exitShadow && exitShadow()
            }
            listeners[historyStack[historyStack.length - 1].id] &&
                listeners[historyStack[historyStack.length - 1].id]('exit-right')
            historyStack.pop()
            lastNaviationType = 'back'
            listeners[historyStack[historyStack.length - 1].id] &&
                listeners[historyStack[historyStack.length - 1].id]('enter-left')
            setTimeout(() => {
                refToCurrentRouteStateChanger && refToCurrentRouteStateChanger(historyStack[historyStack.length - 1].id)
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
    const [_, setCurrentRoute] = useState(historyStack[historyStack.length - 1]?.id)
    refToCurrentRouteStateChanger = setCurrentRoute
    useEffect(() => {
        if (!loaded) {
            loaded = true
            SigmaRouter.navigate('splash')
        }
    }, [])
    let result: Array<any> = []
    historyStack.forEach(({ id, path, initialData }, index) => {
        let Comp = pages[path]
        if (path === 'room') {
            result.push(
                <Shadow key={`shadow-${index}`} />
            )
        }
        result.push(
            <Comp {...initialData as any} key={id} id={id} isOnTop={(historyStack.length - 1) === index} />
        )
    })
    return (
        <ThemeProvider theme={theme}>
            <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
                {result}
                <AppletSheet />
                <StatusBar.Component />
            </div>
        </ThemeProvider>
    );
}

export default App;
