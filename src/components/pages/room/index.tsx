
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Paper, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Dashboard, Description, Message } from '@mui/icons-material';
import Chat from '../../tabs/Chat';
import RoomControl from '../../custom/components/RoomControl';
import Desk, { addWidgetToSDesktop, desktopEditMode } from '../../tabs/Desk';
import Files from '../../tabs/Files';
import { SigmaTab, SigmaTabs } from '../../custom/elements/SigmaTabs';
import { api } from '../../..';
import IRoom from '../../../api/models/room';

const Room = (props: { id: string, isOnTop: boolean, room: IRoom }) => {
  const [activeTab, setActiveTab] = useState('desktop')
  const [showRoomControl, setShowRoomControl] = useState(false)
  const wallpaperContainerRef = useRef(null)
  const close = () => {
    SigmaRouter.back()
  }
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
          <Desk show={activeTab === 'desktop'} room={props.room} />
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
        toggleEditMode={(v) => desktopEditMode.set(v)}
        openToolbox={() => {
          addWidgetToSDesktop(props.room)
        }}
      />
    </SliderPage>
  )
}

export default Room
