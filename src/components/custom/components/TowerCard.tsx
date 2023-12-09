import { Avatar, Card, IconButton, Rating, Typography } from "@mui/material"
import SigmaBadgeButton from "../elements/SigmaBadgeButton"
import { MoreVert } from "@mui/icons-material"
import { SigmaRouter, themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"
import { api } from "../../.."

const TowerCard = (props: { tower: any, style?: any, onMoreClicked?: () => void, showRating?: boolean }) => {
    if (props.showRating) {
        return (
            <Card elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(100% - 32px)', padding: 16, height: 176, backgroundColor: themeColor.get({ noproxy: true })[50], borderRadius: 24 }}>
                <SigmaAvatar style={{ width: 48, height: 48 }}>
                    {props.tower.title.substring(0, 1)}
                </SigmaAvatar>
                <Typography variant={'h6'} style={{ marginTop: 16 }}>
                    {props.tower.title}
                </Typography>
                <Typography variant={'body1'} style={{ marginTop: 4 }}>
                    {'welcome to ' + props.tower.title}
                </Typography>
                <Rating style={{
                    position: 'absolute', left: 72, top: 24, marginTop: 8,
                    width: 144, textAlign: 'center'
                }} value={3} readOnly />
                <IconButton style={{ position: 'absolute', right: 16, top: 24 }} onClick={() => {
                    props.onMoreClicked && props.onMoreClicked()
                }}>
                    <MoreVert />
                </IconButton>
                <div style={{ display: 'flex', marginTop: 16 }}>
                    <SigmaBadgeButton caption='View tower' onClick={() => SigmaRouter.navigate('tower', { initialData: { tower: props.tower } })} />
                    <SigmaBadgeButton style={{ marginLeft: 8 }} caption='Open main room' onClick={() => {
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
                            let room = Object.values(api.memory.spaces.get({ noproxy: true })[props.tower.id].rooms)[0]
                            SigmaRouter.navigate('room', { initialData: { room } });
                        }
                    }} />
                </div>
            </Card>
        )
    } else {
        return (
            <Card elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(100% - 32px)', padding: 16, height: 96, backgroundColor: themeColor.get({ noproxy: true })[50], borderRadius: 24 }}>
                <SigmaAvatar style={{ width: 48, height: 48 }}>
                    {props.tower.title.substring(0, 1)}
                </SigmaAvatar>
                <Typography variant={'h6'} style={{ marginTop: 16, position: 'absolute', left: 16 + 48 + 8, top: 8 }}>
                    {props.tower.title}
                </Typography>
                <IconButton style={{ position: 'absolute', right: 16, top: 24 }} onClick={() => {
                    props.onMoreClicked && props.onMoreClicked()
                }}>
                    <MoreVert />
                </IconButton>
                <div style={{ display: 'flex', marginTop: 16 }}>
                    <SigmaBadgeButton caption='View tower' onClick={() => SigmaRouter.navigate('tower', { initialData: { tower: props.tower } })} />
                    <SigmaBadgeButton style={{ marginLeft: 8 }} caption='Open main room' onClick={() => {
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
