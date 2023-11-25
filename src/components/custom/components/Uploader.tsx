import { api } from "../../..";
import IRoom from "../../../api/models/room";

const Uploader = (props: { inputFile: any, room: IRoom, folderId: string, onUploaded: (doc: any) => void }) => {
    return (
        <input type='file' id='file' ref={props.inputFile} style={{ display: 'none' }} onChange={(e: any) => {
            let file = e.target.files[0];
            if (file) {
                let mimeType = file.type.split('/')
                let fileType = mimeType[0], extension = mimeType[1]
                api.services.file.startUpload({ towerId: props.room.towerId, roomId: props.room.id, folderId: props.folderId }).then((body: any) => {
                    let { tempDocId, uploadToken } = body
                    api.services.file.uploadData({ towerId: props.room.towerId, roomId: props.room.id, tempDocId, uploadToken, data: file }).then((body: any) => {
                        api.services.file.endUpload({ towerId: props.room.towerId, roomId: props.room.id, tempDocId, uploadToken, extension, fileType }).then((body: any) => {
                            let { document: doc } = body
                            props.onUploaded(doc)
                        })
                    })
                })
            }
        }} />
    )
}

export default Uploader
