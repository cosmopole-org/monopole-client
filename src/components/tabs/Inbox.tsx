import { useRef } from "react"
import { Card, Typography } from "@mui/material"
import { api } from "../.."
import { themeColor } from "../../App"
import { Timeline, TimelineConnector, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab"
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import InviteCard from "../custom/components/InviteCard"
import Notififtaions from '../../resources/images/notifications.png'
import { useHookstate } from "@hookstate/core"

const Inbox = (props: { isOnTop: boolean, show: boolean }) => {
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const invites = useHookstate(api.services.invite.invites).get({ noproxy: true })
    return (
        <div ref={containerRef} style={{ backgroundColor: '#fff', overflowY: 'auto', position: 'relative', width: '100%', height: '100%', zIndex: 2 }}
            onScroll={() => {
                if (containerRef.current !== null) {
                    let container = containerRef.current as HTMLElement
                    let scrollTop = container.scrollTop
                    if (headerRef.current !== null) {
                        if (scrollTop > 64) {
                            (headerRef.current as HTMLElement).style.opacity = '0'
                        } else {
                            (headerRef.current as HTMLElement).style.opacity = '1'
                        }
                    }
                }
            }}>
            <Timeline
                style={{
                    minHeight: 'calc(100% - 64px)', width: 'calc(100% - 32px)', background: themeColor.get({ noproxy: true })[50],
                    position: 'absolute', left: 0, top: -20, paddingTop: 56
                }}
                sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.2,
                    },
                }}
            >
                {
                    invites.length === 0 ? (
                        <div style={{ width: '100%', height: 'auto', position: 'absolute', top: 'calc(50% - 64px)', left: 0, transform: 'translateY(-50%)' }}>
                            <div style={{ width: '100%', height: 'auto', position: 'relative' }}>
                                <Card style={{
                                    width: 200, height: 200, borderRadius: '50%', left: '50%',
                                    position: 'absolute', top: 0, transform: 'translateX(-50%)'
                                }}>
                                    <img src={Notififtaions} alt={'notifications placeholder'} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                </Card>
                                <Typography variant="h6" style={{ textAlign: 'center', paddingTop: 216, color: themeColor.get({ noproxy: true })['activeText'] }}>
                                    No Notifications
                                </Typography>
                            </div>
                        </div>
                    ) : (
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot variant="outlined" color="primary" />
                                <TimelineConnector style={{ height: '100%' }} />
                            </TimelineSeparator>
                            <TimelineOppositeContent color="textSecondary" style={{ minWidth: 'calc(100% - 32px)' }}>
                                <Typography style={{ width: '100%', textAlign: 'left' }}>
                                    {new Date(Date.now()).toDateString()}
                                </Typography>
                                <Card elevation={2} style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 16, marginTop: 16, borderRadius: 24 }}>
                                    {
                                        invites.map((invite: any) => {
                                            return (
                                                <InviteCard
                                                    style={{ marginTop: 16 }}
                                                    invite={invite}
                                                    key={`inbox-invite-item-${invite.id}`}
                                                />
                                            )
                                        })
                                    }
                                </Card>
                            </TimelineOppositeContent>
                        </TimelineItem>
                    )
                }
            </Timeline >
        </div >
    )
}

export default Inbox
