import { InputBase } from "@mui/material"
import { useRef, useState } from "react"
import { themeColor, themeColorName } from "../../App"

const ChatInput = (props: { control: { clear?: () => void, getValue: () => string } }) => {
    const [value, setValue] = useState('')
    const inputbaseRef = useRef(null)
    props.control.clear = () => setValue('')
    props.control.getValue = () => value
    return (
        <InputBase ref={inputbaseRef} multiline placeholder="type your message..." style={{
            flex: 1, height: '100%', borderRadius: 16, paddingLeft: 8, paddingRight: 8,
            paddingTop: 8, paddingBottom: 6, marginTop: 8, marginBottom: 8,
            backgroundColor: themeColorName.get({ noproxy: true }) === 'night' ?
                themeColor.get({ noproxy: true })['plain'] :
                themeColor.get({ noproxy: true })[50]
        }} value={value} onChange={e => {
            setValue(e.target.value)
        }} />
    )
}

export default ChatInput
