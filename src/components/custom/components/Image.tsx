import { useEffect, useRef } from "react"
import { api } from "../../.."
import IRoom from "../../../api/models/room"

const Image = (props: { tag: string, docId: string, isPreview?: boolean, room: IRoom, style?: any, local?: any }) => {
    const imageRef = useRef(null)
    const url = useRef('')
    useEffect(() => {
        if (props.local) {
            if (imageRef.current) {
                if (props.local.type.split('/')[0] === 'video') {
                    (imageRef.current as HTMLVideoElement).src = URL.createObjectURL(props.local)
                } else {
                    (imageRef.current as HTMLImageElement).src = URL.createObjectURL(props.local)
                }
            }
        } else {
            api.services.file.listenToFileTransfer(props.tag, props.docId + (props.isPreview ? '-preview' : '-original'), (body: { data: Blob }) => {
                url.current = URL.createObjectURL(body.data)
                if (imageRef.current) {
                    (imageRef.current as HTMLImageElement).src = url.current
                }
            })
            if (props.isPreview) {
                api.services.file.prevDown({ towerId: props.room.towerId, roomId: props.room.id, documentId: props.docId })
            } else {
                api.services.file.docDown({ towerId: props.room.towerId, roomId: props.room.id, documentId: props.docId })
            }
        }
    }, [props.local, props.docId])
    if (props.local && props.local.type.split('/')[0] === 'video') {
        return <video ref={imageRef} style={{ ...props.style, filter: props.local ? 'blur(10px)' : undefined }} />
    } else {
        return <img ref={imageRef} style={{ ...props.style, filter: props.local ? 'blur(10px)' : undefined }} />
    }
}

export default Image
