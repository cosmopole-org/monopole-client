
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Paper, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Dashboard, Description, Message } from '@mui/icons-material';
import Chat from '../../tabs/Chat';
import RoomControl from '../../custom/components/RoomControl';
import useDesk from '../../hooks/useDesk';
import Desk from '../../tabs/Desk';
import Files from '../../tabs/Files';
import { SigmaTab, SigmaTabs } from '../../custom/elements/SigmaTabs';
import { api } from '../../..';
import IRoom from '../../../api/models/room';
import sampleApplet from '../../../resources/code/sampleApplet';

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

const Room = (props: { id: string, isOnTop: boolean, room: IRoom }) => {
  const [activeTab, setActiveTab] = useState('desktop')
  const [editMode, setEditMode] = useState(false)
  const [showRoomControl, setShowRoomControl] = useState(false)
  const [workers, setWorkers] = useState<Array<any>>(cachedWorkers)
  const wallpaperContainerRef = useRef(null)
  const close = () => {
    SigmaRouter.back()
  }
  const { desktop } = useDesk(
    activeTab === 'desktop',
    editMode,
    (layouts: ReactGridLayout.Layouts) => {
      saveLayouts(layouts).forEach((worker: any) => {
        api.services.worker.update({ towerId: props.room.towerId, roomId: props.room.id, worker })
      })
    },
    () => buildLayoutOfWorkers()
  )
  useEffect(() => {
    api.services.worker.read({ towerId: props.room.towerId, roomId: props.room.id }).then((body: any) => {
      cachedWorkers = body.workers
      let jsxContent: { [id: string]: string } = {}
      body.workers.forEach((worker: any) => { jsxContent[worker.id] = sampleApplet })
      desktop.fill(buildLayoutOfWorkers(), jsxContent)
    })
    return () => {
      cachedWorkers = []
    }
  }, [])
  useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
      switchRightControl && switchRightControl(RightControlTypes.COMMANDS, () => setShowRoomControl(true))
      switchTitle && switchTitle(props.room.title)
      switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
    }
  }, [props.isOnTop])
  return (
    <SliderPage id={props.id}>
      <div style={{
        position: 'relative', width: '100%', height: '100%', zIndex: 2, transition: 'opacity .25s',
      }}>
        {
          activeTab !== 'files' ?
            [
              <div key={'room-background'} style={{ background: 'url(https://i.pinimg.com/564x/2a/cd/6e/2acd6e46cc2bdc218a9104a69c36868e.jpg)', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} ref={wallpaperContainerRef} />,
              <div key={'room-background-overlay'} style={{ opacity: 0.65, backgroundColor: themeColor.get({ noproxy: true })[200], width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
            ] :
            [
              <div key={'room-background-blank'} style={{ backgroundColor: '#fff', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
            ]
        }
        <div style={{ width: '100%', height: `calc(100% - ${statusbarHeight() + 16}px)`, paddingTop: statusbarHeight() + 16 }}>
          <Chat show={activeTab === 'chat'} />
          <Desk show={activeTab === 'desktop'} editMode={editMode} desktopKey={desktop.key} workers={workers} />
          <Files show={activeTab === 'files'} />
        </div>
        <Paper
          style={{
            borderRadius: 0, width: '100%', height: 'auto', paddingTop: statusbarHeight() + 16, position: 'absolute', left: 0, top: 0, backgroundColor: themeColor.get({ noproxy: true })[50]
          }}
        >
          <SigmaTabs
            onChange={(e, newValue) => {
              setActiveTab(newValue)
            }}
            value={activeTab}
          >
            <SigmaTab icon={<><Dashboard /><Typography variant={'body2'} style={{ marginLeft: 4, marginTop: 2 }}>Desktop</Typography></>} value={'desktop'} />
            <SigmaTab icon={<><Message /><Typography variant={'body2'} style={{ marginLeft: 4, marginTop: 2 }}>Chat</Typography></>} value={'chat'} />
            <SigmaTab icon={<><Description /><Typography variant={'body2'} style={{ marginLeft: 4, marginTop: 2 }}>Files</Typography></>} value={'files'} />
          </SigmaTabs>
        </Paper>
      </div>
      <RoomControl
        onClose={() => setShowRoomControl(false)}
        shown={showRoomControl}
        toggleEditMode={(v) => setEditMode(v)}
        openToolbox={() => {
          const sampleMachineId = Object.keys(api.memory.known.machines.get({ noproxy: true }))[0]
          let workersMax = 0
          if (cachedWorkers.length > 0) {
            workersMax = Math.max(...cachedWorkers.map(w => w.secret.grid.xxs.y + w.secret.grid.xxs.h)) + 1
           }
          api.services.worker.create({
            towerId: props.room.towerId, roomId: props.room.id, machineId: sampleMachineId,
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
            desktop.addWidget({ id: body.worker.id, jsxCode: sampleApplet, gridData: body.worker.secret.grid.xxs })
          }).catch(ex => {
            console.log(ex)
          })
        }}
      />
    </SliderPage>
  )
}

export default Room
