
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Card, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SigmaRouter, headerImageAddress, themeColor } from '../../../App';
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
import Image from '../../custom/components/Image';
import IRoom from '../../../api/models/room';

const Gallery = (props: { id: string, isOnTop: boolean, room: IRoom, docId: string }) => {
    const close = useCallback(() => {
        SigmaRouter.back()
    }, [])
    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
            switchRightControl && switchRightControl(RightControlTypes.NONE)
            switchTitle && switchTitle('photo')
            switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
        }
    }, [props.isOnTop])
    return (
        <SliderPage id={props.id}>
            <div style={{ backgroundColor: themeColor.get({ noproxy: true })[100], overflowY: 'auto', position: 'relative', width: '100%', height: '100%', zIndex: 2 }}>
                <Image
                    docId={props.docId}
                    room={props.room}
                    tag={`gallery-photo-${props.docId}`}
                    key={`gallery-photo-${props.docId}`}
                    style={{
                        width: Math.min(window.innerWidth, window.innerHeight),
                        height: Math.min(window.innerWidth, window.innerHeight),
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            </div>
        </SliderPage >
    )
}

export default Gallery
