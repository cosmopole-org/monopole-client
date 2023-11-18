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
import { SigmaRouter } from "../../App"
import SigmaFab from "../custom/elements/SigmaFab"
import SearchBar from "../custom/components/SearchBar"

let savedSCrollTop = 0,
    cachedSearchBarTop: { value: number, maxValue: number } = {
        value: 24 + statusbarHeight(),
        maxValue: 24 + statusbarHeight()
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
        { paddingTop: 200 + statusbarHeight() },
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
        <div ref={containerRef} style={{ backgroundColor: '#fff', overflowY: 'auto', position: 'relative', width: '100%', height: 'calc(100% - 64px)', zIndex: 2 }}>
            <img ref={headerRef} style={{ opacity: 1, width: '100%', height: 266, position: 'sticky', top: 0, transition: 'opacity .5s' }} src={'https://i.pinimg.com/564x/c2/fc/8b/c2fc8b9c90dd6cdfd10cc8a0bd09fcd2.jpg'} alt={'header'} />
            <PulseBar.Component />
            <TowersList.Component />
            <SearchBar containerRef={SearchBarHandler.searchContainerRef} placeHolder={'Search Towers...'} onSearch={(text: string) => setSearchText(text)} />
            <TowerMoreMenu
                tower={pointedTower}
                onClose={() => setPointedTower(undefined)}
                shown={pointedTower !== undefined}
            />
            <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16, borderRadius: 16 }} onClick={() => {
                SigmaRouter.navigate('createTower')
            }}>
                <Add />
            </SigmaFab>
        </div>
    )
}

export default Home
