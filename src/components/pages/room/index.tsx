
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Paper, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Dashboard, Description, Message } from '@mui/icons-material';
import Chat from '../../tabs/Chat';
import RoomControl from '../../custom/components/RoomControl';
import useDesk from '../../hooks/useDesk';
import Desk from '../../tabs/Desk';
import Files from '../../tabs/Files';
import { SigmaTab, SigmaTabs } from '../../custom/elements/SigmaTabs';

const Room = (props: { id: string, isOnTop: boolean }) => {
  const [activeTab, setActiveTab] = useState('desktop')
  const [editMode, setEditMode] = useState(false)
  const [showRoomControl, setShowRoomControl] = useState(false)
  const close = () => {
    SigmaRouter.back()
  }
  const { addWidget, desktop } = useDesk(activeTab === 'desktop', editMode);
  useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
      switchRightControl && switchRightControl(RightControlTypes.COMMANDS, () => setShowRoomControl(true))
      switchTitle && switchTitle('Sample Room')
      switchColor && switchColor(themeColor.get({noproxy: true})[300], StatusThemes.DARK)
    }
  }, [props.isOnTop])
  return (
    <SliderPage id={props.id}>
      <div style={{
        position: 'relative', width: '100%', height: '100%', zIndex: 2, transition: 'opacity .25s',
      }}>
        <img
          style={{
            borderRadius: '16px 16px 0px 0px', width: '100%', height: '100%',
            position: 'absolute', left: 0, top: 0
          }}
          src={'https://i.pinimg.com/564x/16/34/f4/1634f4abfd9b4ae437143bbb156ea130.jpg'}
          alt={'desktop-wallpaper'}
        />
        <div style={{ width: '100%', height: `calc(100% - ${statusbarHeight() + 16}px)`, paddingTop: statusbarHeight() + 16 }}>
          <Chat show={activeTab === 'chat'} />
          <Desk show={activeTab === 'desktop'} editMode={editMode} desktopKey={desktop.key} />
          <Files show={activeTab === 'files'} />
        </div>
        <Paper
          style={{
            borderRadius: 0, width: '100%', height: 'auto', paddingTop: statusbarHeight() + 16, position: 'absolute', left: 0, top: 0, backgroundColor: themeColor.get({noproxy: true})[50]
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
          addWidget()
        }}
      />
    </SliderPage >
  )
}

export default Room
