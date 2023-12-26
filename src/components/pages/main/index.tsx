
import './index.css';
import { interfaceMode } from '../../../App';
import { api } from '../../..';
import { hookstate, useHookstate } from '@hookstate/core';
import SnMain from './sn';
import Room from '../room';

export let currentRoom = hookstate(undefined)
export let setOsCurrentRoomId = (room: any) => {
    currentRoom.set(room)
}

const Main = (props: { id: string, isOnTop: boolean }) => {
    const im = useHookstate(interfaceMode).get({ noproxy: true })
    const currentRoomState = useHookstate(currentRoom) as any
    if (im === 'sn') {
        return <SnMain id={props.id} isOnTop={props.isOnTop} />
    } else {
        if (!currentRoomState.get({ noproxy: true })) {
            setOsCurrentRoomId(Object.values(Object.values(api.memory.spaces.get({ noproxy: true }))[0].rooms)[0])
            return;
        } else {
            return <Room key={currentRoomState.get({ noproxy: true }).id} id={props.id} isOnTop={props.isOnTop} room={currentRoomState.get({ noproxy: true })} />
        }
    }
}

export default Main
