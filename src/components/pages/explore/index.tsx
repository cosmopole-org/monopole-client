import { useCallback, useEffect, useRef, useState } from "react"
import useSearchBar from "../../hooks/useSearchBar."
import useMachines from "../../hooks/useMachines"
import useTowersList from "../../hooks/useTowersList"
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from "../../sections/StatusBar"
import SearchBar from "../../custom/components/SearchBar"
import MachineBar from "../../sections/MachineBar"
import { api } from "../../.."
import ITower from "../../../api/models/tower"
import TowerMoreMenu from "../../custom/components/TowerMoreMenu"
import IMachine from "../../../api/models/machine"
import SliderPage from "../../layouts/SliderPage"
import { SigmaRouter, themeColor } from "../../../App"

let savedSCrollTop = 0,
    cachedSearchBarTop: { value: number, maxValue: number } = {
        value: 24 + statusbarHeight(),
        maxValue: 24 + statusbarHeight()
    },
    cachedTowers: Array<ITower> = [],
    cachedMachines: Array<IMachine> = []

const Explore = (props: { isOnTop: boolean, id: string }) => {
    const [pointedTower, setPointedTower] = useState()
    const containerRef = useRef(null)
    const [searchText, setSearchText] = useState('')
    const [towers, setTowers] = useState(cachedTowers)
    const [machines, setMachines] = useState(cachedMachines)
    const close = () => {
        SigmaRouter.back()
    }
    const search = useCallback((text: string) => {
        Promise.all([
            api.services.tower.search({ query: text }),
            api.services.machine.search({ query: text })
        ])
            .then(([body, body2]) => {
                cachedTowers = body.towers
                cachedMachines = body2.machines
                setTowers(body.towers)
                setMachines(body2.machines)
            }).catch(ex => console.log(ex))
    }, [searchText, setTowers, setMachines])
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
            savedSCrollTop = scrollTop
        },
        savedSCrollTop,
        {
            paddingTop: 252 + 28 + statusbarHeight()
        },
        184 + 28,
        true,
        true,
        towers
    )
    let MachineBarHandler = useMachines()
    let SearchBarHandler = useSearchBar(cachedSearchBarTop)
    useEffect(() => {
        MachineBarHandler.collapseCallback(savedSCrollTop > 16, 0)
        SearchBarHandler.collapseCallback(0, savedSCrollTop > 16, 0)
    }, [])
    useEffect(() => {
        if (props.isOnTop) {
            MachineBarHandler.collapseCallback(savedSCrollTop > 16, 0)
            SearchBarHandler.collapseCallback(0, savedSCrollTop > 16, 0)
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
            switchRightControl && switchRightControl(RightControlTypes.NONE)
            switchTitle && switchTitle('Explore')
        }
    }, [props.isOnTop])
    return (
        <SliderPage id={props.id}>
            <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: themeColor.get({ noproxy: true })[50] }}>
                <MachineBar machines={machines} containerRef={MachineBarHandler.pulseContainerRef} />
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
        </SliderPage>
    )
}

export default Explore