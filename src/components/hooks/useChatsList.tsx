import { useRef } from "react"
import TowersList from "../custom/components/TowersList"
import ChatsList from "../custom/components/ChatsList"

const useChatsList = (
    onCollapsibleBarStateChange: (dy: number, v: boolean, collapsibleScrollTop: number) => void,
    showTowerMoreMenu: (towerId: string) => void,
    onScroll: (scrollTop: number) => void,
    savedSCrollTop: number,
    overridenStyle: any,
    bottomSpace: number,
    showRating: boolean,
    hasFocus: boolean,
    towers: Array<any>
) => {
    const chatsContainerRef = useRef(null)
    return {
        Component: () => (
            <ChatsList
                hasFocus={hasFocus}
                showRating={showRating}
                bottomSpace={bottomSpace}
                overridenStyle={overridenStyle}
                defaultSCrollTop={savedSCrollTop}
                onScroll={onScroll}
                chatsContainerRef={chatsContainerRef}
                onCollapsibleBarStateChange={onCollapsibleBarStateChange}
                showTowerMoreMenu={showTowerMoreMenu}
                towers={towers}
            />
        ),
        chatsContainerRef
    }
}

export default useChatsList
