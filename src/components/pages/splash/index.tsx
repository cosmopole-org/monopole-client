
import './index.css';
import { useEffect } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import { api } from '../../..';
import { useAuth0 } from '@auth0/auth0-react';
import Logo from '../../../resources/images/logo.png';
import sigma from '../../../resources/images/sigma.png';

const Splash = (props: { id: string, isOnTop: boolean }) => {
    const {
        getAccessTokenSilently,
        loginWithRedirect,
        isAuthenticated,
        isLoading
    } = useAuth0();
    useEffect(() => {
        setTimeout(() => {
            if (api.services.human.isSessionAvailable()) {
                SigmaRouter.navigate('main')
            } else if (!isLoading && !isAuthenticated) {
                loginWithRedirect();
            }
        }, 1500);
    }, [])
    useEffect(() => {
        if (!isLoading && !api.services.human.isSessionAvailable()) {
            if (isAuthenticated) {
                getAccessTokenSilently().then(at => {
                    api.services.human.verify({ accessToken: at }).then((body: any) => {
                        let { accountExist } = body
                        if (accountExist) {
                            SigmaRouter.navigate('main')
                        } else {
                            SigmaRouter.navigate('auth')
                        }
                    })
                })
            } else {
                loginWithRedirect()
            }
        }
    }, [isAuthenticated, isLoading, getAccessTokenSilently])
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: themeColor.get({ noproxy: true })[100]  }}>
            <div style={{
                width: 176,
                height: 176,
                borderRadius: '50%',
                backgroundColor: themeColor.get({ noproxy: true })[100],
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -75%)'
            }}>
                <img src={Logo} style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{
                width: 128,
                height: 128,
                borderRadius: '50%',
                backgroundColor: themeColor.get({ noproxy: true })[100],
                position: 'absolute',
                left: '50%',
                bottom: 32,
                transform: 'translateX(-50%)'
            }}>
                <img src={sigma} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    )
}

export default Splash
