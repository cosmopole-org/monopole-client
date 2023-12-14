import { Button } from "@mui/material"

const SigmaBadgeButton = (props: { caption: string, onClick: any, style?: any, icon?: any }) => {
    return (
        <Button onClick={props.onClick} size='small' disableElevation variant={'contained'} style={{ ...props.style, borderRadius: 16 }}>
            {props.caption}
            {props.icon ? props.icon : null}
        </Button>
    )
}

export default SigmaBadgeButton
