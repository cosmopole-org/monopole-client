
import './index.css';
import SigmaBottomNavigation from '../../custom/elements/SigmaBottomNavigation';
import { Forum, Inbox as InboxIcon, LocationCity } from '@mui/icons-material';
import SliderPage from '../../layouts/SliderPage';
import Home from '../../tabs/Home';
import { useCallback, useEffect, useRef, useState } from 'react';
import Settings from '../../tabs/Settings';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { SigmaRouter, themeColor } from '../../../App';
import { api } from '../../..';
import SigmaAvatar from '../../custom/elements/SigmaAvatar';
import Inbox from '../../tabs/Inbox';
import Chats from '../../tabs/Chats';
import { useHookstate } from '@hookstate/core';

const SnMain = (props: { id: string, isOnTop: boolean }) => {
    const navigate = useNavigate()
    const chats = useHookstate(api.memory.chats).get({ noproxy: true })
    const spaces = useHookstate(api.memory.spaces).get({ noproxy: true })
    const unseenCount = useHookstate(api.services.messenger.unseenMsgCount).get({ noproxy: true })
    const contentRef = useRef(null)
    const myUser = api.memory.humans.get({ noproxy: true })[api.memory.myHumanId.get({ noproxy: true })];
    const [value, setValue] = useState(0);
    const inviteCount = useHookstate(api.services.invite.invites).get({ noproxy: true }).length
    const updateTitle = useCallback((index: number) => {
        if (index === 0) switchTitle && switchTitle('Chats')
        if (index === 1) switchTitle && switchTitle('Towers')
        if (index === 2) switchTitle && switchTitle('Inbox')
        if (index === 3) switchTitle && switchTitle('Settings')
    }, [value])
    const handleChangeIndex = useCallback((index: number) => {
        if (contentRef.current !== null) {
            let content = contentRef.current as HTMLElement
            setValue(index)
            content.style.opacity = '0'
            setTimeout(() => {
                navigate(['/chats', '/towers', '/inbox', '/settings'][index])
                updateTitle(index)
                setTimeout(() => {
                    content.style.opacity = '1'
                });
            }, 250);
        }
    }, [updateTitle, navigate, setValue])
    useEffect(() => {
        handleChangeIndex(value)
        api.services.human.signIn()
    }, [])
    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.HOME, () =>
                SigmaRouter.navigate('tower', { initialData: { tower: Object.values(api.memory.spaces.get({ noproxy: true }))[0] } }))
            switchRightControl && switchRightControl(RightControlTypes.EXPLORE, () => SigmaRouter.navigate('explore'))
            switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
            updateTitle(value)
        }
    }, [props.isOnTop])
    let unseenChatMessages = 0
    let chatsByTowerId: { [id: string]: any } = {}
    Object.values(chats).forEach((chat: any) => {
        chatsByTowerId[chat.towerId] = true
        unseenChatMessages += (
            unseenCount[chat.roomId] ?
                unseenCount[chat.roomId] :
                0
        )
    })
    let unseenRoomMessages = 0
    Object.values(spaces).filter(space => !chatsByTowerId[space.id]).forEach((space: any) => {
        Object.values(space.rooms).forEach((room: any) => {
            unseenRoomMessages += (
                unseenCount[room.id] ?
                    unseenCount[room.id] :
                    0
            )
        })
    })
    return (
        <SliderPage id={props.id}>
            <div style={{ position: 'relative', width: '100%', height: '100%', background: themeColor.get({ noproxy: true })[50] }}>
                <div ref={contentRef} style={{ width: '100%', height: '100%', transition: 'opacity .25s', position: 'relative', zIndex: 1 }}>
                    <Routes>
                        <Route path='/chats' Component={() => <Chats show={value === 0} isOnTop={props.isOnTop} />} />
                        <Route path='/towers' Component={() => <Home show={value === 1} isOnTop={props.isOnTop} />} />
                        <Route path='/inbox' Component={() => <Inbox show={value === 2} isOnTop={props.isOnTop} />} />
                        <Route path='/settings' Component={() => <Settings show={value === 3} isOnTop={props.isOnTop} />} />
                    </Routes>
                </div>
                <SigmaBottomNavigation
                    onSwitch={handleChangeIndex}
                    activeTab={value}
                    items={[
                        { label: 'Chats', icon: Forum, attachment: unseenChatMessages },
                        { label: 'Towers', icon: LocationCity, attachment: unseenRoomMessages },
                        { label: 'Inbox', icon: InboxIcon, attachment: inviteCount },
                        { label: 'Settings', icon: () => <SigmaAvatar style={{ height: 32, width: 32, marginLeft: 8 }}>{myUser.firstName.substring(0, 1)}</SigmaAvatar> }
                    ]}
                />
            </div>
        </SliderPage>
    )
}

export default SnMain
