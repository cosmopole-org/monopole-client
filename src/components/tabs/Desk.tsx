import { CircularProgress, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Desktop, { columnsDict, rowHeight, sizeKey } from '../custom/components/Desktop';
import useDesk from "../hooks/useDesk";
import { api } from "../..";
import { hookstate, useHookstate } from "@hookstate/core";
import { openAppletSheet } from "../custom/components/AppletSheet";
import { allThemeColors, darkWallpapers, forceUpdate, lightWallpapers, switchSwipeable, themeColor, themeColorName, themeColorSecondary } from "../../App";
import AppHostUtils from '../custom/components/AppletHost';
import { overlaySafezoneData } from "../custom/components/Overlay";
import Earth from '../../resources/images/earth.png';

let cachedWorkers: Array<any> = []

let saveLayouts = (layouts: ReactGridLayout.Layouts) => {
    let updates: Array<any> = []
    let workersDict: { [id: string]: any } = {}
    cachedWorkers?.forEach((worker: any) => { workersDict[worker.id] = worker });
    layouts.lg.map(sampleItem => sampleItem.i).forEach(itemId => {
        let worker = workersDict[itemId]
        let anyNew = false
        Object.keys(layouts).forEach(layoutKey => {
            let item = layouts[layoutKey].filter(item => item.i === itemId)[0]
            if (
                worker && (
                    worker.secret.grid[layoutKey].x !== item.x ||
                    worker.secret.grid[layoutKey].y !== item.y ||
                    worker.secret.grid[layoutKey].w !== item.w ||
                    worker.secret.grid[layoutKey].h !== item.h
                )
            ) {
                anyNew = true
                worker.secret.grid[layoutKey].x = item.x
                worker.secret.grid[layoutKey].y = item.y
                worker.secret.grid[layoutKey].w = item.w
                worker.secret.grid[layoutKey].h = item.h
            }
        })
        if (anyNew) {
            updates.push(worker)
        }
    })
    return updates
}

let buildLayoutOfWorkers = () => {
    return {
        lg: cachedWorkers.map((w: any) => ({ ...w.secret.grid.lg, i: w.id, static: false })),
        md: cachedWorkers.map((w: any) => ({ ...w.secret.grid.md, i: w.id, static: false })),
        sm: cachedWorkers.map((w: any) => ({ ...w.secret.grid.sm, i: w.id, static: false })),
        xs: cachedWorkers.map((w: any) => ({ ...w.secret.grid.xs, i: w.id, static: false })),
        xxs: cachedWorkers.map((w: any) => ({ ...w.secret.grid.xxs, i: w.id, static: false }))
    }
}

export let desktopEditMode = hookstate(false)
const measureWidgetSize = (worker: any) => {
    let rowWorkersCount = cachedWorkers.filter(w => {
        return (
            (
                w.secret.grid[sizeKey].y >= worker.secret.grid[sizeKey].y &&
                w.secret.grid[sizeKey].y <= (worker.secret.grid[sizeKey].y + worker.secret.grid[sizeKey].h - 1)
            ) || (
                worker.secret.grid[sizeKey].y >= w.secret.grid[sizeKey].y &&
                worker.secret.grid[sizeKey].y <= (w.secret.grid[sizeKey].y + w.secret.grid[sizeKey].h - 1)
            )
        )
    }).length
    let unit = (window.innerWidth - (rowWorkersCount * 16)) / columnsDict[sizeKey]
    const widSize = {
        w: worker.secret.grid[sizeKey].w,
        width: worker.secret.grid[sizeKey].w * unit,
        h: worker.secret.grid[sizeKey].h,
        height: worker.secret.grid[sizeKey].h * rowHeight
    }
    return widSize
}

let desktop: any = undefined

export const addWidgetToSDesktop = (room: any, machineId: string) => {
    let workersMax = 0
    if (cachedWorkers.length > 0) {
        workersMax = Math.max(...cachedWorkers.map(w => w.secret.grid[sizeKey].y + w.secret.grid[sizeKey].h)) + 1
    }
    let unit = window.innerWidth / columnsDict[sizeKey] - 16
    let url = "";
    if (machineId === "5c23a6dea8c7e58ec93459e85bb64de8") {
        let str = prompt("input the url to embed:");
        if (str) {
            url = str;
        }
    }
    api.services.worker.create({
        towerId: room.towerId, roomId: room.id, machineId: machineId,
        secret: {
            grid: {
                lg: { x: 0, y: workersMax, w: 2, h: unit / 8 },
                md: { x: 0, y: workersMax, w: 2, h: unit / 8 },
                sm: { x: 0, y: workersMax, w: 2, h: unit / 8 },
                xs: { x: 0, y: workersMax, w: 2, h: unit / 8 },
                xxs: { x: 0, y: workersMax, w: 2, h: unit / 8 }
            },
            url
        }
    }).then((body: any) => {
        cachedWorkers.push(body.worker)
        api.services.worker.use({ towerId: room.towerId, roomId: room.id, workerId: body.worker.id, packet: { tag: 'get/widget', widgetSize: measureWidgetSize(body.worker), secondaryColor: themeColorSecondary.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }), colors: themeColor.get({ noproxy: true }) } })
    }).catch(ex => {
        console.log(ex)
    })
}

const Desk = (props: { show: boolean, room: any }) => {
    const desktopWrapperRef = useRef(null)
    const [loadDesktop, setLoadDesktop] = useState(false)
    const editMode = useHookstate(desktopEditMode).get({ noproxy: true })
    const metadataRef: any = useRef({})
    const headerRef = useRef(null)
    const DesktopHolder = useDesk(
        props.show,
        editMode,
        (layouts: ReactGridLayout.Layouts) => {
            saveLayouts(layouts).forEach((worker: any) => {
                api.services.worker.update({ towerId: props.room.towerId, roomId: props.room.id, worker })
                api.services.worker.use({ towerId: props.room.towerId, roomId: props.room.id, workerId: worker.id, packet: { tag: 'get/widget', widgetSize: measureWidgetSize(worker), secondaryColor: themeColorSecondary.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }), colors: themeColor.get({ noproxy: true }) } })
            })
        },
        () => buildLayoutOfWorkers()
    )
    desktop = DesktopHolder.desktop
    useEffect(() => {
        switchSwipeable(!editMode)
    }, [editMode])
    useEffect(() => {
        desktop.clear()
        AppHostUtils.unloadAllHosts()
        setTimeout(() => {
            api.services.worker.onMachinePacketDeliver('get/widget', 'get/widget', (data: any) => {
                metadataRef.current[data.workerId] = { onClick: data.onClick }
                if (!desktop.appletExists(data.workerId)) {
                    let gridData = cachedWorkers.filter(w => w.id === data.workerId)[0]?.secret?.grid
                    if (gridData) {
                        desktop.addWidget({ id: data.workerId, jsxCode: data.code, gridData: gridData[sizeKey] })
                    }
                } else {
                    desktop.updateWidget(data.workerId, data.code)
                }
            })
            api.services.worker.read({ towerId: props.room.towerId, roomId: props.room.id }).then((body: any) => {
                cachedWorkers = body.workers
                desktop.fill(buildLayoutOfWorkers())
                cachedWorkers.forEach(worker => {
                    api.services.worker.use({ towerId: props.room.towerId, roomId: props.room.id, workerId: worker.id, packet: { tag: 'get/widget', widgetSize: measureWidgetSize(worker), secondaryColor: themeColorSecondary.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }), colors: themeColor.get({ noproxy: true }) } })
                })
            })
        });
    }, [themeColorName.get({ noproxy: true })])
    useEffect(() => {
        api.services.worker.onMachinePacketDeliver('get/widget', 'get/widget', (data: any) => {
            if (!desktop.appletExists(data.workerId)) {
                let gridData = cachedWorkers.filter(w => w.id === data.workerId)[0]?.secret?.grid
                if (gridData) {
                    desktop.addWidget({ id: data.workerId, jsxCode: data.code, gridData: gridData[sizeKey] })
                }
            } else {
                desktop.updateWidget(data.workerId, data.code)
            }
        })
        api.services.worker.read({ towerId: props.room.towerId, roomId: props.room.id }).then((body: any) => {
            cachedWorkers = body.workers
            desktop.fill(buildLayoutOfWorkers())
            cachedWorkers.forEach(worker => {
                api.services.worker.use({ towerId: props.room.towerId, roomId: props.room.id, workerId: worker.id, packet: { tag: 'get/widget', widgetSize: measureWidgetSize(worker), secondaryColor: themeColorSecondary.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }), colors: themeColor.get({ noproxy: true }) } })
            })
        })
        setTimeout(() => {
            setLoadDesktop(true)
        }, 750);
        return () => {
            switchSwipeable(true)
            cachedWorkers = []
        }
    }, [])

    const tower: any = useHookstate(api.memory.spaces).get({ noproxy: true })[props.room.towerId]
    if (tower.wallpaper === undefined) {
        let wallpapers = themeColorName.get({ noproxy: true }) === 'night' ? darkWallpapers : lightWallpapers
        tower.wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)]
        tower.color = allThemeColors[Math.floor(Math.random() * allThemeColors.length)];
    }
    let wd: { [id: string]: any } = {}
    cachedWorkers.forEach(worker => wd[worker.id] = worker)
    return (
        <div
            style={{ width: '100%', height: '100%', position: 'relative' }}
        >
            <img ref={headerRef} style={{ width: '100%', position: 'absolute', left: 0, top: 0 }} src={tower.wallpaper} alt={'header'} />
            <div
                ref={desktopWrapperRef}
                style={{ width: '100%', height: '100%', position: 'relative', overflowY: 'auto' }}
            >
                <div ref={headerRef} style={{ width: '100%', height: 176 }} />
                <Paper style={{
                    backgroundColor: themeColorName.get({ noproxy: true }) === 'night' ?
                        themeColor.get({ noproxy: true })[200] :
                        themeColor.get({ noproxy: true })[200],
                    borderRadius: '24px 24px 0px 0px',
                    width: '100%', height: 'auto',
                    minHeight: '100%',
                    marginTop: 16,
                    paddingTop: 16
                }}>
                    <Paper style={{ borderRadius: '50%', width: 112, height: 112, marginLeft: 32, marginRight: 'auto', marginTop: -80, position: 'relative', zIndex: 2 }}>
                        <img style={{ margin: '5%', width: '90%', height: '90%', borderRadius: '50%' }} src={Earth} />
                    </Paper>
                    <Paper style={{ display: 'flex', paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 4, borderRadius: 20, width: 96, height: 32, marginLeft: 'auto', marginRight: 32, marginTop: -64, position: 'relative', zIndex: 2 }}>
                        {
                            [0, 1, 2].map(i => (
                                <img style={{ width: 32, height: 32, maxHeight: 32, marginLeft: i === 0 ? 0 : -16, border: `2px solid ${themeColor.get({ noproxy: true })[50]}`, borderRadius: '50%' }} src={Earth} />
                            ))
                        }
                        <Typography style={{ padding: 6, textAlign: 'center', width: 24, height: 24, maxHeight: 24, marginLeft: -16, backgroundColor: themeColor.get({ noproxy: true })[100], borderRadius: '50%' }}>
                            ...
                        </Typography>
                    </Paper>
                    <Desktop.Host
                        workersDict={wd}
                        room={props.room}
                        showDesktop={loadDesktop}
                        editMode={editMode}
                        style={{ width: window.innerWidth, marginTop: 32 }}
                        desktopKey={desktop.key}
                        onWidgetClick={(workerId: string) => {
                            let onClickOfMetadata = metadataRef.current[workerId]?.onClick
                            if (onClickOfMetadata) {
                                overlaySafezoneData.set({ code: onClickOfMetadata.code, workerId, room: props.room })
                            } else {
                                openAppletSheet(props.room, workerId)
                            }
                        }}
                        onWidgetRemove={(workerId: string) => {
                            if (window.confirm('do you to delete this widget ?')) {
                                api.services.worker.remove({ towerId: props.room.towerId, roomId: props.room.id, workerId }).then((body: any) => {
                                    cachedWorkers = cachedWorkers.filter(w => w.id !== workerId)
                                    desktop.removeWidget(workerId)
                                })
                            }
                        }}
                    />
                    {
                        loadDesktop ?
                            null : (
                                <div style={{ width: '100%', height: '100%', position: 'absolute', left: '50%', top: 'calc(50% - 32px)', transform: 'translate(-50%, -50%)' }}>
                                    <CircularProgress style={{
                                        width: 40,
                                        height: 40,
                                        position: 'absolute',
                                        left: 'calc(50% - 16px)',
                                        top: 'calc(50% - 16px)',
                                        transform: 'translate(-50%, -50%)'
                                    }} />
                                </div>
                            )
                    }
                </Paper>
            </div>
        </div>
    )
}

export default Desk
