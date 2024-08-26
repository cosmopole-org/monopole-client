import { hookstate, useHookstate } from "@hookstate/core";
import { Card, SwipeableDrawer, Typography } from "@mui/material"
import { allThemeColors, darkWallpapers, lightWallpapers, themeColor, themeColorName } from "../../App";
import { getUsers } from "../../resources/json/users";
import SigmaAvatar from "../custom/elements/SigmaAvatar";
import ITower from "../../api/models/tower";
import { api } from "../..";
import IRoom from "../../api/models/room";
import { randEmoji } from "../../resources/json/emojis";
import { currentRoom, setOsCurrentRoom } from "../pages/main";
import { useEffect, useState } from "react";

export const roomDrawerOpen = hookstate(false);

const RoomDrawer = (props: Readonly<{ room: any }>) => {
    const towers: { [id: string]: ITower } = useHookstate(api.memory.spaces).get({ noproxy: true });
    const [selectedTowerId, setSelectedTowerId] = useState<string | undefined>(undefined);
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
    const open = useHookstate(roomDrawerOpen).get({ noproxy: true });
    return (
        <SwipeableDrawer
            open={open}
            onOpen={() => roomDrawerOpen.set(true)}
            onClose={() => roomDrawerOpen.set(false)}>
            <div style={{
                width: 320,
                height: '100%',
                backgroundColor: themeColor.get({ noproxy: true })[400],
                display: 'flex'
            }}>
                <Card style={{ width: 84, height: '100%', paddingLeft: 8, overflowY: 'auto', borderRadius: 0 }}>
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
                </Card>
                <div style={{ width: '100%', height: '100%' }}>
                    <div style={{ overflowY: 'auto', width: '100%', height: '100%' }}>
                        <Card style={{ position: 'relative', borderRadius: 16, marginTop: 12, height: 176, width: 'calc(100% - 24px)', marginLeft: 12 }}>
                            <img
                                style={{ width: '100%', height: '100%', borderRadius: 16 }}
                                src={(tower as any).wallpaper} />
                            <div style={{ padding: 8, backgroundColor: 'rgba(0, 0, 0, 0.35)', width: 'calc(100%-16px)', position: 'absolute', left: 8, bottom: 8, borderRadius: 12, textAlign: 'center' }}>
                                <Typography>{tower.title}</Typography>
                            </div>
                        </Card>
                        <div
                            style={{ height: 'calc(100% - 40px)', position: 'relative', overflow: 'scroll', paddingLeft: 16, paddingRight: 16 }}
                        >
                            {Object.values(tower.rooms).map(item => (
                                <div
                                    onClick={() => {
                                        roomDrawerOpen.set(false);
                                        setTimeout(() => {
                                            setOsCurrentRoom(item);                                           
                                        }, 250);
                                    }}
                                    style={{ marginTop: 16, backgroundColor: 'transparent' }}
                                    key={item.id}
                                >
                                    <div style={{ display: 'flex', width: '100%' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography style={{ textAlign: 'left' }} variant="body1">{randEmoji()} {item.title}</Typography>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SwipeableDrawer>
    )
}

export default RoomDrawer
