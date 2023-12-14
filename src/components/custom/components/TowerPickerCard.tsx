import { Card, Typography } from "@mui/material"
import SigmaBadgeButton from "../elements/SigmaBadgeButton"
import { Done } from "@mui/icons-material"
import { themeColor } from "../../../App"
import SigmaAvatar from "../elements/SigmaAvatar"

const TowerPickerCard = (props: { tower: any, checked?: boolean, style?: any, onSelect: () => void }) => {
    return (
        <Card elevation={0} style={{ ...props.style, position: 'relative', width: 'calc(100% - 32px)', padding: 16, height: 72, backgroundColor: themeColor.get({ noproxy: true })[100], borderRadius: 24 }}>
            <div style={{ display: 'flex' }}>
                <SigmaAvatar style={{ width: 40, height: 40 }}>
                    {props.tower.title.substring(0, 1)}
                </SigmaAvatar>
                <Typography variant={'h6'} style={{ marginTop: 6, marginLeft: 12, flex: 1 }}>
                    {props.tower.title}
                </Typography>
                <SigmaBadgeButton caption={props.checked ? '' : 'Select'} icon={props.checked ? <Done /> : null} onClick={() => props.onSelect()} style={{ marginTop: 4 }} />
            </div>
            <Typography variant={'body1'} style={{ marginTop: 8 }}>
                This is a sample tower from sigma.
            </Typography>
        </Card>
    )
}

export default TowerPickerCard
