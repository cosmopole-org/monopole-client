import { Paper, Typography } from "@mui/material"
import { useLayoutEffect, useRef, useState } from "react"
import TowerCard from "./TowerCard"
import { statusbarHeight } from "../../sections/StatusBar"
import { themeColor } from "../../../App"
import { SigmaTab, SigmaTabs } from "../elements/SigmaTabs"
import { AllInbox, AllOut, FamilyRestroom, Games, Work } from "@mui/icons-material"

const TowersList = (props: { towers: Array<any>, hasFocus: boolean, showRating: boolean, bottomSpace: number, overridenStyle: any, defaultSCrollTop?: number, onScroll: (scrollTop: number) => void, towersContainerRef: any, onCollapsibleBarStateChange: (dy: number, v: boolean, collapsibleScrollTop: number) => void, showTowerMoreMenu?: (towerId: string) => void }) => {
    const lastScrollRef = useRef(props.defaultSCrollTop !== undefined ? props.defaultSCrollTop : 0)
    const [activeTab, setActiveTab] = useState('all')
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
                    paddingTop: 8,
                    backgroundColor: themeColor.get({ noproxy: true })['plain']
                }}
            >
                {
                    props.showRating ? null : (
                        <SigmaTabs value={activeTab} onChange={(e: any, val: string) => { setActiveTab(val); }} style={{ width: '100%' }}>
                            <SigmaTab icon={<><AllInbox /><Typography variant={'body2'} style={{ marginLeft: 4 }}>All</Typography></>} value="all" />
                            <SigmaTab icon={<><FamilyRestroom /><Typography variant={'body2'} style={{ marginLeft: 4 }}>Family</Typography></>} value="family" />
                            <SigmaTab icon={<><Work /><Typography variant={'body2'} style={{ marginLeft: 4 }}>Work</Typography></>} value="work" />
                            <SigmaTab icon={<><Games /><Typography variant={'body2'} style={{ marginLeft: 4 }}>Games</Typography></>} value="games" />
                        </SigmaTabs>
                    )
                }
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
        </div>
    )
}

export default TowersList
