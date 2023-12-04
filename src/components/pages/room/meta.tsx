import { Box, Drawer, Paper, Typography } from "@mui/material";
import { styled } from '@mui/material/styles'
import { themeColor } from "../../../App";
import { useEffect, useRef, useState } from "react";
import { hookstate, useHookstate } from "@hookstate/core";
import Chat from "../../tabs/Chat";
import Files from "../../tabs/Files";
import { SigmaTab, SigmaTabs } from "../../custom/elements/SigmaTabs";
import { Description, Message } from "@mui/icons-material";
import utils from "../../utils";
import IRoom from "../../../api/models/room";
import Draggable from "react-draggable";
import { showRoomShadow } from "./shadow";

export let metaOpen = hookstate(false)

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

export default (props: { room: IRoom, onClose: () => void }) => {
    const mo = useHookstate(metaOpen)
    const [activeTab, setActiveTab] = useState('chat')
    const wallpaperContainerRef = useRef(null)
    const [posY, setPosY] = useState(window.innerHeight)
    const metaRef = useRef(null)
    useEffect(() => {
        if (mo.get({ noproxy: true })) {
            setPosY(112)
        } else {
            setPosY(window.innerHeight)
        }
    }, [mo])
    let drawerContent = [
        <div className="handle" style={{ borderRadius: '24px 24px 0px 0px', width: '100%', height: 80, backgroundColor: themeColor.get({ noproxy: true })[50] }}>
            <Puller />
        </div>,
        <div
            style={{
                height: '100%',
                marginTop: -40
            }}
            className="undraggable"
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
    return (
        <Draggable axis="y" position={{ x: 0, y: posY }} cancel=".undraggable"
            onStop={(e, data) => {
                if (data.y > window.innerHeight - 300) {
                    mo.set(false)
                    props.onClose();
                }
            }}>
            <div
                ref={metaRef}
                style={{
                    transform: mo.get({ noproxy: true }) ? 'translateY(112px)' : `translateY(${window.innerHeight}px)`,
                    transition: 'transform .25s',
                    borderRadius: '24px 24px 0px 0px',
                    height: window.innerHeight - 150,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    zIndex: 2
                }}
            >
                {drawerContent}
            </div>
        </Draggable>
    )
}