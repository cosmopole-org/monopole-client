import { useEffect, useRef } from "react"
import { Card, IconButton, Typography } from "@mui/material"
import { LeftControlTypes, RightControlTypes, switchLeftControl, switchRightControl, switchTitle } from "../../sections/StatusBar"
import { SigmaRouter, themeColor } from "../../../App"
import SliderPage from "../../layouts/SliderPage"
import IHuman from "../../../api/models/human"
import IMachine from "../../../api/models/machine"
import { ArrowForward, LocationCity, Message, SmartToy } from "@mui/icons-material"
import SigmaAvatar from "../../custom/elements/SigmaAvatar"
import ITower from "../../../api/models/tower"
import { api } from "../../.."
import { openMachineSheet } from "../../custom/components/GlobalAppletSheet"

const Profile = (props: { id: string, isOnTop: boolean, human?: IHuman, machine?: IMachine }) => {
    const containerRef = useRef(null)
    useEffect(() => {
        if (props.isOnTop) {
            switchTitle && switchTitle(props.human ? 'Human Profile' : props.machine ? 'Machine Profile' : '')
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, () => SigmaRouter.back())
            switchRightControl && switchRightControl(RightControlTypes.NONE)
        }
    }, [props.isOnTop])
    let title = props.human ?
        (props.human.firstName + (props.human.lastName ? ` ${props.human.lastName}` : '')) :
        props.machine ?
            props.machine?.name :
            ''
    let titleShort = props.human ?
        (props.human.firstName.substring(0, 1) + (props.human.lastName ? props.human.lastName.substring(0, 1) : '')) :
        props.machine ?
            props.machine?.name.substring(0, 1) :
            ''
    return (
        <SliderPage id={props.id}>
            <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: themeColor.get({ noproxy: true })[50], zIndex: 2 }}>
                <div style={{ width: '100%', height: 16 + 56 }} />
                <Card elevation={0} style={{
                    padding: 16, backgroundColor: themeColor.get({ noproxy: true })[100], borderRadius: 24, height: 'auto',
                    marginLeft: 16, width: 'calc(100% - 64px)', paddingTop: 32, position: 'relative'
                }}>
                    <SigmaAvatar style={{ width: 112, height: 112, margin: '0 auto' }}>
                        {titleShort}
                    </SigmaAvatar>
                    <Typography variant={'h6'} style={{ width: '100%', textAlign: 'center', marginTop: 16 }}>
                        {title}
                    </Typography>
                </Card>
                {
                    props.machine ? (
                        <Card
                            elevation={0}
                            style={{
                                paddingLeft: 16, paddingRight: 16, backgroundColor: themeColor.get({ noproxy: true })[100], borderRadius: 24, height: 'auto', display: 'flex',
                                marginLeft: 16, width: 'calc(100% - 64px)', position: 'relative', marginTop: 16, paddingTop: 8, paddingBottom: 8
                            }}
                            onClick={() => {
                                if (props.machine) {
                                    openMachineSheet(props.machine.id)
                                }
                            }}
                        >
                            <IconButton>
                                <SmartToy />
                            </IconButton>
                            <Typography style={{ flex: 1, marginTop: 8 }}>
                                Open Machine
                            </Typography>
                            <IconButton>
                                <ArrowForward />
                            </IconButton>
                        </Card>
                    ) :
                        null
                }
                {
                    props.human ? (
                        <Card
                            elevation={0}
                            style={{
                                paddingLeft: 16, paddingRight: 16, backgroundColor: themeColor.get({ noproxy: true })[100], borderRadius: 24, height: 'auto', display: 'flex',
                                marginLeft: 16, width: 'calc(100% - 64px)', position: 'relative', marginTop: 16, paddingTop: 8, paddingBottom: 8
                            }}
                            onClick={() => {
                                if (props.human) {
                                    api.services.interaction.interact({ peerId: props.human.id }).then((body: any) => {
                                        let { chat, room, tower } = body
                                        SigmaRouter.navigate('chat', { initialData: { room } })
                                    })
                                }
                            }}
                        >
                            <IconButton>
                                <Message />
                            </IconButton>
                            <Typography style={{ flex: 1, marginTop: 8 }}>
                                Interact
                            </Typography>
                            <IconButton>
                                <ArrowForward />
                            </IconButton>
                        </Card>
                    ) :
                        null
                }
                {
                    props.human ? (
                        <Card
                            elevation={0}
                            style={{
                                paddingLeft: 16, paddingRight: 16, backgroundColor: themeColor.get({ noproxy: true })[100], borderRadius: 24, height: 'auto', display: 'flex',
                                marginLeft: 16, width: 'calc(100% - 64px)', position: 'relative', marginTop: 16, paddingTop: 8, paddingBottom: 8
                            }}
                            onClick={() => {
                                SigmaRouter.navigate('towerPicker', {
                                    initialData: {
                                        onTowerSelect: (tower: ITower) => {
                                            api.services.invite.create({ targetHumanId: (props.human as IHuman).id, towerId: tower.id })
                                        }
                                    }
                                })
                            }}
                        >
                            <IconButton>
                                <LocationCity />
                            </IconButton>
                            <Typography style={{ flex: 1, marginTop: 8 }}>
                                Invite to tower
                            </Typography>
                            <IconButton>
                                <ArrowForward />
                            </IconButton>
                        </Card>
                    ) :
                        null
                }
            </div>
        </SliderPage>
    )
}

export default Profile
