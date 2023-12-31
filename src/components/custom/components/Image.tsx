import { useEffect, useRef, useState } from "react"
import { api } from "../../.."
import IRoom from "../../../api/models/room"
import { Skeleton } from "@mui/material"

const Image = (props: { downloadType?: string, tag: string, docId: string, isPreview?: boolean, room: IRoom, style?: any, local?: any, onImageLoad?: (url: string) => void }) => {
    const imageRef = useRef(null)
    const url = useRef('')
    const [showLoading, setShowLoading] = useState(false)
    const [error, setError] = useState(false)
    useEffect(() => {
        if (props.local) {
            if (imageRef.current) {
                setError(false)
                if (props.local.type.split('/')[0] === 'video') {
                    (imageRef.current as HTMLVideoElement).src = URL.createObjectURL(props.local)
                } else {
                    (imageRef.current as HTMLImageElement).src = URL.createObjectURL(props.local)
                }
            }
        } else {
            api.services.file.listenToFileTransfer(props.tag, props.docId + (props.isPreview ? '-preview' : '-original'), (body: { data: Blob, end?: boolean }) => {
                if (props.isPreview) {
                    url.current = URL.createObjectURL(body.data)
                    if (imageRef.current) {
                        (imageRef.current as HTMLImageElement).src = url.current
                    }
                    setError(false)
                }
            })
            if (props.isPreview) {
                api.services.file.prevDown({ towerId: props.room.towerId, roomId: props.room.id, documentId: props.docId })
            } else {
                setShowLoading(true)
                api.services.file.download({
                    downloadType: props.downloadType ? props.downloadType : api.services.file.downloadTypes.DOCUMENT,
                    towerId: props.room.towerId,
                    roomId: props.room.id,
                    documentId: props.docId,
                    onChunk: (data: any) => {

                    },
                    onResult: (data: any) => {
                        url.current = URL.createObjectURL(new Blob(data, { type: 'image/jpg' }))
                        props.onImageLoad && props.onImageLoad(url.current)
                        if (imageRef.current) {
                            (imageRef.current as HTMLImageElement).src = url.current
                        }
                        setShowLoading(false)
                        setError(false)
                    }
                })
            }
        }
    }, [props.local, props.docId])
    if (showLoading) {
        return <Skeleton style={props.style} />
    }
    else if (props.local && props.local.type.split('/')[0] === 'video') {
        return <video ref={imageRef} style={{ ...props.style, filter: props.local ? 'blur(10px)' : undefined }} />
    } else if (!error) {
        return (
            <img onError={() => {
                setError(true)
            }} ref={imageRef} src={url.current} style={{ ...props.style, filter: props.local ? 'blur(10px)' : undefined }} alt="" />
        )
    } else {
        return null
    }
}

export default Image
