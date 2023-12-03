import * as React from 'react';
import { Card, SwipeableDrawer } from '@mui/material';
import { themeColor } from '../../../App';
import { api } from '../../..';
import { useHookstate } from '@hookstate/core';
import MachineTag2 from './MachineTag2';

const MachineBox = (props: { shown: boolean, onClose: () => void, createWorker: (machineId: string) => void }) => {
    const myMachines = useHookstate(api.memory.known.machines).get({ noproxy: true })
    React.useEffect(() => {
        if (props.shown) {
            api.services.machine.read({})
        }
    }, [props.shown])
    return (
        <React.Fragment>
            <SwipeableDrawer anchor='bottom' open={props.shown} onOpen={() => { }} onClose={() => props.onClose()}
                disableSwipeToOpen
                PaperProps={{
                    style: {
                        borderRadius: '24px 24px 0px 0px',
                        minHeight: window.innerHeight * 70 / 100 + 'px',
                        height: window.innerHeight * 70 / 100 + 'px',
                        backgroundColor: themeColor.get({ noproxy: true })[50]
                    }
                }}
            >
                <div style={{ width: '100%', height: 32 }}>
                    <Card style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 100, height: 6, borderRadius: 3, background: themeColor.get({ noproxy: true })[100], top: 12 }} />
                </div>
                <div style={{
                    width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexWrap: 'wrap',
                    textAlign: 'center', justifyContent: 'center', alignItems: 'center', alignContent: 'flex-start'
                }}>
                    {
                        Object.values(myMachines).map((machine: any) => {
                            return <MachineTag2 key={machine.id} machine={machine} caption={'Select'} onClick={() => {
                                props.createWorker(machine.id)
                            }} />
                        })
                    }
                </div>
            </SwipeableDrawer>
        </React.Fragment >
    );
}

export default MachineBox
