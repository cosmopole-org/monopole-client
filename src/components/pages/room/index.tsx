
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Paper, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { SigmaRouter, interfaceMode, themeColor, themeColorName } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Edit, Info, KeyboardCommandKey, Message, People, SmartToy } from '@mui/icons-material';
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
      SigmaRouter.navigate('home')
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
  }, [props.isOnTop, im])

  const lastMessage = messagesList ? messagesList[messagesList.length - 1] : undefined

  return (
    <SliderPage id={props.id}>
      <div style={{ width: '100%', height: '100%' }} ref={containerRef}>
        <div key={'room-background'} style={{ background: `url(${RoomWallpaper})`, width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} ref={wallpaperContainerRef} />
        <div key={'room-background-overlay'} style={{
          opacity: themeColorName.get({ noproxy: true }) === 'night' ? 0.85 : 0.65,
          backgroundColor: themeColorName.get({ noproxy: true }) === 'night' ?
            themeColor.get({ noproxy: true })[500] :
            themeColor.get({ noproxy: true })[200],
          width: '100%', height: '100%', position: 'absolute', left: 0, top: 0
        }} />
        <Desk show={true} room={props.room} />
        {
          isOs ?
            null : (
              <Paper style={{
                borderRadius: '24px 24px 0px 0px', width: '100%', height: 48, backgroundColor: themeColor.get({ noproxy: true })[50],
                position: 'absolute', left: 0, bottom: 0
              }}>
                <div style={{ display: 'flex', marginTop: 12 }}>
                  <Message style={{ marginLeft: 16, marginRight: 8 }} />
                  <Typography variant='body2' style={{
                    maxWidth: 'calc(100% - 128px)',
                    wordWrap: 'break-word', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', overflow: 'hidden'
                  }}>
                    {lastMessage ?
                      lastMessage.author.firstName + ' : ' + (
                        lastMessage.type === 'text' ? lastMessage.data.text :
                          ['photo', 'audio', 'video'].includes(lastMessage.type) ? lastMessage.type :
                            'Unsupported message type'
                      ) :
                      'No messages yet'
                    }
                  </Typography>
                </div>
              </Paper>
            )
        }
        {
          !isOs ? [
            <SigmaFab size={'medium'} style={{ position: 'absolute', right: 16, bottom: 16, zIndex: 1 }} onClick={() => {
              openMeta()
            }}
            >
              <People />
            </SigmaFab>,
            <SigmaFab size={'medium'} style={{ position: 'absolute', bottom: 16, right: 16 + 56, zIndex: 1 }} onClick={() => {
              
            }}>
              <KeyboardCommandKey />
            </SigmaFab>
          ] : (
            <Paper style={{ display: 'flex', borderRadius: 16, padding: 4, width: 'auto', height: 'auto', position: 'absolute', left: '50%', bottom: 16, transform: 'translateX(-50%)' }}>
              <SigmaFab style={{ margin: 4 }} onClick={() => {
                openMeta()
              }}
              >
                <People />
              </SigmaFab>
              <SigmaFab style={{ margin: 4 }} onClick={() => {

              }}>
                <KeyboardCommandKey />
              </SigmaFab>
              <SigmaFab style={{ margin: 4 }} onClick={() => {
                desktopEditMode.set(!desktopEditMode.get({ noproxy: true }))
              }}>
                <Edit />
              </SigmaFab>
              <SigmaFab style={{ margin: 4 }} onClick={() => {
                setShowMachineBox(true)
              }}>
                <SmartToy />
              </SigmaFab>
              <SigmaFab style={{ margin: 4 }} onClick={() => {
                
              }}>
                <Info />
              </SigmaFab>
            </Paper>
          )
        }
        <Shadow onClick={() => closeMeta(false)} />
        {
          utils.screen.isTouchDevice() ? (
            <MetaTouch room={props.room} needToCloseRecorder={needToCloseRecorder} onClose={() => { closeMeta(true); showRoomShadow.set(false); }} />
          ) : (
            <MetaNonTouch container={containerRef.current} needToCloseRecorder={needToCloseRecorder} room={props.room} onClose={() => { closeMeta(true); }} />
          )
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
