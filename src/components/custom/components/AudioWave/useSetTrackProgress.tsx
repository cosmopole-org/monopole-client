import { useRef, useState, useEffect } from "react";

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

export default (props: {
  trackProgress: number,
  setTrackProgress: any, trackPlaying: boolean
}) => {
    let {
        trackProgress,
        setTrackProgress, trackPlaying
      } = props
  useEffect(() => {
    let animation: any
    if (trackPlaying) {
      animation = window.requestAnimationFrame(() => {
        setTrackProgress(
          clamp(
            trackProgress,
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