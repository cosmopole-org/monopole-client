
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Box, CssBaseline, Drawer, Paper, Skeleton, SwipeableDrawer, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { SigmaRouter, themeBasedTextColor, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Dashboard, Description, History, Message, Rocket } from '@mui/icons-material';
import Chat from '../../tabs/Chat';
import RoomControl from '../../custom/components/RoomControl';
import Desk, { addWidgetToSDesktop, desktopEditMode } from '../../tabs/Desk';
import Files from '../../tabs/Files';
import { SigmaTab, SigmaTabs } from '../../custom/elements/SigmaTabs';
import IRoom from '../../../api/models/room';
import MachineBox from '../../custom/components/MachineBox';
import { grey } from '@mui/material/colors';
import { Global } from '@emotion/react';
import SigmaFab from '../../custom/elements/SigmaFab';
import utils from '../../utils';
import { AppletSheet } from '../../custom/components/AppletSheet';

const drawerBleeding = 72;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const Room = (props: { id: string, isOnTop: boolean, room: IRoom }) => {
  const [activeTab, setActiveTab] = useState('chat')
  const [showRoomControl, setShowRoomControl] = useState(false)
  const [showMachineBox, setShowMachineBox] = useState(false)
  const wallpaperContainerRef = useRef(null)
  const [metaOpen, setMetaOpen] = useState(false);
  const containerRef = useRef(null)
  const close = () => {
    SigmaRouter.back()
  }
  useEffect(() => {
    return () => {
      desktopEditMode.set(false)
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
  useEffect(() => {
    if (metaOpen) {
      switchLeftControl && switchLeftControl(LeftControlTypes.CLOSE, () => setMetaOpen(false))
      switchRightControl && switchRightControl(RightControlTypes.COMMANDS, () => setShowRoomControl(true))
      switchTitle && switchTitle(props.room.title)
      switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
    } else {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
      switchRightControl && switchRightControl(RightControlTypes.COMMANDS, () => setShowRoomControl(true))
      switchTitle && switchTitle(props.room.title)
      switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
    }
  }, [metaOpen])
  let drawerContent = [
    <div
      style={{
        position: 'absolute',
        top: -drawerBleeding,
        borderRadius: '24px 24px 0px 0px',
        visibility: 'visible',
        right: 0,
        left: 0
      }}
    >
      <SigmaFab style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} onClick={() => setMetaOpen(true)}>
        <Rocket />
      </SigmaFab>
      <div style={{ height: drawerBleeding }} />
    </div>,
    <div
      style={{
        height: '100%'
      }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%', zIndex: 2, transition: 'opacity .25s'
      }}>
        {
          activeTab !== 'files' ?
            [
              <div key={'room-background'} style={{ borderRadius: '24px 24px 0px 0px', background: 'url(https://i.pinimg.com/564x/2a/cd/6e/2acd6e46cc2bdc218a9104a69c36868e.jpg)', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} ref={wallpaperContainerRef} />,
              <div key={'room-background-overlay'} style={{ borderRadius: '24px 24px 0px 0px', opacity: 0.65, backgroundColor: themeColor.get({ noproxy: true })[200], width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
            ] :
            [
              <div key={'room-background-blank'} style={{ borderRadius: '24px 24px 0px 0px', backgroundColor: '#fff', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
            ]
        }
        <div style={{ width: '100%', height: `100%` }}>
          <Chat show={activeTab === 'chat'} room={props.room} />
          <Files show={activeTab === 'files'} room={props.room} />
        </div>
        <Paper
          style={{
            borderRadius: '24px 24px 0px 0px', width: '100%', height: 'auto', position: 'absolute', left: 0, top: 0, backgroundColor: themeColor.get({ noproxy: true })[50]
          }}
        >
          <SigmaTabs
            onChange={(e, newValue) => {
              setActiveTab(newValue)
            }}
            value={activeTab}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <SigmaTab icon={<><Message /><Typography variant={'body2'} style={{ marginLeft: 4, marginTop: 2 }}>Chat</Typography></>} value={'chat'} />
            <SigmaTab icon={<><Description /><Typography variant={'body2'} style={{ marginLeft: 4, marginTop: 2 }}>Files</Typography></>} value={'files'} />
          </SigmaTabs>
        </Paper>
      </div>
    </div>
  ]
  return (
    <SliderPage id={props.id}>
      <div key={'room-background'} style={{ background: 'url(https://i.pinimg.com/564x/2a/cd/6e/2acd6e46cc2bdc218a9104a69c36868e.jpg)', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} ref={wallpaperContainerRef} />,
      <div key={'room-background-overlay'} style={{ opacity: 0.65, backgroundColor: themeColor.get({ noproxy: true })[200], width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
      <Desk show={true} room={props.room} />
      <Root ref={containerRef}>
        <Global
          styles={{
            '.MuiDrawer-root > .MuiPaper-root': {
              overflow: 'visible',
            },
          }}
        />
        {
          utils.screen.isTouchDevice() ? (
            <SwipeableDrawer
              container={containerRef.current}
              open={metaOpen}
              onClose={() => setMetaOpen(false)}
              onOpen={() => setMetaOpen(true)}
              anchor="bottom"
              swipeAreaWidth={drawerBleeding}
              disableSwipeToOpen={false}
              PaperProps={{
                style: {
                  borderRadius: '24px 24px 0px 0px',
                  height: window.innerHeight * 8 / 10
                }
              }}
            >
              {drawerContent}
            </SwipeableDrawer>
          ) : (
            <Drawer
              container={containerRef.current}
              open={metaOpen}
              onClose={() => setMetaOpen(false)}
              anchor="bottom"
              ModalProps={{
                keepMounted: true
              }}
              PaperProps={{
                style: {
                  borderRadius: '24px 24px 0px 0px',
                  height: window.innerHeight * 8 / 10
                }
              }}
            >
              {drawerContent}
            </Drawer>
          )
        }
      </Root>
      <RoomControl
        onClose={() => setShowRoomControl(false)}
        shown={showRoomControl}
        toggleEditMode={(v) => desktopEditMode.set(v)}
        openToolbox={() => {
          setShowRoomControl(false)
          setShowMachineBox(true)
        }}
      />
      <MachineBox
        createWorker={(machineId: string) => addWidgetToSDesktop(props.room, machineId)}
        onClose={() => setShowMachineBox(false)}
        shown={showMachineBox}
      />
      <AppletSheet />
      <div
        id={'lab-message-row'}
        style={{
          top: -10000,
          height: 'auto',
          width: 'auto',
          maxWidth: 250,
          position: "fixed",
          marginLeft: 'auto',
          marginRight: 8,
          marginTop: 0,
          display: 'flex'
        }}
      >
        <Paper
          id={'lab-message-card'}
          style={{
            height: '100%',
            width: 'auto',
            minWidth: 100,
            padding: 8,
            marginLeft: 'auto',
            marginRight: 0
          }}
          elevation={0}
          className={""}
        >
          <div style={{ width: 'auto', height: '100%', position: 'relative' }}>
            <Typography
              variant={"caption"}
              style={{
                textAlign: "left", fontWeight: 'bold', borderRadius: 8, marginTop: 0, height: 'auto'
              }}
            >
              Keyhan
            </Typography>
            <Typography
              id={'lab-message-data'}
              style={{
                textAlign: "left", wordWrap: 'break-word',
                display: 'flex', wordBreak: 'break-word', fontSize: 14, height: 'auto',
                paddingBottom: 16
              }}
            >

            </Typography>
            <div style={{
              width: 72, position: 'absolute', bottom: 0, right: 0, display: "flex",
              paddingLeft: 8, paddingRight: 8,
              borderRadius: "16px 16px 0px 16px"
            }}>
              <Typography
                style={{ textAlign: "right", flex: 1, fontSize: 12 }}
              >
                {(new Date(Date.now())).toTimeString().substring(0, 5)}
              </Typography>
              <History
                style={{
                  width: 16,
                  height: 16,
                  marginLeft: 2,
                }}
              />
            </div>
          </div>
        </Paper>
        <div id={'lab-message-free-space'} style={{ marginTop: 'auto', marginBottom: 0, width: 0, height: 16 }}>

        </div>
      </div>
    </SliderPage >
  )
}

export default Room
