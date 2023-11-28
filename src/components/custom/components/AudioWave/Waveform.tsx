import { useRef, useEffect, useState, useCallback } from 'react';
import waveformAvgChunker from './waveformAvgChunker'
import useSetTrackProgress from './useSetTrackProgress'
import { api } from '../../../..'
import IRoom from '../../../../api/models/room'

const pointCoordinates = (props: {
    index: number, pointWidth: number, pointMargin: number, canvasHeight: number, amplitude: any,
}) => {
    let { index, pointWidth, pointMargin, canvasHeight, amplitude } = props
    const pointHeight = Math.round((amplitude / 25) * canvasHeight)
    const verticalCenter = Math.round((canvasHeight - pointHeight) / 2)
    return [
        index * (pointWidth + pointMargin), // x starting point
        (canvasHeight - pointHeight) - verticalCenter, // y starting point
        pointWidth, // width
        pointHeight, // height
    ]
}

const paintCanvas = (props: {
    canvasRef: any, waveformData: any, canvasHeight: number, pointWidth: number, pointMargin: number,
    playingPoint: any, hoverXCoord: any,
}) => {
    let {
        canvasRef, waveformData, canvasHeight, pointWidth, pointMargin,
        playingPoint, hoverXCoord
    } = props
    const ref = canvasRef.current
    const ctx = ref.getContext('2d')
    // On every canvas update, erase the canvas before painting
    // If you don't do this, you'll end up stacking waveforms and waveform
    // colors on top of each other
    ctx.clearRect(0, 0, ref.width, ref.height)
    waveformData.forEach(
        (p: any, i: any) => {
            ctx.beginPath()
            const coordinates = pointCoordinates({
                index: i,
                pointWidth,
                pointMargin,
                canvasHeight,
                amplitude: p,
            })
            ctx.rect(...coordinates)
            const withinHover = hoverXCoord >= coordinates[0]
            const alreadyPlayed = i < playingPoint
            if (withinHover) {
                ctx.fillStyle = alreadyPlayed ? '#fff' : '#eee'
            } else if (alreadyPlayed) {
                ctx.fillStyle = '#fff'
            } else {
                ctx.fillStyle = '#eee'
            }
            ctx.fill()
        }
    )
}

const Waveform = (props: { docId: string, tag: string, room: IRoom, isPreview: boolean, style?: any }) => {
    const [waveformData, setWaveformData] = useState([])
    const [doc, setDoc]: [any, any] = useState(undefined)
    let trackDuration = 60
    useEffect(() => {
        api.services.file.listenToFileTransfer(props.tag, props.docId + '-waveform', (body: { data: Blob }) => {
            body.data.text().then(text => {
                let arrStartIndex = text.indexOf('[')
                let arrEndIndex = text.indexOf(']')
                let result = []
                try {
                    result = JSON.parse(text.substring(arrStartIndex, arrEndIndex + 1))
                } catch (ex) { }
                setWaveformData(result)
            })
        })
        api.services.file.getDocuemnt({ towerId: props.room.towerId, roomId: props.room.id, documentId: props.docId }).then((body: any) => {
            setDoc(body.doc)
        })
        api.services.file.waveDown({ towerId: props.room.towerId, roomId: props.room.id, documentId: props.docId })
    }, [])
    useEffect(() => {
        setTimeout(() => {
            paintWaveform()
        });
    }, [doc, waveformData])
    const canvasRef = useRef(null)
    const chunkedData = waveformAvgChunker(waveformData)
    const waveformWidth = props.style?.width ? props.style.width : 100
    const canvasHeight = 56
    const pointWidth = 4
    const pointMargin = 1
    const [trackProgress, setTrackProgress] = useState(0)
    const [startTime, setStartTime] = useState(Date.now())
    const [trackPlaying, setTrackPlaying] = useState(true)
    const [hoverXCoord, setHoverXCoord]: [any, any] = useState()
    const playingPoint = (
        (trackProgress * waveformWidth / 100)
        / (pointWidth + pointMargin)
    )
    const paintWaveform = useCallback(() => {
        paintCanvas({
            canvasRef,
            waveformData: chunkedData,
            canvasHeight,
            pointWidth,
            pointMargin,
            playingPoint,
            hoverXCoord,
        })
    }, [playingPoint, doc, waveformData])

    useSetTrackProgress({
        trackProgress, setTrackProgress, trackDuration, startTime,
        trackPlaying
    })

    useEffect(() => {
        if (canvasRef.current) {
            paintWaveform()
        }
    }, [canvasRef])

    useEffect(() => {
        paintWaveform()
    }, [playingPoint])

    const setDefaultX = useCallback(() => {
        setHoverXCoord(undefined)
    }, [])

    const handleMouseMove = useCallback((e: any) => {
        if (canvasRef.current) {
            setHoverXCoord(
                e.clientX - (canvasRef.current as HTMLCanvasElement).getBoundingClientRect().left,
            )
        }
    }, [])

    const seekTrack = (e: any) => {
        if (canvasRef.current) {
            const xCoord = e.clientX - (canvasRef.current as HTMLCanvasElement).getBoundingClientRect().left
            const seekPerc = xCoord * 100 / waveformWidth
            const seekMs = trackDuration * seekPerc / 100
            setStartTime(Date.now() - seekMs)
        }
    }


    return (
        <div style={{ padding: 16 }}>
            <canvas
                style={{ ...props.style, height: canvasHeight, display: 'block' }}
                ref={canvasRef}
                height={canvasHeight}
                width={waveformWidth}
                onBlur={setDefaultX}
                onMouseOut={setDefaultX}
                onMouseMove={handleMouseMove}
                onClick={seekTrack}
            />
        </div>
    )
}

export default Waveform
