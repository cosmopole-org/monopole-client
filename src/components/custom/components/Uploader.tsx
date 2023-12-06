import { useRef } from "react";
import { api } from "../../..";
import IRoom from "../../../api/models/room";

const Uploader = (props: { inputFile: any, room: IRoom, folderId: string, onSelect: (file: any) => void }) => {
    const id = useRef('uploader-' + Math.random());
    return (
        <input id={id.current} type='file' ref={props.inputFile} style={{ display: 'none' }} onChange={(e: any) => {
            let file = e.target.files[0];
            let el = document.getElementById(id.current) as HTMLInputElement
            if (el) el.value = '';
            if (file) {
                props.onSelect(file)
            }
        }} />
    )
}

export default Uploader
