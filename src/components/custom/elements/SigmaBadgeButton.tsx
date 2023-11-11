import { Button } from "@mui/material"

const SigmaBadgeButton = (props: { caption: string, onClick: any, style?: any }) => {
    return (
        <Button onClick={props.onClick} size='small' disableElevation variant={'contained'} style={{ ...props.style, borderRadius: 16 }}>
            {props.caption}
        </Button>
    )
}

export default SigmaBadgeButton
