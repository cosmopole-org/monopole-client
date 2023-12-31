import { useRef } from "react"
import TowersList from "../custom/components/TowersList"

const useTowersList = (
    onCollapsibleBarStateChange: (dy: number, v: boolean, collapsibleScrollTop: number) => void,
    showTowerMoreMenu: (towerId: string) => void,
    onScroll: (scrollTop: number) => void,
    savedSCrollTop: number,
    overridenStyle: any,
    bottomSpace: number,
    showRating: boolean,
    hasFocus: boolean,
    towers: Array<any>,
    fullscreen: boolean,
    humans?: Array<any>
) => {
    const towersContainerRef = useRef(null)
    return {
        Component: () => (
            <TowersList
                fullscreen={fullscreen}
                hasFocus={hasFocus}
                showRating={showRating}
                bottomSpace={bottomSpace}
                overridenStyle={overridenStyle}
                defaultSCrollTop={savedSCrollTop}
                onScroll={onScroll}
                towersContainerRef={towersContainerRef}
                onCollapsibleBarStateChange={onCollapsibleBarStateChange}
                showTowerMoreMenu={showTowerMoreMenu}
                towers={towers}
                humans={humans}
            />
        ),
        towersContainerRef
    }
}

export default useTowersList
