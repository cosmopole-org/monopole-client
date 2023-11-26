import { useEffect, useRef } from "react"
import { api } from "../../.."
import IRoom from "../../../api/models/room"

const Image = (props: { tag: string, docId: string, isPreview?: boolean, room: IRoom, style?: any }) => {
    const imageRef = useRef(null)
    const url = useRef('')
    useEffect(() => {
        api.services.file.listenToFileTransfer(props.tag, props.docId + (props.isPreview ? '' : '-original'), (body: { data: Blob }) => {
           url.current = URL.createObjectURL(body.data)
            if (imageRef.current) {
                (imageRef.current as HTMLImageElement).src = url.current
            }
        })
        api.services.file.prevDown({ towerId: props.room.towerId, roomId: props.room.id, documentId: props.docId })
    }, [])
    return <img ref={imageRef} style={props.style} />
}

export default Image
