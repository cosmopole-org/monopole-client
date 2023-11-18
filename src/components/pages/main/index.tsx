
import './index.css';
import SigmaBottomNavigation from '../../custom/elements/SigmaBottomNavigation';
import { Explore as ExploreIcon, Home as HomeIcon, Inbox as InboxIcon} from '@mui/icons-material';
import SliderPage from '../../layouts/SliderPage';
import Home from '../../tabs/Home';
import { useCallback, useEffect, useRef, useState } from 'react';
import Explore from '../../tabs/Explore';
import Settings from '../../tabs/Settings';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { SigmaRouter, themeColor } from '../../../App';
import { api } from '../../..';
import SigmaAvatar from '../../custom/elements/SigmaAvatar';
import Inbox from '../../tabs/Inbox';

const Main = (props: { id: string, isOnTop: boolean }) => {
    const navigate = useNavigate()
    const contentRef = useRef(null)
    const [value, setValue] = useState(1);
    const updateTitle = useCallback((index: number) => {
        if (index === 0) switchTitle && switchTitle('Explore')
        if (index === 1) switchTitle && switchTitle('Home')
        if (index === 2) switchTitle && switchTitle('Inbox')
        if (index === 3) switchTitle && switchTitle('Settings')
    }, [value])
    const handleChangeIndex = useCallback((index: number) => {
        if (contentRef.current !== null) {
            let content = contentRef.current as HTMLElement
            setValue(index)
            content.style.transition = 'transform .5s, opacity .35s'
            content.style.opacity = '0'
            content.style.transform = 'translateY(100px)'
            setTimeout(() => {
                navigate(['/explore', '/main', '/inbox', '/settings'][index])
                updateTitle(index)
                setTimeout(() => {
                    content.style.transition = 'transform .35s, opacity .35s'
                    content.style.opacity = '1'
                    content.style.transform = 'translateY(0px)'
                });
            }, 250);
        }
    }, [updateTitle, navigate, setValue])
    useEffect(() => {
        handleChangeIndex(value)
        if (['auth', 'splash'].includes(SigmaRouter.bottomPath())) {
            SigmaRouter.removeBottom()
        }
        api.services.human.signIn()
    }, [])
    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.NOTIFICATIONS)
            switchRightControl && switchRightControl(RightControlTypes.NONE)
            switchColor && switchColor(themeColor.get({noproxy: true})[500], StatusThemes.DARK)
            updateTitle(value)
        }
    }, [props.isOnTop])
    return (
        <SliderPage id={props.id}>
            <div style={{ position: 'relative', width: '100%', height: '100%', background: themeColor.get({noproxy: true})[50] }}>
                <div ref={contentRef} style={{ width: '100%', height: '100%', transition: 'transform .35s, opacity .35s' }}>
                    <Routes>
                        <Route path='/explore' Component={() => <Explore show={value === 0} isOnTop={props.isOnTop} />} />
                        <Route path='/main' Component={() => <Home show={value === 1} isOnTop={props.isOnTop} />} />
                        <Route path='/inbox' Component={() => <Inbox show={value === 2} isOnTop={props.isOnTop} />} />
                        <Route path='/settings' Component={() => <Settings show={value === 3} isOnTop={props.isOnTop} />} />
                    </Routes>
                </div>
                <SigmaBottomNavigation
                    onSwitch={handleChangeIndex}
                    activeTab={value}
                    items={[
                        { label: 'Explore', icon: ExploreIcon },
                        { label: 'Home', icon: HomeIcon },
                        { label: 'Inbox', icon: InboxIcon },
                        { label: 'Settings', icon: () => <SigmaAvatar style={{ height: 32, width: 32, marginLeft: 8}}>K</SigmaAvatar> }
                    ]}
                />
            </div>
        </SliderPage>
    )
}

export default Main
