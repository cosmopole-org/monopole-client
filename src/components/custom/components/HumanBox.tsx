import * as React from 'react';
import { Card, SwipeableDrawer } from '@mui/material';
import { themeColor } from '../../../App';
import { api } from '../../..';
import HumanTag from './HumanTag';

const HumanBox = (props: { shown: boolean, onClose: () => void, tower: any, onMemberView: (human: any) => void }) => {
    const [members, setMembers] = React.useState([])
    React.useEffect(() => {
        if (props.shown) {
            api.services.tower.readMembers({ towerId: props.tower.id }).then((body: any) => {
                setMembers(body.members.map((m: any) => m.human).filter((human: any) => (human !== undefined)))
            })
        }
    }, [props.shown])
    return (
        <React.Fragment>
            <SwipeableDrawer anchor='bottom' open={props.shown} onOpen={() => { }} onClose={() => props.onClose()}
                PaperProps={{
                    style: {
                        borderRadius: '24px 24px 0px 0px',
                        minHeight: window.innerHeight * 45 / 100 + 'px',
                        height: window.innerHeight * 45 / 100 + 'px',
                        backgroundColor: themeColor.get({ noproxy: true })[50]
                    }
                }}
            >
                <div style={{ width: '100%', height: 32 }}>
                    <Card style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 100, height: 6, borderRadius: 3, background: themeColor.get({ noproxy: true })[100], top: 12 }} />
                </div>
                <div style={{
                    width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexWrap: 'wrap',
                    textAlign: 'center', justifyContent: 'center', alignItems: 'center'
                }}>
                    {
                        members.map((human: any) => {
                            return <HumanTag key={human.id} human={human} onClick={() => {
                                props.onMemberView(human)
                            }} />
                        })
                    }
                </div>
            </SwipeableDrawer>
        </React.Fragment >
    );
}

export default HumanBox
