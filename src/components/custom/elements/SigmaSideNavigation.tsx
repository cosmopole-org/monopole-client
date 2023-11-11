import { Button, Divider, Paper } from "@mui/material"

const SigmaSideNavigation = (props: { items: Array<{ label: string, icon: any, color: string, afterDivider?: boolean }>, style?: any }) => {
    let children: Array<any> = []
    props.items.forEach((item) => {
        if (item.afterDivider) {
            children.push(<Divider orientation="vertical" style={{ width: 'calc(100% - 32px)', backgroundColor: '#999', height: 1, marginTop: 8, marginBottom: 8 }} />)
        }
        let IconComponent = item.icon
        children.push(
            <Button style={{width: 72, height: 56}}>
                <IconComponent style={{ fill: item.color, width: 32, height: 32 }} />
            </Button>
        )
    })
    return (
        <Paper style={{ ...props.style, borderRadius: 0, width: 72, height: '100%', position: 'fixed', top: 0, left: 0, alignContent: 'center', justifyContent: 'center', textAlign: 'center', verticalAlign: 'middle', display: 'flex', flexWrap: 'wrap' }}>
            {children}
            <div style={{width: '100%', height: 112}} />
        </Paper>
    )
}

export default SigmaSideNavigation
