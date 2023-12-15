import { Avatar, Card, IconButton, Paper, Rating, Typography } from "@mui/material"
import SigmaBadgeButton from "../elements/SigmaBadgeButton"
import { AllOut, ArrowForward, ArrowRight, LocationCity, MoreVert } from "@mui/icons-material"
import { SigmaRouter, themeColor, themeColorName } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import { api } from "../../.."

const TowerCard = (props: { tower: any, style?: any, onMoreClicked?: () => void, showRating?: boolean }) => {
    if (props.showRating) {
        return (
            <Card elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(100% - 32px)', padding: 16, height: 168, backgroundColor: themeColor.get({ noproxy: true })[50], borderRadius: 24 }}>
                <img style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} src={props.tower.wallpaper} />
                <Typography variant={'h6'} style={{
                    position: 'absolute',
                    left: 40,
                    top: 16,
                    paddingTop: 2,
                    paddingBottom: 14,
                    paddingLeft: 28,
                    paddingRight: 12,
                    backgroundColor: themeColor.get({ noproxy: true })[100],
                    borderRadius: '0px 24px 24px 0px'
                }}>
                    {props.tower.title}
                </Typography>
                <SigmaAvatar style={{
                    width: 40, height: 40, position: 'absolute', left: 16, top: 16,
                    backgroundColor: themeColor.get({ noproxy: true })[200],
                    border: `4px solid ${themeColor.get({ noproxy: true })[100]}`
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
                            opacity: 0.5,
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
                    position: 'absolute', left: 44, top: 42, transform: 'scale(0.65, 0.65)',
                    textAlign: 'center', backgroundColor: themeColor.get({ noproxy: true })[100],
                    borderRadius: 16
                }} value={3} readOnly />
                <IconButton style={{
                    position: 'absolute', right: 16, top: 16,
                    backgroundColor: themeColor.get({ noproxy: true })[100]
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
            <Card elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(100% - 32px)', padding: 16, height: 168, backgroundColor: themeColor.get({ noproxy: true })[50], borderRadius: 24 }}>
                <img style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} src={props.tower.wallpaper} />
                <Typography variant={'h6'} style={{
                    position: 'absolute',
                    left: 40,
                    top: 22,
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: 28,
                    paddingRight: 12,
                    backgroundColor: themeColor.get({ noproxy: true })[100],
                    borderRadius: '0px 24px 24px 0px'
                }}>
                    {props.tower.title}
                </Typography>
                <SigmaAvatar style={{
                    width: 28, height: 28, position: 'absolute', left: 20, top: 22,
                    backgroundColor: themeColor.get({ noproxy: true })[200],
                    border: `4px solid ${themeColor.get({ noproxy: true })[100]}`
                }}>
                    {props.tower.title.substring(0, 1)}
                </SigmaAvatar>
                <IconButton style={{
                    position: 'absolute', right: 16, top: 16,
                    backgroundColor: themeColor.get({ noproxy: true })[100]
                }} onClick={() => {
                    props.onMoreClicked && props.onMoreClicked()
                }}>
                    <MoreVert />
                </IconButton>
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
                            opacity: 0.5,
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
                                    Main Room
                                </Typography>
                                <Typography variant="body2" style={{ marginLeft: 8 }}>
                                    Welcome to our room Peter !
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
            </Card>
        )
    }
}

export default TowerCard
