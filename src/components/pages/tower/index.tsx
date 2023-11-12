import { blue } from '@mui/material/colors';
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { SigmaRouter } from '../../../App';
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
import ITower from '../../../api/models/tower';
import IRoom from '../../../api/models/room';
import SigmaFab from '../../custom/elements/SigmaFab';
import { Add } from '@mui/icons-material';
import RoomMoreMenu from '../../custom/components/RoomMoreMenu';
import { api } from '../../..';
import { useHookstate } from '@hookstate/core';

const Tower = (props: { id: string, isOnTop: boolean, tower: any }) => {
    const [pointedRoom, setPointedRoom] = useState();
    const spaces = useHookstate(api.memory.spaces)
    const rooms = spaces.get({ noproxy: true })[props.tower.id].rooms
    console.log(rooms)
    const close = useCallback(() => {
        SigmaRouter.back()
    }, [])
    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
            switchRightControl && switchRightControl(RightControlTypes.SETTINGS)
            switchTitle && switchTitle('Sample Tower')
            switchColor && switchColor(blue[50], StatusThemes.LIGHT)
        }
    }, [props.isOnTop])
    return (
        <SliderPage id={props.id}>
            <div style={{ overflowY: 'auto', position: 'relative', width: '100%', height: '100%', background: '#fff', zIndex: 2, transition: 'opacity .25s' }}>
                <img style={{ width: '100%', height: 250 }} src={'https://i.pinimg.com/564x/f3/a8/1f/f3a81f2336f46356da3d848cf4bb32e8.jpg'} alt={'header'} />
                <Timeline
                    sx={{
                        [`& .${timelineOppositeContentClasses.root}`]: {
                            flex: 0.2,
                        },
                    }}
                >
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot variant="outlined" color="primary" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineOppositeContent color="textSecondary">
                            <Typography style={{ width: '100%', textAlign: 'left' }}>
                                Floor 1
                            </Typography>
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
                        </TimelineOppositeContent>
                    </TimelineItem>
                </Timeline>
            </div>
            <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16, borderRadius: 16 }} onClick={() => {
                SigmaRouter.navigate('createRoom', { initialData: { towerId: props.tower.id } })
            }}>
                <Add />
            </SigmaFab>
            <RoomMoreMenu
                room={pointedRoom}
                onClose={() => setPointedRoom(undefined)}
                shown={pointedRoom !== undefined}
            />
        </SliderPage>
    )
}

export default Tower
