import { useEffect, useRef, useState } from "react"
import usePulseBar from "../hooks/usePulseBar"
import useSearchBar from "../hooks/useSearchBar."
import TowerMoreMenu from "../custom/components/TowerMoreMenu"
import useTowersList from "../hooks/useTowersList"
import { statusbarHeight } from "../sections/StatusBar"
import { api } from "../.."
import { useHookstate } from "@hookstate/core"
import { Fab } from "@mui/material"
import { Add } from "@mui/icons-material"
import { SigmaRouter, headerImageAddress, themeColor, themeColorName } from "../../App"
import SigmaFab from "../custom/elements/SigmaFab"
import SearchBar from "../custom/components/SearchBar"
import '../../resources/styles/home.css'

let savedSCrollTop = 0,
    cachedSearchBarTop: { value: number, maxValue: number } = {
        value: 40 + statusbarHeight(),
        maxValue: 40 + statusbarHeight()
    }

const Home = (props: { isOnTop: boolean, show: boolean }) => {
    const [pointedTower, setPointedTower] = useState()
    const allSpaces = useHookstate(api.memory.spaces).get({ noproxy: true })
    const [searchText, setSearchText] = useState('')
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const spaces = Object.values(allSpaces).filter(tower => tower.title.includes(searchText))
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
            paddingTop: 144 + statusbarHeight()
        },
        80,
        false,
        props.show,
        spaces
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
        <div ref={containerRef} style={{ backgroundColor: themeColor.get({ noproxy: true })[50], overflowY: 'auto', position: 'relative', width: '100%', height: 'calc(100% - 8px)', zIndex: 2 }}>
            <div className="area" style={{
                height: 200,
                background: `linear-gradient(to left, ${themeColor.get({ noproxy: true })[100]}, ${themeColor.get({ noproxy: true })[50]})`
            }}>
                <ul className="circles">
                    {
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                            <li style={{
                                background: themeColor.get({ noproxy: true })[500]
                            }}></li>
                        ))
                    }
                </ul>
            </div >
            <TowersList.Component />
            <SearchBar containerRef={SearchBarHandler.searchContainerRef} placeHolder={'Search Towers...'} onSearch={(text: string) => setSearchText(text)} />
            <TowerMoreMenu
                tower={pointedTower}
                onClose={() => setPointedTower(undefined)}
                shown={pointedTower !== undefined}
            />
            <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16 + 56, borderRadius: 16 }} onClick={() => {
                SigmaRouter.navigate('createTower')
            }}>
                <Add />
            </SigmaFab>
        </div>
    )
}

export default Home
