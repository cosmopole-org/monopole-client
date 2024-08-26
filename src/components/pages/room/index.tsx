
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Paper, SwipeableDrawer, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { SigmaRouter, interfaceMode, themeColor, themeColorName } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Edit, Forum, Info, KeyboardCommandKey, Message, People, SmartToy } from '@mui/icons-material';
import Desk, { addWidgetToSDesktop, desktopEditMode } from '../../tabs/Desk';
import IRoom from '../../../api/models/room';
import MachineBox from '../../custom/components/MachineBox';
import SigmaFab from '../../custom/elements/SigmaFab';
import { AppletSheet } from '../../custom/components/AppletSheet';
import Shadow, { showRoomShadow } from './shadow';
import { changeMetaDrawerState } from './metaTouch';
import utils from '../../utils';
import MetaNonTouch, { metaNonTouchOpen } from './metaNonTouch';
import MetaTouch from './metaTouch';
import { useHookstate } from '@hookstate/core';
import { api } from '../../..';
import RoomWallpaper from '../../../resources/images/room.jpg';
import RoomDrawer, { checkForRoomDrawerRecovery, roomDrawerOpen } from '../../sections/RoomDrawer';
import room from '../../../api/drivers/database/schemas/room';
import RoomMoreMenu from '../../custom/components/RoomMoreMenu';
import HumanBox from '../../custom/components/HumanBox';

const Room = (props: { id: string, isOnTop: boolean, room: IRoom }) => {
  const containerRef: any = useRef(null)
  const [showMachineBox, setShowMachineBox] = useState(false)
  const wallpaperContainerRef = useRef(null)
  const isMetaOpen = useRef(false);
  const [needToCloseRecorder, setNeedToCloseRecorder] = useState(false)
  const messagesList = useHookstate(api.memory.messages[props.room.id]).get({ noproxy: true })
  const im = useHookstate(interfaceMode).get({ noproxy: true })
  const isOs = im === 'os'
  const updateMetaState = (state: boolean) => {
    isMetaOpen.current = state;
    if (utils.screen.isTouchDevice()) {
      changeMetaDrawerState && changeMetaDrawerState(state);
    } else {
      metaNonTouchOpen.set(state)
    }
  }
  const close = () => {
    setNeedToCloseRecorder(true)
    SigmaRouter.back()
  }
  const closeMeta = (closedItself: boolean) => {
    !closedItself && updateMetaState(false)
    onMetaClose()
  }
  const openMeta = () => {
    if (utils.screen.isTouchDevice()) {
      showRoomShadow.set(true)
    }
    onMetaOpen()
    updateMetaState(true)
  }
  const onMetaOpen = () => {
    switchLeftControl && switchLeftControl(LeftControlTypes.CLOSE, () => { closeMeta(false); showRoomShadow.set(false); })
    switchRightControl && switchRightControl(RightControlTypes.CALL, () => SigmaRouter.navigate('call', { initialData: { room: props.room } }))
    switchTitle && switchTitle(props.room.title)
    switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
  }
  const onMetaClose = () => {
    switchLeftControl && switchLeftControl(isOs ? LeftControlTypes.CITY : LeftControlTypes.BACK, isOs ? () => {
      roomDrawerOpen.set(true);
    } : close)
    switchRightControl && switchRightControl(RightControlTypes.CALL, () => SigmaRouter.navigate('call', { initialData: { room: props.room } }))
    switchTitle && switchTitle(props.room.title)
    switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
  }
  useEffect(() => {
    return () => {
      showRoomShadow.set(false)
      desktopEditMode.set(false)
    }
  }, [])
  useEffect(() => {
    if (isMetaOpen.current) onMetaOpen();
    else onMetaClose()
    if (props.isOnTop) {
      checkForRoomDrawerRecovery();
    }
  }, [props.isOnTop, im])

  const lastMessage = messagesList ? messagesList[messagesList.length - 1] : undefined

  return (
    <SliderPage id={props.id}>
      <div style={{ width: '100%', height: '100%' }} ref={containerRef}>
        <Desk show={true} room={props.room} />
        <Paper style={{
          borderRadius: '24px 24px 0px 0px', width: '100%', height: 48, backgroundColor: themeColor.get({ noproxy: true })[50],
          position: 'absolute', left: 0, bottom: 0
        }}>

        </Paper>
        <div style={{ width: '100%', position: 'absolute', left: 0, bottom: 16, zIndex: 1, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
          {
            isOs ? (
              <SigmaFab size={'medium'} style={{ marginLeft: 4, marginRight: 4 }} onClick={() => {
                SigmaRouter.navigate('chats')
              }}>
                <Forum />
              </SigmaFab>
            ) : null
          }
          <SigmaFab size={'medium'} style={{ marginLeft: 4, marginRight: 4 }} onClick={() => {
            openMeta()
          }}
          >
            <People />
          </SigmaFab>
          <SigmaFab size={'medium'} style={{ marginLeft: 4, marginRight: 4 }} onClick={() => {

          }}>
            <KeyboardCommandKey />
          </SigmaFab>
          <SigmaFab size={'medium'} style={{ marginLeft: 4, marginRight: 4 }} onClick={() => {
            setShowMachineBox(true)
          }}>
            <SmartToy />
          </SigmaFab>
          <SigmaFab size={'medium'} style={{ marginLeft: 4, marginRight: 4 }} onClick={() => {
            desktopEditMode.set(!desktopEditMode.get({ noproxy: true }))
          }}>
            <Edit />
          </SigmaFab>
          <SigmaFab size={'medium'} style={{ marginLeft: 4, marginRight: 4 }} onClick={() => {

          }}>
            <Info />
          </SigmaFab>
        </div>
        <Shadow onClick={() => closeMeta(false)} />
        {
          utils.screen.isTouchDevice() ? (
            <MetaTouch room={props.room} needToCloseRecorder={needToCloseRecorder} onClose={() => { closeMeta(true); showRoomShadow.set(false); }} />
          ) : (
            <MetaNonTouch container={containerRef.current} needToCloseRecorder={needToCloseRecorder} room={props.room} onClose={() => { closeMeta(true); }} />
          )
        }
        {
          isOs ?
            <RoomDrawer room={props.room} container={containerRef.current} />
            : null
        }
        <MachineBox
          createWorker={(machineId: string) => addWidgetToSDesktop(props.room, machineId)}
          onClose={() => setShowMachineBox(false)}
          shown={showMachineBox}
        />
        <AppletSheet />
      </div>
    </SliderPage >
  )
}

export default Room
