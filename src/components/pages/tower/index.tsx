
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Card, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import TowerRoom from '../../custom/components/TowerRoom';
import SigmaFab from '../../custom/elements/SigmaFab';
import { Add, People } from '@mui/icons-material';
import RoomMoreMenu from '../../custom/components/RoomMoreMenu';
import { api } from '../../..';
import { useHookstate } from '@hookstate/core';
import HumanBox from '../../custom/components/HumanBox';
import ITower from '../../../api/models/tower';

const Tower = (props: { id: string, isOnTop: boolean, tower: ITower }) => {
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const [showMembers, setShowMembers] = useState(false);
    const [pointedRoom, setPointedRoom] = useState();
    const spaces = useHookstate(api.memory.known.spaces).get({ noproxy: true })
    const mySpaces = useHookstate(api.memory.spaces).get({ noproxy: true })
    let tower = spaces[props.tower.id]
    if (!tower) {
        api.services.tower.readById({ towerId: props.tower.id })
    }
    const rooms = tower ? tower.rooms : []
    const close = useCallback(() => {
        SigmaRouter.back()
    }, [])
    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
            switchRightControl && switchRightControl(RightControlTypes.SETTINGS)
            switchTitle && switchTitle(props.tower.title)
            switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
        }
    }, [props.isOnTop])
    return (
        <SliderPage id={props.id}>
            <div ref={containerRef} style={{ backgroundColor: '#fff', overflowY: 'auto', position: 'relative', width: '100%', height: '100%', zIndex: 2 }}
                onScroll={() => {
                    if (containerRef.current !== null) {
                        let container = containerRef.current as HTMLElement
                        let scrollTop = container.scrollTop
                        if (headerRef.current !== null) {
                            if (scrollTop > 64) {
                                (headerRef.current as HTMLElement).style.opacity = '0'
                            } else {
                                (headerRef.current as HTMLElement).style.opacity = '1'
                            }
                        }
                    }
                }}>
                <img ref={headerRef} style={{ opacity: 1, width: '100%', height: 266, position: 'sticky', top: 0, transition: 'opacity .5s' }} src={(props.tower as any).wallpaper} alt={'header'} />
                <Timeline
                    style={{
                        minHeight: 'calc(100% - 248px)', width: 'calc(100% - 32px)', background: themeColor.get({ noproxy: true })[50],
                        position: 'absolute', left: 0, top: 216, borderRadius: `24px 24px 0px 0px`
                    }}
                    sx={{
                        [`& .${timelineOppositeContentClasses.root}`]: {
                            flex: 0.2,
                        },
                    }}
                >
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot variant="outlined" color="primary" />
                            <TimelineConnector style={{ height: '100%' }} />
                        </TimelineSeparator>
                        <TimelineOppositeContent color="textSecondary" style={{ minWidth: 'calc(100% - 32px)' }}>
                            <Typography style={{ width: '100%', textAlign: 'left' }}>
                                Floor 1
                            </Typography>
                            <Card elevation={0} style={{ padding: 16, marginTop: 16, borderRadius: 24, backgroundColor: themeColor.get({ noproxy: true })['plain'] }}>
                                {
                                    Object.values(rooms).map((room: any) => {
                                        return (
                                            <TowerRoom
                                                openMenu={(roomId: string) => {
                                                    setPointedRoom(room)
                                                }}
                                                room={room}
                                                key={`tower-room-item-${room.id}`}
                                                onClick={() => SigmaRouter.navigate('room', { initialData: { room } })}
                                            />
                                        )
                                    })
                                }
                            </Card>
                        </TimelineOppositeContent>
                    </TimelineItem>
                </Timeline>
            </div>
            <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16, borderRadius: 16 }} onClick={() => {
                SigmaRouter.navigate('createRoom', { initialData: { towerId: props.tower.id } })
            }}>
                <Add />
            </SigmaFab>
            <SigmaFab size={'medium'} style={{ position: 'absolute', right: 16 + 4, bottom: 16 + 56 + 16, borderRadius: 16 }} onClick={() => {
                setShowMembers(true)
            }}>
                <People />
            </SigmaFab>
            {
                tower && mySpaces[tower.id] ?
                    null : (
                        <SigmaFab variant={'extended'} size={'medium'} style={{ position: 'absolute', right: 16 + 56 + 16, bottom: 16 + 4, borderRadius: 16 }} onClick={() => {
                            api.services.tower.join({ towerId: props.tower.id })
                        }}>
                            <People style={{ marginRight: 8 }} />
                            Join
                        </SigmaFab>
                    )
            }
            <RoomMoreMenu
                room={pointedRoom}
                onClose={() => setPointedRoom(undefined)}
                shown={pointedRoom !== undefined}
            />
            <HumanBox
                tower={props.tower}
                onClose={() => setShowMembers(false)}
                shown={showMembers}
                onMemberView={(human: any) => {
                    setShowMembers(false)
                    SigmaRouter.navigate('profile', { initialData: { human } });
                }}
            />
        </SliderPage >
    )
}

export default Tower
