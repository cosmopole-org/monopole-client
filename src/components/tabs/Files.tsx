
import { Add, Folder, UploadFileRounded } from "@mui/icons-material"
import FileCard from "../custom/components/FileCard"
import FolderCard from "../custom/components/FolderCard"
import SigmaFab from "../custom/elements/SigmaFab"
import FilesAddressBar from "../custom/components/FilesAddressBar"
import { SigmaRouter, themeColor, themeColorName } from "../../App"
import { useEffect, useRef, useState } from "react"
import { api } from "../.."
import IRoom from "../../api/models/room"
import IFolder from "../../api/models/folder"
import { useHookstate } from "@hookstate/core"
import { CircularProgress } from "@mui/material"
import FolderMenu from "../custom/components/FolderMenu"
import Uploader from "../custom/components/Uploader"
import FileMenu from "../custom/components/FileMenu"

export let notifyNewFileUploaded = (doc: any) => { }

const Files = (props: { show: boolean, room: IRoom }) => {
    const inputFile = useRef(null)
    let defaultPathValue: Array<{ title: string, folderId: string }> = [{ title: 'root', folderId: props.room.id }]
    let [folderId, setFolderId] = useState(defaultPathValue[defaultPathValue.length - 1].folderId)
    let [folderData, setFolderData]: [any, (fd: any) => void] = useState(undefined)
    let [loading, setLoading] = useState(false)
    let [pointedFolder, setPointedFolder] = useState(undefined)
    let [pointedFile, setPointedFile] = useState(undefined)
    let pathStack = useHookstate(defaultPathValue)
    let path: Array<{ title: string, folderId: string }> = [...pathStack.get({ noproxy: true })]
    notifyNewFileUploaded = (doc: any) => {
        folderData.subDocIds.push(doc.id)
        folderData.subDocs.push(doc)
        setFolderData({ ...folderData })
    }
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
            style={{ width: '100%', height: 'calc(100% - 32px - 16px)', position: 'absolute', left: props.show ? 0 : '-100%', paddingTop: 32 + 16 }}
        >
            <Uploader folderId={folderId} inputFile={inputFile} room={props.room} onSelect={(file: any) => {
                setLoading(true)
                api.services.file.upload({ towerId: props.room.towerId, roomId: props.room.id, file, folderId }).then((doc: any) => {
                    folderData.subDocIds.push(doc.id)
                    folderData.subDocs.push(doc)
                    setLoading(false)
                    setFolderData({ ...folderData })
                })
            }} />
            <div
                id={'files-list'}
                style={{ width: '100%', height: '100%', paddingTop: 64, position: 'relative', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' }}
            >
                {
                    folderData?.subFolders?.reverse().map((subFolder: IFolder) => (
                        <FolderCard
                            onMoreClicked={() => setPointedFolder(subFolder as any)}
                            onnSelect={() => { pathStack.merge([{ title: subFolder.title, folderId: subFolder.id }]); setFolderId(subFolder.id) }}
                            folder={subFolder} key={`file-${subFolder.id}`} style={{ marginTop: 16, marginLeft: 16, borderRadius: 8, width: 'calc(33% - 20px)' }}
                        />
                    ))
                }
                {
                    folderData?.subDocs?.reverse().map((subDoc: any) => (
                        <FileCard
                            onSelect={() => {
                                if (subDoc.type === 'audio') {
                                    SigmaRouter.navigate('audioPlayer', {
                                        initialData: {
                                            room: props.room,
                                            docId: subDoc.id,
                                            otherDocIds:
                                                folderData.subDocs
                                                    .filter((doc: any) => doc.type === 'audio')
                                                    .map((doc: any) => doc.id)
                                        }
                                    })
                                } else if (subDoc.type === 'image') {
                                    SigmaRouter.navigate('gallery', {
                                        initialData: {
                                            docId: subDoc.id, room: props.room, otherDocIds:
                                                folderData.subDocs
                                                    .filter((doc: any) => doc.type === 'image')
                                                    .map((doc: any) => doc.id)
                                        }, overPrevious: true
                                    })
                                } else if (subDoc.type === 'video') {
                                    SigmaRouter.navigate('videoPlayer', { initialData: { docId: subDoc.id, room: props.room } })
                                }
                            }}
                            onMoreClicked={() => setPointedFile(subDoc as any)}
                            room={props.room}
                            doc={subDoc}
                            key={`file-${subDoc.id}`}
                            style={{ marginTop: 16, marginLeft: 16, borderRadius: 8, width: 'calc(33% - 20px)' }}
                        />
                    ))
                }
                <div style={{ width: '100%', height: 112 }} />
            </div>
            <FilesAddressBar onNavigate={(index: number) => {
                let newPath = path.slice(0, index + 1)
                pathStack.set(newPath)
                setFolderId(newPath[newPath.length - 1].folderId)
            }} path={path} style={{ position: 'absolute', left: 8, top: 48 + 16, width: 'calc(100% - 16px)' }} />
            <SigmaFab size={'large'} variant={'extended'} style={{ position: 'absolute', right: 16, bottom: 16, zIndex: 1 }} onClick={() => {
                let name = window.prompt('enter new folder name:')
                if (!name || (name.length === 0)) return;
                api.services.file.create({ towerId: props.room.towerId, roomId: props.room.id, parentFolderId: folderId, title: name }).then((body: any) => {
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
                        width: '100%', height: 'calc(100% - 48px)', position: 'absolute', left: 0, top: 48,
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
            <FolderMenu
                onClose={() => setPointedFolder(undefined)}
                onRename={() => {
                    let selectedFolder: any = pointedFolder
                    let oldName = selectedFolder.title
                    let newName = window.prompt('enter new folder name:', oldName)
                    if (!newName || (newName.length === 0) || (newName === oldName)) return;
                    api.services.file.updateFolder({
                        towerId: props.room.towerId, roomId: props.room.id,
                        folderId: selectedFolder.id, folder: { title: newName }
                    }).then((body: any) => {
                        selectedFolder.title = newName
                        setFolderData({ ...folderData })
                    })
                }}
                onDelete={() => {
                    let selectedFolder: any = pointedFolder
                    if (window.confirm('do you want to delete this folder ?')) {
                        api.services.file.removeFolder({
                            towerId: props.room.towerId, roomId: props.room.id,
                            folderId: (pointedFolder as any).id
                        }).then((body: any) => {
                            folderData.subFolders = folderData.subFolders.filter((f: IFolder) => f.id !== selectedFolder.id)
                            setFolderData({ ...folderData })
                        })
                    }
                }}
                shown={pointedFolder !== undefined}
            />
            <FileMenu
                onClose={() => setPointedFile(undefined)}
                onRename={() => {
                    let selectedFile: any = pointedFile
                    let oldName = selectedFile.metadata.title
                    let newName = window.prompt('enter new document name:', oldName)
                    if (!newName || (newName.length === 0) || (newName === oldName)) return;
                    api.services.file.updateDoc({
                        towerId: props.room.towerId, roomId: props.room.id,
                        documentId: selectedFile.id, document: { title: newName }
                    }).then((body: any) => {
                        selectedFile.metadata.title = newName
                        setFolderData({ ...folderData })
                    })
                }}
                onDelete={() => {
                    let selectedFile: any = pointedFile
                    if (window.confirm('do you want to delete this document ?')) {
                        api.services.file.removeDoc({
                            towerId: props.room.towerId, roomId: props.room.id,
                            documentId: (selectedFile as any).id
                        }).then((body: any) => {
                            folderData.subDocs = folderData.subDocs.filter((f: any) => f.id !== selectedFile.id)
                            setFolderData({ ...folderData })
                        })
                    }
                }}
                shown={pointedFile !== undefined}
            />
        </div>
    )
}

export default Files
