import { BottomNavigation, BottomNavigationAction, Divider, Paper, Typography } from "@mui/material"
import { themeColor } from "../../../App"

const SigmaBottomNavigation = (props: { activeTab: number, items: Array<{ label: string, icon: any, afterDivider?: boolean }>, onSwitch: (index: number) => void, style?: any }) => {
    let children: Array<any> = []
    props.items.forEach((item, index) => {
        if (item.afterDivider) {
            children.push(<Divider style={{ width: 1, backgroundColor: '#999', height: 'calc(100% - 32px)', marginTop: 16 }} />)
        }
        let IconComponent = item.icon
        children.push(
            <BottomNavigationAction
                key={`bottom-navigation-action-${index}`}
                value={index}
                label={<Typography variant={'body2'} style={{ color: props.activeTab === index ? themeColor.get({ noproxy: true })['activeText'] : themeColor.get({ noproxy: true })['passiveText'] }}>{item.label}</Typography>}
                icon={
                    <div style={{ backgroundColor: props.activeTab === index ? themeColor.get({ noproxy: true })[100] : 'transparent', width: 48, borderRadius: 24 }}>
                        <IconComponent style={{ width: 24, height: 24, fill: props.activeTab === index ? themeColor.get({ noproxy: true })['activeText'] : themeColor.get({ noproxy: true })['passiveText'] }} />
                    </div>
                }
            />
        )
    })
    return (
        <BottomNavigation showLabels onChange={(e, newValue) => props.onSwitch(newValue)} value={props.activeTab} component={Paper} elevation={4} style={{
            ...props.style, width: '100%', height: 64, position: 'absolute', bottom: 0, left: 0, borderRadius: 0,
            backgroundColor: themeColor.get({ noproxy: true })[50], backdropFilter: 'blur(10px)', zIndex: 2
        }}>
            {children}
        </BottomNavigation>
    )
}

export default SigmaBottomNavigation
