import toast from "react-hot-toast";
import IRoom from "../../api/models/room";
import ITower from "../../api/models/tower";
import { Typography } from "@mui/material";
import SigmaAvatar from "../custom/elements/SigmaAvatar";
import { themeBasedTextColor, themeColor } from "../../App";
import { api } from "../..";

export let showMessageToast = (message: any, tower: ITower, room: IRoom, onClick: any) => toast((t) => (
    <div onClick={() => {
        toast.dismiss(t.id)
        onClick()
    }}>
        <Typography variant='caption'>{tower.title + '/' + room.title}</Typography>
        <div style={{ display: 'flex' }}>
            <SigmaAvatar style={{ width: 32, height: 32 }}>
                {message.author.firstName.substring(0, 1)}
            </SigmaAvatar>
            <Typography style={{ marginLeft: 8, marginTop: 4 }}>
                {`${message.author.firstName}: ${message.type === 'text' ? message.data.text :
                    ['photo', 'audio', 'video'].includes(message.type) ? message.type :
                        ''
                    }`
                }
            </Typography>
        </div>
    </div>
), {
    style: {
        border: `1px solid ${themeColor.get({ noproxy: true })[500]}`,
        backgroundColor: themeColor.get({ noproxy: true })[50],
        color: themeBasedTextColor.get({ noproxy: true })
    }
})
export let showCallToast = (tower: ITower, room: IRoom, onClick: any) => {
    let human: any = undefined
    let chats = api.memory.chats.get({ noproxy: true })
    let peerids = Object.keys(chats)
    peerids.forEach((peerId: any) => {
        if (chats[peerId]?.roomId === room.id) {
            human = api.memory.known.humans.get({ noproxy: true })[peerId]
        }
    })
    let title = human ? human.firstName : (`${tower.title}/${room.title}`)
    toast((t) => (
        <div onClick={() => {
            toast.dismiss(t.id)
            onClick()
        }}>
            <Typography variant='caption'>{title}</Typography>
            <div style={{ display: 'flex' }}>
                <SigmaAvatar style={{ width: 32, height: 32 }}>
                    {title.substring(0, 1)}
                </SigmaAvatar>
                <Typography style={{ marginLeft: 8, marginTop: 4 }}>
                    {human ? 'is calling you.' : 'new call session'}
                </Typography>
            </div>
        </div>
    ), {
        style: {
            border: `1px solid ${themeColor.get({ noproxy: true })[500]}`,
            backgroundColor: themeColor.get({ noproxy: true })[50],
            color: themeBasedTextColor.get({ noproxy: true })
        }
    })
}
