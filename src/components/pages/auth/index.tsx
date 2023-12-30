
import './index.css';
import SliderPage from '../../layouts/SliderPage';
import React, { useEffect, useRef, useState } from 'react';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Button, Card, CircularProgress, InputBase } from '@mui/material';
import { SigmaRouter, themeColor } from '../../../App';
import { api } from '../../..';
import { useAuth0 } from '@auth0/auth0-react';

const Auth = (props: { id: string, isOnTop: boolean }) => {
    const [pending, setPending] = useState(false)
    const [level, setLevel] = useState(2)
    const phoneRef = useRef('')
    const vCodeRef = useRef('')
    const firstNameRef = useRef('')
    const lastNameRef = useRef('')
    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.NOTIFICATIONS)
            switchRightControl && switchRightControl(RightControlTypes.NONE)
            switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
            switchTitle && switchTitle('Logging in')
        }
    }, [props.isOnTop])
    useEffect(() => {
        if (['splash'].includes(SigmaRouter.bottomPath())) {
            SigmaRouter.removeBottom()
        }
    }, [])
    return (
        <SliderPage id={props.id}>
            <div style={{ position: 'relative', width: '100%', height: '100%', background: themeColor.get({ noproxy: true })[50] }}>
                <div style={{
                    width: '80%', height: 'auto', position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)', transition: 'translate .25s, top .25s'
                }}>
                    <Card elevation={0} style={{
                        display: 'none',
                        backgroundColor: themeColor.get({ noproxy: true })[100], width: '90%', maxWidth: 400, height: 100, borderRadius: 24, padding: 16
                    }}>
                        <div style={{ width: '100%', height: 48, display: 'flex' }}>
                            <InputBase disabled={level !== 0 || pending} defaultValue={'+98'} style={{
                                width: 56, height: 48, borderRadius: 16, backgroundColor: themeColor.get({ noproxy: true })[50]
                            }}
                                inputProps={{
                                    style: {
                                        textAlign: 'center'
                                    }
                                }}
                            />
                            <InputBase disabled={level !== 0 || pending} placeholder={'Phone Number'} style={{
                                flex: 1, height: 48, borderRadius: 16, backgroundColor: themeColor.get({ noproxy: true })[50],
                                paddingLeft: 16, marginLeft: 8
                            }} onChange={e => { phoneRef.current = e.target.value }} />
                        </div>
                        <Button disabled={level !== 0 || pending} variant='contained' style={{ borderRadius: 16, marginTop: 16, width: '100%' }}
                            onClick={() => {
                                let phone = phoneRef.current
                                if (phone.length > 0) {
                                    setPending(true)
                                    switchTitle && switchTitle('Verification')
                                    api.services.human.signUp({ phone }).then((res: any) => {
                                        setLevel(1)
                                        setPending(false)
                                    }).catch(ex => {
                                        console.log(ex);
                                        setPending(false)
                                    })
                                } else {
                                    alert('phone number is necessary.')
                                }
                            }}>
                            Login
                        </Button>
                    </Card>
                    <Card elevation={0} style={{
                        display: 'none',
                        backgroundColor: themeColor.get({ noproxy: true })[100], width: '90%', maxWidth: 400, height: 100, borderRadius: 24, padding: 16, marginTop: 16
                    }}>
                        <InputBase disabled={level !== 1 || pending} placeholder={'Verification Code'} style={{
                            width: '100%', height: 48, borderRadius: 16, backgroundColor: themeColor.get({ noproxy: true })[50],
                            paddingLeft: 16
                        }} onChange={e => { vCodeRef.current = e.target.value }} />
                        <Button disabled={level !== 1 || pending} variant='contained' style={{ borderRadius: 16, marginTop: 16, width: '100%' }}
                            onClick={() => {
                                let vCode = vCodeRef.current
                                if (vCode.length > 0) {
                                    setPending(true)
                                    switchTitle && switchTitle('Completing Profile')
                                    api.services.human.verify({ accessToken: '' }).then((res: any) => {
                                        if (res.accountExist) {
                                            switchTitle && switchTitle('Welcome to Sigma !')
                                            setLevel(3)
                                            setTimeout(() => {
                                                api.services.human.signIn().then((body: any) => {
                                                    if (body.success) {
                                                        SigmaRouter.navigate('main')
                                                    }
                                                })
                                            }, 1250);
                                        } else {
                                            setLevel(2)
                                            setPending(false)
                                        }
                                    }).catch(ex => {
                                        console.log(ex);
                                        setPending(false)
                                    })
                                } else {
                                    alert('verification code is necessary.')
                                }
                            }}>
                            Verify
                        </Button>
                    </Card>
                    <Card elevation={0} style={{
                        backgroundColor: themeColor.get({ noproxy: true })[100], width: '90%', maxWidth: 400, height: 168,
                        borderRadius: 24, padding: 16, marginTop: 16
                    }}>
                        <InputBase disabled={level !== 2 || pending} placeholder={'First Name'} style={{
                            width: '100%', height: 48, borderRadius: 16, backgroundColor: themeColor.get({ noproxy: true })[50],
                            paddingLeft: 16
                        }} onChange={e => { firstNameRef.current = e.target.value }} />
                        <InputBase disabled={level !== 2 || pending} placeholder={'Last Name'} style={{
                            width: '100%', height: 48, borderRadius: 16, backgroundColor: themeColor.get({ noproxy: true })[50],
                            paddingLeft: 16, marginTop: 16
                        }} onChange={e => { lastNameRef.current = e.target.value }} />
                        <Button disabled={level !== 2 || pending} variant='contained' style={{ borderRadius: 16, marginTop: 16, width: '100%' }}
                            onClick={() => {
                                let firstName = firstNameRef.current
                                let lastName = lastNameRef.current
                                if (firstName.length > 0) {
                                    setPending(true)
                                    api.services.human.complete({ firstName, lastName }).then((res: any) => {
                                        switchTitle && switchTitle('Welcome to Sigma !')
                                        setLevel(3)
                                        setTimeout(() => {
                                            SigmaRouter.navigate('main')
                                        }, 1250);
                                    }).catch(ex => {
                                        console.log(ex);
                                        setPending(false)
                                    })
                                } else {
                                    alert('firstname is necessary.')
                                }
                            }}>
                            Complete Profile
                        </Button>
                    </Card>
                    {
                        level === 3 || pending ? (
                            <Card style={{ width: 56, height: 56, padding: 8, borderRadius: '50%', margin: '0 auto', marginTop: 16 }}>
                                <CircularProgress style={{ width: '100%', height: '100%' }} />
                            </Card>
                        ) : null
                    }
                </div>
            </div>
        </SliderPage>
    )
}

export default Auth
