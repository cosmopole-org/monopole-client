import { useEffect, useRef, useState } from "react"
import usePulseBar from "../hooks/usePulseBar"
import useSearchBar from "../hooks/useSearchBar."
import TowerMoreMenu from "../custom/components/TowerMoreMenu"
import useTowersList from "../hooks/useTowersList"
import { statusbarHeight } from "../sections/StatusBar"
import { api } from "../.."
import { useHookstate } from "@hookstate/core"
import { Add, Height } from "@mui/icons-material"
import { SigmaRouter, themeColor, themeColorName } from "../../App"
import SigmaFab from "../custom/elements/SigmaFab"
import SearchBar from "../custom/components/SearchBar"
import '../../resources/styles/home.css'
import { colors, hexToRgb } from "@mui/material"

let savedSCrollTop = 0,
    cachedSearchBarTop: { value: number, maxValue: number } = {
        value: 24 + statusbarHeight(),
        maxValue: 24 + statusbarHeight()
    }

const Home = (props: { isOnTop: boolean, show: boolean, isPage?: boolean }) => {
    const [pointedTower, setPointedTower] = useState()
    const allSpaces = useHookstate(api.memory.spaces).get({ noproxy: true })
    const [searchText, setSearchText] = useState('')
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const spaces = Object.values(allSpaces).filter(tower => tower.title.includes(searchText))
    const chats = Object.values(useHookstate(api.memory.chats).get({ noproxy: true }))
    const chatTowerIdsDict: { [id: string]: boolean } = {}
    chats.forEach(chat => {
        chatTowerIdsDict[chat.towerId] = true
    });
    let towers = spaces.filter(s => (chatTowerIdsDict[s.id] === undefined))
    let TowersList = useTowersList(
        (dy: number, v: boolean, collapsibleScrollTop: number) => {
            PulseBar.collapseCallback(v, collapsibleScrollTop)
            SearchBarHandler.collapseCallback(dy, v, collapsibleScrollTop)
        },
        (tower: any) => setPointedTower(tower),
        (scrollTop: number) => {
            if (props.show) {
                savedSCrollTop = scrollTop
                if (headerRef.current !== null) {
                    if (scrollTop > 64) {
                        (headerRef.current as HTMLElement).style.opacity = '0'
                    } else {
                        (headerRef.current as HTMLElement).style.opacity = '1'
                    }
                }
            }
        },
        savedSCrollTop,
        {
            paddingTop: 80 + statusbarHeight(),
            ...(themeColorName.get({ noproxy: true }) === 'night' && {
                paper: {
                    backgroundColor: themeColor.get({ noproxy: true })[400]
                }
            })
        },
        80,
        false,
        props.show,
        towers,
        props.isPage === true
    )
    let PulseBar = usePulseBar()
    let SearchBarHandler = useSearchBar(cachedSearchBarTop)
    useEffect(() => {
        PulseBar.collapseCallback(savedSCrollTop > 16, 0)
        SearchBarHandler.collapseCallback(0, savedSCrollTop > 16, 0)
    }, [])
    useEffect(() => {
        if (props.show && props.isOnTop) {
            PulseBar.collapseCallback(savedSCrollTop > 16, 0)
            SearchBarHandler.collapseCallback(0, savedSCrollTop > 16, 0)
        }
    }, [props.show, props.isOnTop])
    return (
        <div ref={containerRef} style={{ backgroundColor: themeColor.get({ noproxy: true })[300], position: 'relative', width: '100%', height: '100%', zIndex: 2 }}>
            <TowersList.Component />
            <SearchBar
                style={{
                    backgroundColor: '#' + themeColor.get({ noproxy: true })[100].substring(1) + "99"
                }}
                containerRef={SearchBarHandler.searchContainerRef} placeHolder={'Search Towers...'} onSearch={(text: string) => setSearchText(text)} />
            <TowerMoreMenu
                tower={pointedTower}
                onClose={() => setPointedTower(undefined)}
                shown={pointedTower !== undefined}
            />
            <SigmaFab style={{ position: 'fixed', right: 16, bottom: 16 + (props.isPage ? 0 : 56), borderRadius: 16 }} onClick={() => {
                SigmaRouter.navigate('createTower')
            }}>
                <Add />
            </SigmaFab>
        </div>
    )
}

export default Home
