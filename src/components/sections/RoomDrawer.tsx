import { hookstate, useHookstate } from "@hookstate/core";
import { Card, Container, IconButton, SwipeableDrawer, Typography } from "@mui/material"
import { allThemeColors, darkWallpapers, lightWallpapers, SigmaRouter, themeColor, themeColorName } from "../../App";
import { getUsers } from "../../resources/json/users";
import SigmaAvatar from "../custom/elements/SigmaAvatar";
import ITower from "../../api/models/tower";
import { api } from "../..";
import IRoom from "../../api/models/room";
import { randEmoji } from "../../resources/json/emojis";
import { currentRoom, setOsCurrentRoom } from "../pages/main";
import { useEffect, useState } from "react";
import HumanBox from "../custom/components/HumanBox";
import RoomMoreMenu from "../custom/components/RoomMoreMenu";
import SigmaFab from "../custom/elements/SigmaFab";
import { Add, MoreHoriz, People } from "@mui/icons-material";

export const roomDrawerOpen = hookstate(false);

let memorizedRoomDrawerstate = false;

export const checkForRoomDrawerRecovery = () => {
    if (memorizedRoomDrawerstate) {
        memorizedRoomDrawerstate = false;
        roomDrawerOpen.set(true);
    }
}

const tryMoveoutMenu = (p?: boolean) => {
    if (p) {
        memorizedRoomDrawerstate = true;
    } else {
        memorizedRoomDrawerstate = false;
    }
    roomDrawerOpen.set(false);
}

const RoomDrawer = (props: Readonly<{ room: any, container: any }>) => {
    const towers: { [id: string]: ITower } = useHookstate(api.memory.spaces).get({ noproxy: true });
    const [selectedTowerId, setSelectedTowerId] = useState<string | undefined>(undefined);
    const [showMembers, setShowMembers] = useState(false);
    const [pointedRoom, setPointedRoom] = useState<IRoom | undefined>(undefined);
    const mySpaces = useHookstate(api.memory.spaces).get({ noproxy: true })
    const open = useHookstate(roomDrawerOpen).get({ noproxy: true });
    useEffect(() => {
        if (!selectedTowerId) {
            setSelectedTowerId(props.room.towerId);
        }
        let wallpapers = themeColorName.get({ noproxy: true }) === 'night' ? darkWallpapers : lightWallpapers
        Object.values(towers).forEach(rt => {
            let t = (rt as any)
            if (t.wallpaper === undefined) {
                t.wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)]
                t.color = allThemeColors[Math.floor(Math.random() * allThemeColors.length)];
            }
        });
    }, []);
    const tower = towers[selectedTowerId ?? props.room.towerId];
    return (
        <>
            <SwipeableDrawer
                container={props.container}
                open={open}
                onOpen={() => roomDrawerOpen.set(true)}
                onClose={() => roomDrawerOpen.set(false)}
                PaperProps={{
                    style: {
                        background: 'transparent'
                    },
                    elevation: 0
                }}>
                <div style={{
                    width: (window.innerWidth * 8 / 10) + 'px',
                    height: (window.innerHeight * 7 / 10) + 'px',
                    marginLeft: (window.innerWidth / 10) + 'px',
                    marginTop: (window.innerHeight * 1.5 / 10) + 'px',
                    borderRadius: 24,
                    display: 'flex',
                    overflow: 'hidden',
                    backgroundColor: themeColor.get({ noproxy: true })[50],
                    position: 'relative'
                }}>
                    <div style={{ marginTop: 8, marginLeft: 8, backgroundColor: themeColor.get({ noproxy: true })[200], width: 84, height: 'calc(100% - 16px)', paddingLeft: 8, overflowY: 'auto', borderRadius: 24 }}>
                        {
                            Object.values(towers).map((item: any) => (
                                <div
                                    onClick={() => {
                                        setSelectedTowerId(item.id);
                                    }}
                                    key={item.id}
                                    style={{ width: 56, height: 56, marginTop: 16, marginLeft: 0, borderRadius: '50%' }}>
                                    <SigmaAvatar
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <img style={{ width: '100%', height: '100%' }} src={(item as any).wallpaper} alt={item.id.toString()} />
                                    </SigmaAvatar>
                                </div>
                            ))
                        }
                    </div>
                    <div style={{ width: '100%', height: '100%' }}>
                        <div style={{ overflowY: 'auto', width: '100%', height: '100%' }}>
                            <Card style={{ position: 'relative', borderRadius: 16, marginTop: 12, height: 176, width: 'calc(100% - 24px)', marginLeft: 12 }}>
                                <img
                                    style={{ width: '100%', height: '100%', borderRadius: 16 }}
                                    src={(tower as any).wallpaper} />
                                <div style={{ padding: 8, backgroundColor: 'rgba(0, 0, 0, 0.35)', width: 'calc(100%-16px)', position: 'absolute', left: 8, bottom: 8, borderRadius: 12, textAlign: 'center' }}>
                                    <Typography style={{ color: '#fff' }}>{tower.title}</Typography>
                                </div>
                            </Card>
                            <div
                                style={{ height: 'calc(100% - 40px)', position: 'relative', overflow: 'scroll', paddingLeft: 16, paddingRight: 16 }}
                            >
                                {Object.values(tower.rooms).map(item => (
                                    <div
                                        onClick={() => {
                                            tryMoveoutMenu();
                                            setTimeout(() => {
                                                setOsCurrentRoom(item);
                                            }, 250);
                                        }}
                                        style={{ marginTop: 16, backgroundColor: 'transparent' }}
                                        key={item.id}
                                    >
                                        <div style={{ display: 'flex', width: '100%' }}>
                                            <div style={{ display: 'flex', width: '100%' }}>
                                                <Typography style={{ textAlign: 'left', width: 'calc(100% - 32px)' }} variant="body1">{randEmoji()} {item.title}</Typography>
                                                <IconButton style={{ width: 32, height: 32, marginTop: -4 }} onClick={e => {
                                                    e.stopPropagation();
                                                    setPointedRoom(item)
                                                }}>
                                                    <MoreHoriz />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16, borderRadius: 16 }} onClick={() => {
                        tryMoveoutMenu(true);
                        SigmaRouter.navigate('createRoom', { initialData: { towerId: tower.id } })
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
                                    api.services.tower.join({ towerId: tower.id })
                                }}>
                                    <People style={{ marginRight: 8 }} />
                                    Join
                                </SigmaFab>
                            )
                    }
                </div>
            </SwipeableDrawer>
            <RoomMoreMenu
                onOpeningNewPage={() => tryMoveoutMenu(true)}
                room={pointedRoom}
                onClose={() => setPointedRoom(undefined)}
                shown={pointedRoom !== undefined}
            />,
            <HumanBox
                tower={tower}
                onClose={() => setShowMembers(false)}
                shown={showMembers}
                onMemberView={(human: any) => {
                    setShowMembers(false)
                    tryMoveoutMenu(true);
                    SigmaRouter.navigate('profile', { initialData: { human } });
                }}
            />
        </>
    );
}

export default RoomDrawer
