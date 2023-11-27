import { useRef, useState } from "react";

const AudioWave = (props: { graph: any, doc: any}) => {
    const waveKey = useRef(Math.random().toString().substring(2))
    const [position, setPosition] = useState(0)
    return (
        <div>

        </div>
    )
}

export default AudioWave
