import { Avatar, Card, IconButton, Rating, Typography } from "@mui/material"
import SigmaBadgeButton from "../elements/SigmaBadgeButton"
import { MoreVert } from "@mui/icons-material"
import { SigmaRouter, themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"

const TowerCard = (props: { tower: any, style?: any, onMoreClicked?: () => void, showRating?: boolean }) => {
    return (
        <Card elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(100% - 32px)', padding: 16, height: 176, backgroundColor: themeColor.get({noproxy: true})[50], borderRadius: 24 }}>
            <SigmaAvatar style={{ width: 48, height: 48 }}>
                {props.tower.title.substring(0, 1)}
            </SigmaAvatar>
            <Typography variant={'h6'} style={{ marginTop: 16 }}>
                {props.tower.title}
            </Typography>
            <Typography variant={'body1'} style={{ marginTop: 8 }}>
                This is a sample tower from sigma.
            </Typography>
            {
                props.showRating ? (
                    <Rating style={{
                        position: 'absolute', left: 72, top: 24, marginTop: 8,
                        width: 144, textAlign: 'center'
                    }} value={3} readOnly />
                ) : null
            }
            <IconButton style={{ position: 'absolute', right: 16, top: 24 }} onClick={() => {
                props.onMoreClicked && props.onMoreClicked()
            }}>
                <MoreVert />
            </IconButton>
            <div style={{ display: 'flex', marginTop: 16 }}>
                <SigmaBadgeButton caption='View tower' onClick={() => SigmaRouter.navigate('tower', { initialData: { tower: props.tower } })} />
                <SigmaBadgeButton style={{ marginLeft: 8 }} caption='Open main room' onClick={() => {
                    //SigmaRouter.navigate('room');
                }} />
            </div>
        </Card>
    )
}

export default TowerCard
