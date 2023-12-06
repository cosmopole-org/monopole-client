import { styled } from "@mui/material/styles";
import { themeColor } from "../../../App"
import { Box, Paper, Typography } from "@mui/material";
import { useRef } from "react";
import Chat from "../../tabs/Chat";
import Files from "../../tabs/Files";
import IRoom from "../../../api/models/room";
import { SigmaTab, SigmaTabs } from "../../custom/elements/SigmaTabs";
import { Description, Message } from "@mui/icons-material";
import { hookstate, useHookstate } from "@hookstate/core";

export const metaActiveTab = hookstate('chat')

export default (props: { room: IRoom }) => {
    const wallpaperContainerRef = useRef(null);
    const activeTab = useHookstate(metaActiveTab);
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
    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <div style={{ borderRadius: '24px 24px 0px 0px', width: '100%', height: 80, backgroundColor: themeColor.get({ noproxy: true })[50] }}>
                <Puller />
            </div>,
            <div
                style={{
                    height: 'calc(100% - 48px)',
                    marginTop: -56
                }}
            >
                <div style={{
                    position: 'relative', width: '100%', height: '100%', zIndex: 2
                }}>
                    {
                        activeTab.get({ noproxy: true }) !== 'files' ?
                            [
                                <div key={'room-background'} style={{ borderRadius: '24px 24px 0px 0px', background: 'url(https://i.pinimg.com/564x/2a/cd/6e/2acd6e46cc2bdc218a9104a69c36868e.jpg)', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} ref={wallpaperContainerRef} />,
                                <div key={'room-background-overlay'} style={{ borderRadius: '24px 24px 0px 0px', opacity: 0.65, backgroundColor: themeColor.get({ noproxy: true })[200], width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
                            ] :
                            [
                                <div key={'room-background-blank'} style={{ borderRadius: '24px 24px 0px 0px', backgroundColor: themeColor.get({ noproxy: true })[100], width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
                            ]
                    }
                    <div style={{ width: '100%', height: `100%` }}>
                        <Chat show={activeTab.get({ noproxy: true }) === 'chat'} room={props.room} />
                        <Files show={activeTab.get({ noproxy: true }) === 'files'} room={props.room} />
                    </div>
                    <Paper
                        style={{
                            width: '100%', height: 'auto', position: 'absolute', left: 0, top: 0, backgroundColor: themeColor.get({ noproxy: true })[50],
                            borderRadius: '24px 24px 0px 0px'
                        }}
                    >
                        <SigmaTabs
                            onChange={(e, newValue) => {
                                activeTab.set(newValue)
                            }}
                            value={activeTab.get({ noproxy: true })}
                            style={{ position: 'relative', zIndex: 2, backgroundColor: themeColor.get({ noproxy: true })[50] }}
                        >
                            <SigmaTab icon={<><Message /><Typography variant={'body2'} style={{ marginLeft: 4, marginTop: 2 }}>Chat</Typography></>} value={'chat'} />
                            <SigmaTab icon={<><Description /><Typography variant={'body2'} style={{ marginLeft: 4, marginTop: 2 }}>Files</Typography></>} value={'files'} />
                        </SigmaTabs>
                    </Paper>
                </div>
            </div>
        </div>
    )
}
