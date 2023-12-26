import { useCallback, useEffect, useRef, useState } from "react"
import useSearchBar from "../hooks/useSearchBar."
import { statusbarHeight } from "../sections/StatusBar"
import SearchBar from "../custom/components/SearchBar"
import { api } from "../.."
import FriendBar from "../sections/FriendBar"
import { useHookstate } from "@hookstate/core"
import useChatsList from "../hooks/useChatsList"
import useFriends from "../hooks/useFriends"

let savedSCrollTop = 0,
    cachedSearchBarTop: { value: number, maxValue: number } = {
        value: 24 + statusbarHeight(),
        maxValue: 24 + statusbarHeight()
    }

const Chats = (props: { isOnTop: boolean, show: boolean }) => {
    const [, setPointedTower] = useState()
    const containerRef = useRef(null)
    const [searchText, setSearchText] = useState('')
    const FriendsBarHandler = useFriends()
    const SearchBarHandler = useSearchBar(cachedSearchBarTop)
    const allHumans = useHookstate(api.memory.humans).get({ noproxy: true })
    const allChats = useHookstate(api.memory.chats).get({ noproxy: true })
    const search = useCallback((text: string) => {
        setSearchText(text)
    }, [searchText])
    const humans = Object.values(allHumans).filter(h => (h.firstName + ' ' + h.lastName).includes(searchText))
    const chats = Object.values(allChats).filter((c: any) => c.tower.title.includes(searchText))
    let ChatsList = useChatsList(
        (dy: number, v: boolean, collapsibleScrollTop: number) => {
            FriendsBarHandler.collapseCallback(v, collapsibleScrollTop)
            SearchBarHandler.collapseCallback(dy, v, collapsibleScrollTop)
        },
        (tower: any) => setPointedTower(tower),
        (scrollTop: number) => {
            if (props.show) {
                savedSCrollTop = scrollTop
            }
        },
        savedSCrollTop,
        {
            paddingTop: 208 + 28 + statusbarHeight()
        },
        184 + 28,
        true,
        props.show,
        chats
    )
    useEffect(() => {
        FriendsBarHandler.collapseCallback(savedSCrollTop > 16, 0)
        SearchBarHandler.collapseCallback(0, savedSCrollTop > 16, 0)
    }, [])
    useEffect(() => {
        if (props.show && props.isOnTop) {
            FriendsBarHandler.collapseCallback(savedSCrollTop > 16, 0)
            SearchBarHandler.collapseCallback(0, savedSCrollTop > 16, 0)
        }
    }, [props.show, props.isOnTop])
    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <FriendBar humans={humans} containerRef={FriendsBarHandler.friendsContainerRef} />
            <ChatsList.Component />
            <SearchBar containerRef={SearchBarHandler.searchContainerRef} placeHolder={'Search Sigma Universe...'}
                onSearch={(text: string) => {
                    setSearchText(text)
                    search(text)
                }}
            />
        </div>
    )
}

export default Chats
