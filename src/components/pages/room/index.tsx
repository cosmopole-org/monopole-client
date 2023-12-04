
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
import { api } from '../../..';
import { useHookstate } from '@hookstate/core';
import Shadow, { showRoomShadow } from './shadow';
import Meta, { metaOpen } from './meta';

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: themeColor.get({ noproxy: true })[50]
}));

const Room = (props: { id: string, isOnTop: boolean, room: IRoom }) => {
  const [showRoomControl, setShowRoomControl] = useState(false)
  const [showMachineBox, setShowMachineBox] = useState(false)
  const wallpaperContainerRef = useRef(null)
  const close = () => {
    SigmaRouter.back()
  }
  const closeMeta = (closedItself: boolean) => {
    !closedItself && metaOpen.set(false)
    onMetaClose()
  }
  const openMeta = () => {
    showRoomShadow.set(true)
    onMetaOpen()
    metaOpen.set(true)
  }
  const onMetaOpen = () => {
    switchLeftControl && switchLeftControl(LeftControlTypes.CLOSE, () => { closeMeta(false); showRoomShadow.set(false); })
    switchRightControl && switchRightControl(RightControlTypes.COMMANDS, () => setShowRoomControl(true))
    switchTitle && switchTitle(props.room.title)
    switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
  }
  const onMetaClose = () => {
    switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
    switchRightControl && switchRightControl(RightControlTypes.COMMANDS, () => setShowRoomControl(true))
    switchTitle && switchTitle(props.room.title)
    switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
  }
  useEffect(() => {
    return () => {
      desktopEditMode.set(false)
    }
  }, [])
  useEffect(() => {
    if (metaOpen.get({ noproxy: true })) onMetaOpen();
    else onMetaClose()
  }, [props.isOnTop])
  return (
    <SliderPage id={props.id}>
      <div key={'room-background'} style={{ background: 'url(https://i.pinimg.com/564x/2a/cd/6e/2acd6e46cc2bdc218a9104a69c36868e.jpg)', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} ref={wallpaperContainerRef} />,
      <div key={'room-background-overlay'} style={{ opacity: 0.65, backgroundColor: themeColor.get({ noproxy: true })[200], width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
      <Desk show={true} room={props.room} />
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
      <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16, zIndex: 1 }} onClick={() => {
        openMeta()
      }}
      >
        <People />
      </SigmaFab>
      <Shadow onClick={() => closeMeta(false)} />
      <Meta room={props.room} onClose={() => { closeMeta(true); showRoomShadow.set(false); }} />
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
    </SliderPage >
  )
}

export default Room
