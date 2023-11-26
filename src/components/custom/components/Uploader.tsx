import { api } from "../../..";
import IRoom from "../../../api/models/room";

const Uploader = (props: { inputFile: any, room: IRoom, folderId: string, onSelect: (file: any) => void }) => {
    return (
        <input type='file' ref={props.inputFile} style={{ display: 'none' }} onChange={(e: any) => {
            let file = e.target.files[0];
            if (file) {
                props.onSelect(file)
            }
        }} />
    )
}

export default Uploader
