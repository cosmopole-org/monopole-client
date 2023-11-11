import { useCallback, useEffect, useRef, useState } from "react"
import useSearchBar from "../hooks/useSearchBar."
import useMachines from "../hooks/useMachines"
import useTowersList from "../hooks/useTowersList"
import { statusbarHeight } from "../sections/StatusBar"
import SearchBar from "../custom/components/SearchBar"
import MachineBar from "../sections/MachineBar"
import { api } from "../.."
import ITower from "../../api/models/tower"
import TowerMoreMenu from "../custom/components/TowerMoreMenu"

let savedSCrollTop = 0,
    cachedSearchBarTop: { value: number, maxValue: number } = {
        value: 24 + statusbarHeight(),
        maxValue: 24 + statusbarHeight()
    },
    cachedTowers: Array<ITower> = []

const Explore = (props: { isOnTop: boolean, show: boolean }) => {
    const [pointedTower, setPointedTower] = useState()
    const containerRef = useRef(null)
    const [searchText, setSearchText] = useState('')
    const [towers, setTowers] = useState(cachedTowers)
    const search = useCallback((text: string) => {
        api.services.tower.search({ query: text, offset: 0, count: 15 }).then((body: any) => {
            cachedTowers = body.towers
            setTowers(body.towers)
        }).catch(ex => console.log(ex))
    }, [searchText, setTowers])
    useEffect(() => {
        search(searchText)
    }, [])
    let TowersList = useTowersList(
        (dy: number, v: boolean, collapsibleScrollTop: number) => {
            MachineBarHandler.collapseCallback(v, collapsibleScrollTop)
            SearchBarHandler.collapseCallback(dy, v, collapsibleScrollTop)
        },
        (tower: any) => setPointedTower(tower),
        (scrollTop: number) => {
            if (props.show) {
                savedSCrollTop = scrollTop
            }
        },
        savedSCrollTop,
        { paddingTop: 252 + statusbarHeight() },
        184,
        true,
        props.show,
        towers
    )
    let MachineBarHandler = useMachines()
    let SearchBarHandler = useSearchBar(cachedSearchBarTop)
    useEffect(() => {
        MachineBarHandler.collapseCallback(savedSCrollTop > 16, 0)
        SearchBarHandler.collapseCallback(0, savedSCrollTop > 16, 0)
    }, [])
    useEffect(() => {
        if (props.show && props.isOnTop) {
            MachineBarHandler.collapseCallback(savedSCrollTop > 16, 0)
            SearchBarHandler.collapseCallback(0, savedSCrollTop > 16, 0)
        }
    }, [props.show, props.isOnTop])
    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <MachineBar containerRef={MachineBarHandler.pulseContainerRef} />
            <TowersList.Component />
            <TowerMoreMenu
                tower={pointedTower}
                onClose={() => setPointedTower(undefined)}
                shown={pointedTower !== undefined}
            />
            <SearchBar containerRef={SearchBarHandler.searchContainerRef} placeHolder={'Search Sigma Universe...'}
                onSearch={(text: string) => {
                    setSearchText(text)
                    search(text)
                }}
            />
        </div>
    )
}

export default Explore
