
import { blue } from '@mui/material/colors';
import './index.css';
import { useEffect } from 'react';
import { SigmaRouter } from '../../../App';
import { api } from '../../..';

const Splash = (props: { id: string, isOnTop: boolean }) => {
    useEffect(() => {
        setTimeout(() => {
            if (api.services.human.isSessionAvailable()) {
                SigmaRouter.navigate('main')
            } else {
                SigmaRouter.navigate('auth')
            }
        }, 1500);
    }, [])
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div style={{
                width: 176,
                height: 176,
                borderRadius: '50%',
                backgroundColor: blue[100],
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                
            </div>
        </div>
    )
}

export default Splash
