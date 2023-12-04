
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Box, Card, CircularProgress, CssBaseline, Drawer, Fade, Paper, Skeleton, SwipeableDrawer, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { SigmaRouter, themeBasedTextColor, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Dashboard, Description, History, Message, People, Rocket } from '@mui/icons-material';
import Chat from '../../tabs/Chat';
import RoomControl from '../../custom/components/RoomControl';
import Desk, { addWidgetToSDesktop, desktopEditMode } from '../../tabs/Desk';
import Files from '../../tabs/Files';
import { SigmaTab, SigmaTabs } from '../../custom/elements/SigmaTabs';
import IRoom from '../../../api/models/room';
import MachineBox from '../../custom/components/MachineBox';
import { Global } from '@emotion/react';
import SigmaFab from '../../custom/elements/SigmaFab';
import utils from '../../utils';
import { AppletSheet } from '../../custom/components/AppletSheet';
import { Freeze } from "react-freeze";
import SigmaAvatar from '../../custom/elements/SigmaAvatar';

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: themeColor.get({ noproxy: true })[50]
}));

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

const Room = (props: { id: string, isOnTop: boolean, room: IRoom }) => {
  const [activeTab, setActiveTab] = useState('chat')
  const [showRoomControl, setShowRoomControl] = useState(false)
  const [showMachineBox, setShowMachineBox] = useState(false)
  const wallpaperContainerRef = useRef(null)
  const [metaOpen, setMetaOpen] = useState(false);
  const containerRef = useRef(null)
  const [freezeDrawer, setFreezeDrawer] = useState(true)
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
      switchLeftControl && switchLeftControl(LeftControlTypes.CLOSE, () => {
        setFreezeDrawer(true)
        setMetaOpen(false)
      })
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
    <div style={{ borderRadius: '24px 24px 0px 0px', width: '100%', height: 80, backgroundColor: themeColor.get({ noproxy: true })[50] }}>
      <Puller />
    </div>,
    <Freeze freeze={freezeDrawer}
      placeholder={
        <div style={{ width: '100%', height: '100%', backgroundColor: themeColor.get({ noproxy: true })[50],
        display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center', verticalAlign: 'middle'
        }}>
          <SigmaAvatar style={{ width: 112, height: 112 }}>
            <People style={{width: 'calc(100% - 48px)', height: 'calc(100% - 48px)', margin: 24}} />
          </SigmaAvatar>
        </div>
      }>
      <div
        style={{
          height: '100%',
          marginTop: -40
        }}
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
    </Freeze>
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
              onClose={() => {
                setFreezeDrawer(true)
                setMetaOpen(false)
              }}
              onOpen={() => { }}
              anchor="bottom"
              disableSwipeToOpen
              ModalProps={{
                keepMounted: true
              }}
              PaperProps={{
                style: {
                  borderRadius: '24px 24px 0px 0px',
                  height: window.innerHeight - 112
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
                  height: window.innerHeight - 112
                }
              }}
            >
              {drawerContent}
            </Drawer>
          )
        }
      </Root>
      <Paper style={{
        borderRadius: '24px 24px 0px 0px', width: '100%', height: 48, backgroundColor: themeColor.get({ noproxy: true })[50],
        position: 'absolute', left: 0, bottom: 0
      }}>
        <div style={{ display: 'flex', marginTop: 12 }}>
          <Message style={{ marginLeft: 16, marginRight: 8 }} />
          <Typography variant='body2'>
            Keyhan: Please send me the docs.
          </Typography>
        </div>
      </Paper>
      <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16 }} onClick={() => {
        setMetaOpen(true)
        setTimeout(() => {
          setFreezeDrawer(false)
        }, 500)
      }}
      >
        <People />
      </SigmaFab>
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
