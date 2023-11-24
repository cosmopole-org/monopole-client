
interface IFolder {
    id: string,
    title: string,
    parentFolderId?: string,
    subDocIds: Array<string>,
    roomId: string,
    isRoot: boolean
}

export default IFolder
