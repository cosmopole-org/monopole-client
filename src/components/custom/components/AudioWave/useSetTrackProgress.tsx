import { useRef, useState, useEffect } from "react";

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

export default (props: {
  trackProgress: number, trackDuration: number, startTime: number,
  setTrackProgress: any, trackPlaying: boolean,
}) => {
    let {
        trackProgress, trackDuration, startTime,
        setTrackProgress, trackPlaying,
      } = props
  useEffect(() => {
    let animation: any
    if (trackPlaying) {
      animation = window.requestAnimationFrame(() => {
        const trackProgressPerc = ((Date.now() - startTime)) * 100 / trackDuration
        setTrackProgress(
          clamp(
            trackProgressPerc,
            0, 100,
          ),
        )
      })
    }
    return () => {
      window.cancelAnimationFrame(animation)
    }
  }, [
    trackPlaying,
    trackDuration,
    startTime,
    trackProgress,
  ])
}

const AudioWave = (props: { graph: any, doc: any}) => {
    const waveKey = useRef(Math.random().toString().substring(2))
    const [position, setPosition] = useState(0)
    return (
        <div>

        </div>
    )
}