import { IconButton, List, ListItemButton, Paper, Typography } from "@mui/material"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import TowerCard from "./TowerCard"
import { statusbarHeight } from "../../sections/StatusBar"
import { SigmaRouter, themeColor, themeColorName } from "../../../App"
import { SigmaTab, SigmaTabs } from "../elements/SigmaTabs"
import { Add, AllInbox, AllOut, Edit, FamilyRestroom, Folder, Games, Work } from "@mui/icons-material"
import { api } from "../../.."
import SigmaFab from "../elements/SigmaFab"
import { useHookstate } from "@hookstate/core"
import ChatItem from "./ChatItem"

const ChatsList = (props: { chats: any, hasFocus: boolean, showRating: boolean, bottomSpace: number, overridenStyle: any, defaultSCrollTop?: number, onScroll: (scrollTop: number) => void, chatsContainerRef: any, onCollapsibleBarStateChange: (dy: number, v: boolean, collapsibleScrollTop: number) => void, showTowerMoreMenu?: (towerId: string) => void }) => {
    const lastScrollRef = useRef(props.defaultSCrollTop !== undefined ? props.defaultSCrollTop : 0)
    useLayoutEffect(() => {
        if (props.hasFocus && (props.defaultSCrollTop !== undefined)) {
            if (props.chatsContainerRef.current !== null) {
                let towersContainer = props.chatsContainerRef.current as HTMLElement
                towersContainer.scrollTop = props.defaultSCrollTop
            }
        }
    }, [])
    return (
        <div
            ref={props.chatsContainerRef}
            style={{
                ...props.overridenStyle,
                width: '100%', height: `calc(100% - ${162 + statusbarHeight()}px)`,
                position: 'absolute',
                left: 0,
                top: 0,
                overflowY: 'auto'
            }}
            onScroll={() => {
                if (props.hasFocus) {
                    if (props.chatsContainerRef.current !== null) {
                        let scrollTop: number = (props.chatsContainerRef.current as HTMLElement).scrollTop
                        props.onScroll(scrollTop)
                        if (props.onCollapsibleBarStateChange) {
                            let dy = (scrollTop - lastScrollRef.current)
                            lastScrollRef.current = scrollTop
                            props.onCollapsibleBarStateChange(dy, scrollTop > 16, scrollTop)
                        }
                    }
                }
            }}>
            <div
                style={{
                    width: '100%',
                    height: 'auto',
                    minHeight: 'min(100% - 8px)',
                    position: 'relative',
                }}
            >
                {
                    props.showRating ? null : (
                        <SigmaFab style={{ position: 'absolute', width: 40, height: 40, right: 4, top: 4, borderRadius: '8px 24px 8px 8px', backgroundColor: themeColor.get({ noproxy: true })[100] }} onClick={() => {
                            SigmaRouter.navigate('manageHomeFolders')
                        }}>
                            <Edit />
                        </SigmaFab>
                    )
                }
                <List style={{ width: 'calc(100% - 32px)', height: 'auto', paddingLeft: 16, paddingRight: 16, paddingTop: 0 }}>
                    {
                        props.chats.map((chat: any) => (
                            <ListItemButton style={{padding: 0}}>
                                <ChatItem chat={chat} key={`tower-card-${chat.id}`} style={{ marginTop: 8 }} onMoreClicked={() => {
                                    props.showTowerMoreMenu && props.showTowerMoreMenu(chat)
                                }} />
                            </ListItemButton>
                        ))
                    }
                </List>
                <div style={{ width: '100%', height: props.bottomSpace }} />
            </div>
        </div >
    )
}

export default ChatsList
