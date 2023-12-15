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
    chats: Array<any>
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
                chats={chats}
            />
        ),
        chatsContainerRef
    }
}

export default useChatsList
