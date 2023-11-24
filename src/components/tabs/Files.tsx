
import { Add, Folder, UploadFileRounded } from "@mui/icons-material"
import FileCard from "../custom/components/FileCard"
import FolderCard from "../custom/components/FolderCard"
import SigmaFab from "../custom/elements/SigmaFab"
import FilesAddressBar from "../custom/components/FilesAddressBar"
import { themeColor, themeColorName } from "../../App"
import { useEffect, useRef, useState } from "react"
import { api } from "../.."
import IRoom from "../../api/models/room"
import IFolder from "../../api/models/folder"
import { useHookstate } from "@hookstate/core"
import { CircularProgress } from "@mui/material"

const Files = (props: { show: boolean, room: IRoom }) => {
    const inputFile = useRef(null)
    let defaultPathValue: Array<{ title: string, folderId: string }> = [{ title: 'root', folderId: props.room.id }]
    let [folderId, setFolderId] = useState(defaultPathValue[defaultPathValue.length - 1].folderId)
    let [folderData, setFolderData]: [any, (fd: any) => void] = useState(undefined)
    let [loading, setLoading] = useState(false)
    let pathStack = useHookstate(defaultPathValue)
    let path: Array<{ title: string, folderId: string }> = [...pathStack.get({ noproxy: true })]
    useEffect(() => {
        setLoading(true)
        api.services.file.getFolder({ towerId: props.room.towerId, roomId: props.room.id, folderId }).then((body: any) => {
            let { folder } = body
            setFolderData(folder)
            setLoading(false)
        })
    }, [folderId])
    return (
        <div
            style={{ backgroundColor: themeColor.get({ noproxy: true })[100], width: '100%', height: 'calc(100% - 32px - 16px - 56px)', position: 'absolute', left: props.show ? 0 : '-100%', paddingTop: 32 + 16 }}
        >
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={(e: any) => {
                let file = e.target.files[0];
                if (file) {
                    let mimeType = file.type.split('/')
                    let fileType = mimeType[0], extension = mimeType[1]
                    api.services.file.startUpload({ towerId: props.room.towerId, roomId: props.room.id, folderId }).then((body: any) => {
                        let { tempDocId, uploadToken } = body
                        api.services.file.uploadData({ towerId: props.room.towerId, roomId: props.room.id, tempDocId, uploadToken, data: file }).then((body: any) => {
                            api.services.file.endUpload({ towerId: props.room.towerId, roomId: props.room.id, tempDocId, uploadToken, extension, fileType }).then((body: any) => {
                                let { document: doc } = body
                                folderData.subDocIds.push(doc.id)
                                folderData.subDocs.push(doc)
                                setFolderData({ ...folderData })
                            })
                        })
                    })
                }
            }} />
            <div
                style={{ width: 'calv(100% - 32px)', height: 'calc(100% - 56px)', paddingTop: 64, position: 'relative', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' }}
            >
                {
                    folderData?.subFolders?.map((subFolder: IFolder) => (
                        <FolderCard onnSelect={() => { pathStack.merge([{ title: subFolder.title, folderId: subFolder.id }]); setFolderId(subFolder.id) }} folder={subFolder} key={`file-${subFolder.id}`} style={{ marginTop: 16, marginLeft: 16, borderRadius: 8, width: 'calc(33% - 20px)' }} />
                    ))
                }
                {
                    folderData?.subDocs?.map((subDoc: any) => (
                        <FileCard key={`file-${subDoc.id}`} style={{ marginTop: 16, marginLeft: 16, borderRadius: 8, width: 'calc(33% - 20px)' }} />
                    ))
                }
                <div style={{ width: '100%', height: 32 }} />
            </div>
            <FilesAddressBar onNavigate={(index: number) => {
                let newPath = path.slice(0, index + 1)
                pathStack.set(newPath)
                setFolderId(newPath[newPath.length - 1].folderId)
            }} path={path} style={{ position: 'absolute', left: 8, top: 48 + 16, width: 'calc(100% - 16px)' }} />
            <SigmaFab size={'large'} variant={'extended'} style={{ position: 'absolute', right: 16, bottom: 16, zIndex: 1 }} onClick={() => {
                api.services.file.create({ towerId: props.room.towerId, roomId: props.room.id, parentFolderId: folderId, title: 'hello' }).then((body: any) => {
                    let { folder } = body
                    folderData.subFolders.push(folder)
                    setFolderData({ ...folderData })
                })
            }}>
                <Add />
                <Folder />
            </SigmaFab>
            <SigmaFab size={'medium'} style={{ position: 'absolute', right: 16 + 96, bottom: 16, zIndex: 1 }} onClick={() => {
                inputFile.current && (inputFile.current as HTMLElement).click();
            }}>
                <UploadFileRounded />
            </SigmaFab>
            {
                loading ? (
                    <div style={{
                        width: '100%', height: '100%', position: 'absolute', left: 0, top: 0,
                        backgroundColor: themeColorName.get({ noproxy: true }) === 'night' ?
                            'rgba(0, 0, 0, 0.5)' :
                            'rgba(255, 255, 255, 0.5)',
                        zIndex: 2
                    }}>
                        <div style={{
                            width: '100%', height: '100%', position: 'relative'
                        }}>
                            <CircularProgress style={{
                                width: 40,
                                height: 40,
                                position: 'absolute',
                                left: 'calc(50% - 16px)',
                                top: 'calc(50% - 16px)',
                                transform: 'translate(-50%, -50%)'
                            }} />
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}

export default Files
