import { Card, IconButton, Rating, Typography } from "@mui/material"
import SigmaBadgeButton from "../elements/SigmaBadgeButton"
import { AllOut, ArrowForward, LocationCity, MoreVert } from "@mui/icons-material"
import { SigmaRouter, themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import { api } from "../../.."
import '../../../resources/styles/towercard.css'
import { useEffect } from "react"
import { useHookstate } from "@hookstate/core"
import IRoom from "../../../api/models/room"

const TowerCard = (props: { tower: any, style?: any, onMoreClicked?: () => void, showRating?: boolean }) => {
    useEffect(() => {
        var pix = document.getElementsByClassName("pixel") as any;
        for (var i = 0; i < pix.length; i++) {
            pix[i].style.animationDelay = Math.ceil(Math.random() * 5000) + "ms";
        }
    }, [])
    const messagesList = useHookstate(props.showRating ? [] : api.memory.messages[(Object.values(props.tower.rooms)[0] as IRoom).id])?.get({ noproxy: true })
    const lastMessage = messagesList ? messagesList[messagesList.length - 1] : undefined
    const backPatternColor0 = themeColor.get({ noproxy: true })[50];
    const backPatternColor1 = themeColor.get({ noproxy: true })[100];
    if (props.showRating) {
        return (
            <Card elevation={0} style={{
                ...props.style, position: 'relative', width: 'calc(100% - 32px)', padding: 16, height: 168,
                backgroundColor: backPatternColor0,
                borderRadius: 24,
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', left: 0, top: 0,
                    width: '100%', height: '100%',
                    background: `
                                radial-gradient(circle at 100% 50%, transparent 20%, ${backPatternColor1} 21%, ${backPatternColor1} 34%, transparent 35%, transparent),
                                radial-gradient(circle at 0% 50%, transparent 20%, ${backPatternColor1} 21%, ${backPatternColor1} 34%, transparent 35%, transparent) 0 -50px`,
                    backgroundSize: `75px 100px`
                }} />
                <Typography variant={'h6'} style={{
                    minWidth: 88,
                    position: 'absolute',
                    left: 40,
                    top: 14,
                    paddingTop: 0,
                    paddingBottom: 14,
                    paddingLeft: 24,
                    paddingRight: 12,
                }}>
                    {props.tower.title}
                </Typography>
                <SigmaAvatar style={{
                    width: 44, height: 44, position: 'absolute', left: 16, top: 16,
                }}>
                    {props.tower.title.substring(0, 1)}
                </SigmaAvatar>
                <div style={{ backdropFilter: 'blur(5px)', borderRadius: 24, width: 'calc(100% - 32px)', height: 56, position: 'absolute', left: 16, top: 76, overflow: 'hidden' }}>
                    <div style={{
                        width: '100%', height: '100%', position: 'relative'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            backgroundColor: themeColor.get({ noproxy: true })[100],
                            zIndex: 0
                        }} />
                        <div style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            padding: 8,
                            zIndex: 1,
                            display: 'flex'
                        }}>
                            <SigmaAvatar>
                                <LocationCity />
                            </SigmaAvatar>
                            <div style={{ height: '100%' }}>
                                <Typography variant="body2" style={{ marginLeft: 8, fontWeight: 'bold' }}>
                                    Guardian
                                </Typography>
                                <Typography variant="body2" style={{ marginLeft: 8 }}>
                                    {'welcome to ' + props.tower.title}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <Rating style={{
                    position: 'absolute', left: 44, top: 40, transform: 'scale(0.65, 0.65)',
                    textAlign: 'center', borderRadius: 16
                }} value={3} readOnly />
                <IconButton style={{
                    position: 'absolute', right: 16, top: 16
                }} onClick={() => {
                    props.onMoreClicked && props.onMoreClicked()
                }}>
                    <MoreVert />
                </IconButton>
                <div style={{ display: 'flex', position: 'absolute', bottom: 16, left: 0, width: '100%', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <SigmaBadgeButton icon={<AllOut style={{ marginLeft: 8 }} />} style={{ marginLeft: 16 }} caption='View tower' onClick={() => SigmaRouter.navigate('tower', { initialData: { tower: props.tower } })} />
                    <div style={{ flex: 1 }} />
                    <SigmaBadgeButton icon={<ArrowForward style={{ marginLeft: 8 }} />} style={{ marginRight: 16 }} caption='Open main room' onClick={() => {
                        if (props.showRating) {
                            let rooms = api.memory.spaces.get({ noproxy: true })[props.tower?.id]?.rooms
                            if (rooms && rooms[0]) {
                                let room = api.memory.spaces.get({ noproxy: true })[props.tower.id].rooms[0]
                                SigmaRouter.navigate('room', { initialData: { room } });
                            } else {
                                api.services.room.search({ towerId: props.tower.id, query: '', offset: 0, count: 1 }).then((body: any) => {
                                    let room = body.rooms[0]
                                    SigmaRouter.navigate('room', { initialData: { room } });
                                })
                            }
                        } else {
                            SigmaRouter.navigate('room', { initialData: { room: Object.values(api.memory.spaces.get({ noproxy: true })[props.tower.id].rooms)[0] } });
                        }
                    }} />
                </div>
            </Card>
        )
    } else {
        return (
            <Card elevation={0} style={{
                ...props.style, position: 'relative', width: 'calc(100% - 32px)', padding: 16, height: 168,
                backgroundColor: backPatternColor0,
                borderRadius: 24,
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', left: 0, top: 0,
                    width: '100%', height: '100%',
                    background: `
                                radial-gradient(circle at 100% 50%, transparent 20%, ${backPatternColor1} 21%, ${backPatternColor1} 34%, transparent 35%, transparent),
                                radial-gradient(circle at 0% 50%, transparent 20%, ${backPatternColor1} 21%, ${backPatternColor1} 34%, transparent 35%, transparent) 0 -50px`,
                    backgroundSize: `75px 100px`
                }} />
                <Typography variant={'h6'} style={{
                    position: 'absolute',
                    left: 40,
                    top: 22,
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: 32,
                    paddingRight: 12
                }}>
                    {props.tower.title}
                </Typography>
                <SigmaAvatar style={{
                    width: 48, height: 48, position: 'absolute', left: 16, top: 16
                }}>
                    {props.tower.title.substring(0, 1)}
                </SigmaAvatar>
                <IconButton style={{
                    position: 'absolute', right: 16, top: 16
                }} onClick={() => {
                    props.onMoreClicked && props.onMoreClicked()
                }}>
                    <MoreVert />
                </IconButton>
                <div style={{ borderRadius: 24, width: 'calc(100% - 32px)', height: 56, position: 'absolute', left: 16, top: 80, overflow: 'hidden' }}>
                    <div style={{
                        width: '100%', height: '100%', position: 'relative'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            backgroundColor: themeColor.get({ noproxy: true })[100],
                            zIndex: 0
                        }} />
                        <div style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            padding: 8,
                            zIndex: 0,
                            display: 'flex'
                        }}>
                            <SigmaAvatar>
                                <LocationCity />
                            </SigmaAvatar>
                            <div style={{ height: '100%' }}>
                                <Typography variant="body2" style={{ marginLeft: 8, fontWeight: 'bold' }}>
                                    Main Room
                                </Typography>
                                <Typography variant="body2" style={{ marginLeft: 8 }}>
                                    {lastMessage ? lastMessage.type === 'text' ? lastMessage.data.text : ['photo', 'audio', 'video'].includes(lastMessage.type) ? lastMessage.type : `unsupported message type` : `Empty chat`}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', position: 'absolute', bottom: 16, left: 0, width: '100%', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <SigmaBadgeButton icon={<AllOut style={{ marginLeft: 8 }} />} style={{ marginLeft: 16 }} caption='View tower' onClick={() => SigmaRouter.navigate('tower', { initialData: { tower: props.tower } })} />
                    <div style={{ flex: 1 }} />
                    <SigmaBadgeButton icon={<ArrowForward style={{ marginLeft: 8 }} />} style={{ marginRight: 16 }} caption='Open main room' onClick={() => {
                        if (props.showRating) {
                            let rooms = api.memory.spaces.get({ noproxy: true })[props.tower?.id]?.rooms
                            if (rooms && rooms[0]) {
                                let room = api.memory.spaces.get({ noproxy: true })[props.tower.id].rooms[0]
                                SigmaRouter.navigate('room', { initialData: { room } });
                            } else {
                                api.services.room.search({ towerId: props.tower.id, query: '', offset: 0, count: 1 }).then((body: any) => {
                                    let room = body.rooms[0]
                                    SigmaRouter.navigate('room', { initialData: { room } });
                                })
                            }
                        } else {
                            SigmaRouter.navigate('room', { initialData: { room: Object.values(api.memory.spaces.get({ noproxy: true })[props.tower.id].rooms)[0] } });
                        }
                    }} />
                </div>
            </Card >
        )
    }
}

export default TowerCard
