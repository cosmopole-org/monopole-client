import { CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Desktop from '../custom/components/Desktop';
import useDesk from "../hooks/useDesk";
import { api } from "../..";
import { hookstate, useHookstate } from "@hookstate/core";
import { openAppletSheet } from "../custom/components/AppletSheet";
import { AppUtils, themeColor, themeColorName, themeColorSecondary } from "../../App";
import AppHostUtils from '../custom/components/AppletHost';

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
            console.log(worker, item, workersDict)
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

let desktop: any = undefined

export const addWidgetToSDesktop = (room: any, machineId: string) => {
    let workersMax = 0
    if (cachedWorkers.length > 0) {
        workersMax = Math.max(...cachedWorkers.map(w => w.secret.grid.xxs.y + w.secret.grid.xxs.h)) + 1
    }
    api.services.worker.create({
        towerId: room.towerId, roomId: room.id, machineId: machineId,
        secret: {
            grid: {
                lg: { x: 0, y: workersMax, w: 2, h: 6 },
                md: { x: 0, y: workersMax, w: 2, h: 6 },
                sm: { x: 0, y: workersMax, w: 2, h: 6 },
                xs: { x: 0, y: workersMax, w: 2, h: 6 },
                xxs: { x: 0, y: workersMax, w: 2, h: 6 }
            }
        }
    }).then((body: any) => {
        cachedWorkers.push(body.worker)
        api.services.worker.use({ towerId: room.towerId, roomId: room.id, workerId: body.worker.id, packet: { tag: 'get/widget', secondaryColor: themeColorSecondary.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }), colors: themeColor.get({ noproxy: true }) } })
    }).catch(ex => {
        console.log(ex)
    })
}

const Desk = (props: { show: boolean, room: any }) => {
    const desktopWrapperRef = useRef(null)
    const [loadDesktop, setLoadDesktop] = useState(false)
    const editMode = useHookstate(desktopEditMode).get({ noproxy: true })
    const DesktopHolder = useDesk(
        props.show,
        editMode,
        (layouts: ReactGridLayout.Layouts) => {
            saveLayouts(layouts).forEach((worker: any) => {
                api.services.worker.update({ towerId: props.room.towerId, roomId: props.room.id, worker })
            })
        },
        () => buildLayoutOfWorkers()
    )
    desktop = DesktopHolder.desktop
    useEffect(() => {
        desktop.clear()
        AppHostUtils.unloadAllHosts()
        setTimeout(() => {
            api.services.worker.onMachinePacketDeliver('get/widget', (data: any) => {
                if (!desktop.appletExists(data.workerId)) {
                    let gridData = cachedWorkers.filter(w => w.id === data.workerId)[0]?.secret?.grid
                    if (gridData) {
                        desktop.addWidget({ id: data.workerId, jsxCode: data.code, gridData: gridData.xxs })
                    }
                } else {
                    desktop.updateWidget(data.workerId, data.code)
                }
            })
            api.services.worker.read({ towerId: props.room.towerId, roomId: props.room.id }).then((body: any) => {
                cachedWorkers = body.workers
                desktop.fill(buildLayoutOfWorkers())
                cachedWorkers.forEach(worker => {
                    api.services.worker.use({ towerId: props.room.towerId, roomId: props.room.id, workerId: worker.id, packet: { tag: 'get/widget', secondaryColor: themeColorSecondary.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }), colors: themeColor.get({ noproxy: true }) } })
                })
            })
        });
    }, [themeColorName.get({ noproxy: true })])
    useEffect(() => {
        api.services.worker.onMachinePacketDeliver('get/widget', (data: any) => {
            if (!desktop.appletExists(data.workerId)) {
                let gridData = cachedWorkers.filter(w => w.id === data.workerId)[0]?.secret?.grid
                if (gridData) {
                    desktop.addWidget({ id: data.workerId, jsxCode: data.code, gridData: gridData.xxs })
                }
            } else {
                desktop.updateWidget(data.workerId, data.code)
            }
        })
        api.services.worker.read({ towerId: props.room.towerId, roomId: props.room.id }).then((body: any) => {
            cachedWorkers = body.workers
            desktop.fill(buildLayoutOfWorkers())
            cachedWorkers.forEach(worker => {
                api.services.worker.use({ towerId: props.room.towerId, roomId: props.room.id, workerId: worker.id, packet: { tag: 'get/widget', secondaryColor: themeColorSecondary.get({ noproxy: true }), colorName: themeColorName.get({ noproxy: true }), colors: themeColor.get({ noproxy: true }) } })
            })
        })
        setTimeout(() => {
            setLoadDesktop(true)
        }, 750);
        return () => {
            cachedWorkers = []
        }
    }, [])
    return (
        <div
            style={{ width: '100%', height: 'calc(100% - 24px)', position: 'absolute', left: props.show ? 0 : '-100%', paddingTop: 24 }}
        >
            <div
                ref={desktopWrapperRef}
                style={{ width: '100%', height: '100%', position: 'relative', overflowY: 'auto', paddingTop: 32 }}
            >
                <Desktop.Host
                    showDesktop={loadDesktop}
                    editMode={editMode}
                    style={{ width: window.innerWidth }}
                    desktopKey={desktop.key}
                    onWidgetClick={(workerId: string) => {
                        openAppletSheet(props.room, workerId)
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
            </div>
        </div>
    )
}

export default Desk
