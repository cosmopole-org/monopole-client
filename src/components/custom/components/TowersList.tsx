import { IconButton, Paper, Typography } from "@mui/material"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import TowerCard from "./TowerCard"
import { statusbarHeight } from "../../sections/StatusBar"
import { themeColor, themeColorName } from "../../../App"
import { SigmaTab, SigmaTabs } from "../elements/SigmaTabs"
import { Add, AllInbox, AllOut, FamilyRestroom, Folder, Games, Work } from "@mui/icons-material"
import { api } from "../../.."
import SigmaFab from "../elements/SigmaFab"
import { useHookstate } from "@hookstate/core"

const darkWallpapers = [
    'https://i.pinimg.com/564x/85/38/d0/8538d0c0cc4ef43eaaccfca3060ad2db.jpg',
    'https://i.pinimg.com/564x/6f/17/b6/6f17b6acf760db99cb3a0515798937ac.jpg',
    'https://i.pinimg.com/564x/16/ea/2a/16ea2abe1d973acfdcbfe0e411fa7ed1.jpg',
    'https://i.pinimg.com/564x/6b/64/10/6b6410ec170a6447823a7c606f389dda.jpg',
    'https://i.pinimg.com/564x/c8/fb/d9/c8fbd9f8e240be49465781c734219789.jpg'
]

const lightWallpapers = [
    'https://i.pinimg.com/564x/8c/0a/f5/8c0af58e75fb51ded414e430425c04dd.jpg',
    'https://i.pinimg.com/564x/12/15/c1/1215c1d4a2d7271cf1209b703bbb3b34.jpg',
    'https://i.pinimg.com/564x/98/4a/a1/984aa1708a8304e958360c6275712a1d.jpg',
    'https://i.pinimg.com/564x/b5/70/68/b57068e5e9bfee48dc07eb73a4736f76.jpg',
    'https://i.pinimg.com/564x/ca/1b/be/ca1bbeb87e3ab7c32c7846df9cdef545.jpg'
]

const TowersList = (props: { towers: Array<any>, hasFocus: boolean, showRating: boolean, bottomSpace: number, overridenStyle: any, defaultSCrollTop?: number, onScroll: (scrollTop: number) => void, towersContainerRef: any, onCollapsibleBarStateChange: (dy: number, v: boolean, collapsibleScrollTop: number) => void, showTowerMoreMenu?: (towerId: string) => void }) => {
    const lastScrollRef = useRef(props.defaultSCrollTop !== undefined ? props.defaultSCrollTop : 0)
    const [activeTab, setActiveTab] = useState('all')
    const homeFolders = useHookstate(api.memory.homeFolders)
    let folders = [{ id: 'all', title: 'all' }, ...homeFolders.get({ noproxy: true })]
    let wallpapers = themeColorName.get({ noproxy: true }) === 'night' ? darkWallpapers : lightWallpapers
    props.towers.forEach(t => {
        if (t.wallpaper === undefined) {
            t.wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)]
        }
    });
    useLayoutEffect(() => {
        if (props.hasFocus && (props.defaultSCrollTop !== undefined)) {
            if (props.towersContainerRef.current !== null) {
                let towersContainer = props.towersContainerRef.current as HTMLElement
                towersContainer.scrollTop = props.defaultSCrollTop
            }
        }
    }, [])
    return (
        <div
            ref={props.towersContainerRef}
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
                    if (props.towersContainerRef.current !== null) {
                        let scrollTop: number = (props.towersContainerRef.current as HTMLElement).scrollTop
                        props.onScroll(scrollTop)
                        if (props.onCollapsibleBarStateChange) {
                            let dy = (scrollTop - lastScrollRef.current)
                            lastScrollRef.current = scrollTop
                            props.onCollapsibleBarStateChange(dy, scrollTop > 16, scrollTop)
                        }
                    }
                }
            }}>
            <Paper
                style={{
                    width: '100%',
                    height: 'auto',
                    minHeight: 'min(100% - 8px)',
                    borderRadius: '24px 24px 0px 0px',
                    position: 'relative',
                    backgroundColor: themeColor.get({ noproxy: true })['plain']
                }}
            >
                <Paper style={{ width: '100%', height: 'auto', borderRadius: '24px 24px 0px 0px' }}>
                    {
                        props.showRating ? null : (
                            <SigmaTabs variant={'scrollable'} centered={true} value={activeTab} onChange={(e: any, val: string) => { setActiveTab(val); }}
                                style={{
                                    width: '100%',
                                    height: 40,
                                    backgroundColor: themeColor.get({ noproxy: true })[50],
                                    borderRadius: '24px 24px 0px 0px'
                                }}
                            >
                                {
                                    folders.map((f: any) => {
                                        return (
                                            <SigmaTab
                                                value={f.id}
                                                label={f.title}
                                            />
                                        )
                                    })
                                }
                            </SigmaTabs>
                        )
                    }
                </Paper>
                <IconButton style={{ position: 'absolute', width: 48, height: 48, right: 0, top: 0, borderRadius: '4px 24px 0px 4px', backgroundColor: themeColor.get({ noproxy: true })[100] }} onClick={() => {
                    let folderName = window.prompt('enter name of folder:', 'untitled')
                    if (folderName) {
                        if (folderName.length > 0) {
                            api.services.home.create({ title: folderName })
                        } else {
                            alert('folder name can not be empty.')
                        }
                    } else {
                        alert('folder name can not be empty.')
                    }
                }}>
                    <Add />
                </IconButton>
                <div style={{ width: 'calc(100% - 32px)', height: 'auto', paddingLeft: 16, paddingRight: 16, paddingTop: 8 }}>
                    {
                        props.towers.map((tower: any) => (
                            <TowerCard tower={tower} key={`tower-card-${tower.id}`} showRating={props.showRating} style={{ marginTop: 16 }} onMoreClicked={() => {
                                props.showTowerMoreMenu && props.showTowerMoreMenu(tower)
                            }} />
                        ))
                    }
                </div>
                <div style={{ width: '100%', height: props.bottomSpace }} />
            </Paper>
        </div >
    )
}

export default TowersList
