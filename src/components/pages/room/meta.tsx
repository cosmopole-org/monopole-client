import { Box, Drawer, Paper, Typography } from "@mui/material";
import { styled } from '@mui/material/styles'
import { themeColor } from "../../../App";
import { useEffect, useRef, useState } from "react";
import { hookstate, useHookstate } from "@hookstate/core";
import Chat from "../../tabs/Chat";
import Files from "../../tabs/Files";
import { SigmaTab, SigmaTabs } from "../../custom/elements/SigmaTabs";
import { Description, Message } from "@mui/icons-material";
import IRoom from "../../../api/models/room";
import Draggable from "react-draggable";
import { useDraggable } from '@dnd-kit/core';

const Puller = styled(Box)(({ theme }) => ({
    width: 96,
    height: 6,
    backgroundColor: themeColor.get({ noproxy: true })[200],
    borderRadius: 3,
    position: 'absolute',
    top: 16,
    left: 'calc(50%)',
    transform: 'translateX(-50%)'
}));

export let changeMetaDrawerState = (open: boolean) => {}

export default (props: { room: IRoom, onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState('chat')
    const wallpaperContainerRef = useRef(null)
    const metaRef = useRef(null)
    const top = useRef(window.innerHeight)
    const updateTop = (newVal: number) => {
        top.current = newVal
        metaRef.current && ((metaRef.current as HTMLElement).style.transform = `translateY(${top.current}px)`)
    }
    changeMetaDrawerState = (open: boolean) => {
        updateTop(open ? 112 : window.innerHeight)
    }
    let drawerContent = [
        <div style={{ borderRadius: '24px 24px 0px 0px', width: '100%', height: 80, backgroundColor: themeColor.get({ noproxy: true })[50] }}>
            <Puller />
        </div>,
        <div
            style={{
                height: '100%',
                marginTop: -40
            }}
        >
            <div style={{
                position: 'relative', width: '100%', height: '100%', zIndex: 2
            }}>
                {
                    activeTab !== 'files' ?
                        [
                            <div key={'room-background'} style={{ borderRadius: '24px 24px 0px 0px', background: 'url(https://i.pinimg.com/564x/2a/cd/6e/2acd6e46cc2bdc218a9104a69c36868e.jpg)', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} ref={wallpaperContainerRef} />,
                            <div key={'room-background-overlay'} style={{ borderRadius: '24px 24px 0px 0px', opacity: 0.65, backgroundColor: themeColor.get({ noproxy: true })[200], width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
                        ] :
                        [
                            <div key={'room-background-blank'} style={{ borderRadius: '24px 24px 0px 0px', backgroundColor: themeColor.get({ noproxy: true })[100], width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
                        ]
                }
                <div style={{ width: '100%', height: `100%` }}>
                    <Chat show={activeTab === 'chat'} room={props.room} />
                    <Files show={activeTab === 'files'} room={props.room} />
                </div>
                <Paper
                    style={{
                        width: '100%', height: 'auto', position: 'absolute', left: 0, top: 0, backgroundColor: themeColor.get({ noproxy: true })[50],
                        borderRadius: '24px 24px 0px 0px'
                    }}
                >
                    <SigmaTabs
                        onChange={(e, newValue) => {
                            setActiveTab(newValue)
                        }}
                        value={activeTab}
                        style={{ position: 'relative', zIndex: 2, backgroundColor: themeColor.get({ noproxy: true })[50] }}
                    >
                        <SigmaTab icon={<><Message /><Typography variant={'body2'} style={{ marginLeft: 4, marginTop: 2 }}>Chat</Typography></>} value={'chat'} />
                        <SigmaTab icon={<><Description /><Typography variant={'body2'} style={{ marginLeft: 4, marginTop: 2 }}>Files</Typography></>} value={'files'} />
                    </SigmaTabs>
                </Paper>
            </div>
        </div>
    ]

    const mdX = useRef(0);
    const mdY = useRef(0);
    const touchStartPosY = useRef(0)
    const touchStartPosX = useRef(0)
    const touchLastPosY = useRef(0)
    const touchLastPosX = useRef(0)
    const touchStartTop = useRef(0)
    const touchRef = useRef(null)
    const touchable = useRef(true)
    return (
        <div
            ref={metaRef}
            style={{
                transition: `transform .25s`,
                transform: `translateY(${window.innerHeight}px)`,
                borderRadius: '24px 24px 0px 0px',
                height: window.innerHeight - 150,
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                zIndex: 2
            }}
        >
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                {drawerContent}
                <div
                    ref={touchRef}
                    style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, zIndex: 2 }}
                    onTouchStart={e => {
                        touchStartTop.current = top.current;
                        touchStartPosY.current = e.touches[0].clientY;
                        touchStartPosX.current = e.touches[0].clientX;
                    }}
                    onTouchMove={e => {
                        let currentTouchPosY = e.touches[0].clientY;
                        let currentTouchPosX = e.touches[0].clientX;
                        if (
                            (
                                (touchStartPosY.current > (112 + 96)) &&
                                (document.getElementById('messagesListEl')?.scrollTop === 0) &&
                                (currentTouchPosY > touchStartPosY.current)
                            ) ||
                            (
                                touchStartPosY.current <= (112 + 96)
                            )
                        ) {
                            touchRef.current && ((touchRef.current as HTMLElement).style.pointerEvents = 'auto');
                            touchLastPosY.current = currentTouchPosY;
                            touchLastPosX.current = currentTouchPosX;
                            let resPos = touchStartTop.current + currentTouchPosY - touchStartPosY.current;
                            if (resPos < 112) resPos = 112;
                            updateTop(resPos);
                        } else {
                            touchRef.current && ((touchRef.current as HTMLElement).style.pointerEvents = 'none');
                        }
                    }}
                    onTouchEnd={e => {
                        touchable.current = true;
                        touchRef.current && ((touchRef.current as HTMLElement).style.pointerEvents = 'auto');
                        if ((Math.abs(touchLastPosY.current - touchStartPosY.current) < 16) && (Math.abs(touchLastPosX.current - touchStartPosX.current) < 16)) {
                            // do nothihg
                        } else {
                            updateTop((top.current < (window.innerHeight - 300)) ? 112 : window.innerHeight);
                            if (top.current < (window.innerHeight - 300)) {
                                // do nothing
                            } else {
                                props.onClose();
                            }
                        }
                    }}
                    onMouseDown={e => {
                        mdX.current = e.clientX;
                        mdY.current = e.clientY;
                    }}
                    onMouseUp={e => {
                        let muX = e.clientX;
                        let muY = e.clientY;
                        if ((Math.abs(muX - mdX.current) < 16) && (Math.abs(muY - mdY.current) < 16)) {
                            touchRef.current && ((touchRef.current as HTMLElement).style.pointerEvents = 'none');
                            let el = (document.elementFromPoint(mdX.current, mdY.current) as HTMLElement);
                            el?.click && el.click()
                            touchRef.current && ((touchRef.current as HTMLElement).style.pointerEvents = 'auto');
                        }
                    }}
                />
            </div>
        </div>
    )
}
