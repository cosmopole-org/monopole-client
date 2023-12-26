
import './index.css';
import { interfaceMode } from '../../../App';
import { api } from '../../..';
import { useHookstate } from '@hookstate/core';
import SnMain from './sn';
import Room from '../room';

const Main = (props: { id: string, isOnTop: boolean }) => {
    const im = useHookstate(interfaceMode).get({ noproxy: true })
    const spaces = useHookstate(api.memory.spaces).get({ noproxy: true })
    if (im === 'sn') {
        return <SnMain id={props.id} isOnTop={props.isOnTop} />
    } else {
        return <Room id={props.id} isOnTop={props.isOnTop} room={Object.values(Object.values(spaces)[0].rooms)[0]} />
    }
}

export default Main
