import { State } from "@hookstate/core"
import { CacheDriver, DatabaseDriver, NetworkDriver } from "../drivers"
import IMessage from "../models/message"
import { api } from "../.."

class FileService {

    storage: DatabaseDriver
    network: NetworkDriver
    cache: CacheDriver
    memory: {
        myHumanId: State<any>,
        spaces: State<any>,
        humans: State<any>,
        machines: State<any>,
        known: {
            spaces: State<any>,
            humans: State<any>,
            machines: State<any>,
        }
    }

    constructor(
        storage: DatabaseDriver,
        network: NetworkDriver,
        cache: CacheDriver,
        memory: {
            myHumanId: State<any>,
            spaces: State<any>,
            humans: State<any>,
            machines: State<any>,
            known: {
                spaces: State<any>,
                humans: State<any>,
                machines: State<any>,
            }
        }
    ) {
        this.storage = storage
        this.network = network
        this.memory = memory
        this.cache = cache

        this.network.socket.on('onWaveformReceived', async body => {
            let { docId, data, first } = body
            if (first) {
                this.cache.put(docId + '-waveform', new Blob([data], { type: this.transferringFileTypes[docId + '-waveform'] }))
            } else {
                let previous = this.cache.get(docId + '-waveform')
                if (previous) {
                    this.cache.put(docId + '-waveform', new Blob([previous, data], { type: this.transferringFileTypes[docId + '-waveform'] }))
                } else {
                    this.cache.put(docId + '-waveform', new Blob([data], { type: this.transferringFileTypes[docId + '-waveform'] }))
                }
            }
            let callbacks = this.fileTransferListeners[docId + '-waveform']
            if (callbacks) {
                Object.values(callbacks).forEach(callback => {
                    callback({ data: this.cache.get(docId + '-waveform') })
                })
            }
        })
        this.network.socket.on('onPreviewReceived', async body => {
            let { docId, data, first } = body
            if (first) {
                this.cache.put(docId + '-preview', new Blob([data], { type: this.transferringFileTypes[docId + '-preview'] }))
            } else {
                let previous = this.cache.get(docId + '-preview')
                if (previous) {
                    this.cache.put(docId + '-preview', new Blob([previous, data], { type: this.transferringFileTypes[docId + '-preview'] }))
                } else {
                    this.cache.put(docId + '-preview', new Blob([data], { type: this.transferringFileTypes[docId + '-preview'] }))
                }
            }
            let callbacks = this.fileTransferListeners[docId + '-preview']
            if (callbacks) {
                Object.values(callbacks).forEach(callback => {
                    callback({ data: this.cache.get(docId + '-preview') })
                })
            }
        })
        this.network.socket.on('onDocumentReceived', body => {
            let { docId, data, first } = body
            if (first) {
                this.cache.put(docId + '-original', new Blob([data], { type: this.transferringFileTypes[docId + '-original'] }))
            } else {
                let previous = this.cache.get(docId + '-original')
                if (previous) {
                    this.cache.put(docId + '-original', new Blob([previous, data], { type: this.transferringFileTypes[docId + '-original'] }))
                } else {
                    this.cache.put(docId + '-original', new Blob([data], { type: this.transferringFileTypes[docId + '-original'] }))
                }
            }
            let callbacks = this.fileTransferListeners[docId + '-original']
            if (callbacks) {
                Object.values(callbacks).forEach(callback => {
                    callback({ data: this.cache.get(docId + '-original'), newChunk: data })
                })
            }
        })
    }

    transferringFileTypes: { [id: string]: string } = {}
    fileTransferListeners: { [id: string]: { [id: string]: (body: { data: Blob, newChunk?: any }) => void } } = {}
    listenToFileTransfer(tag: string, docId: string, callback: (body: { data: Blob, newChunk?: any }) => void) {
        if (!this.fileTransferListeners[docId]) this.fileTransferListeners[docId] = {}
        this.fileTransferListeners[docId][tag] = callback
    }

    async download(data: { towerId: string, roomId: string, documentId: string }): Promise<any> {
        if (api.services.human.token) {
            return fetch(`https://monopole.iran.liara.run/file/download?documentid=${data.documentId}`, {
                method: 'GET',
                headers: {
                    Accept: 'video/*',
                    towerId: data.towerId,
                    roomId: data.roomId,
                    token: api.services.human.token
                }
            })
        }
    }

    async create(data: { towerId: string, roomId: string, parentFolderId: string, title: string }): Promise<IMessage> {
        return this.network.request('file/createFolder', { towerId: data.towerId, roomId: data.roomId, parentFolderId: data.parentFolderId, title: data.title })
    }

    async updateFolder(data: { towerId: string, roomId: string, folderId: string, folder: { title: string } }): Promise<any> {
        return this.network.request('file/updateFolder', { towerId: data.towerId, roomId: data.roomId, folderId: data.folderId, folder: data.folder })
    }

    async getFolder(data: { towerId: string, roomId: string, folderId: string }): Promise<any> {
        return this.network.request('file/getFolder', { towerId: data.towerId, roomId: data.roomId, folderId: data.folderId })
    }

    async removeFolder(data: { towerId: string, roomId: string, folderId: string }): Promise<any> {
        return this.network.request('file/removeFolder', { towerId: data.towerId, roomId: data.roomId, folderId: data.folderId })
    }

    async startUpload(data: { towerId: string, roomId: string, folderId: string }): Promise<any> {
        return this.network.request('file/startUpload', { towerId: data.towerId, roomId: data.roomId, folderId: data.folderId })
    }

    async uploadData(data: { towerId: string, roomId: string, tempDocId: string, uploadToken: string, data: any }): Promise<any> {
        return this.network.request('file/uploadData', { towerId: data.towerId, roomId: data.roomId, uploadToken: data.uploadToken, tempDocId: data.tempDocId, data: data.data })
    }

    async endUpload(data: { towerId: string, roomId: string, tempDocId: string, uploadToken: string, extension: string, fileType: string, title: string }): Promise<any> {
        return this.network.request('file/endUpload', { towerId: data.towerId, roomId: data.roomId, uploadToken: data.uploadToken, tempDocId: data.tempDocId, extension: data.extension, fileType: data.fileType, title: data.title })
    }

    async prevDown(data: { towerId: string, roomId: string, documentId: string }): Promise<any> {
        this.transferringFileTypes[data.documentId + '-preview'] = 'image/jpg'
        let cached = this.cache.get(data.documentId + '-preview')
        if (cached) {
            let callbacks = this.fileTransferListeners[data.documentId + '-preview']
            if (callbacks) {
                Object.values(callbacks).forEach(callback => {
                    callback({ data: this.cache.get(data.documentId + '-preview') })
                })
            }
        } else {
            return this.network.request('file/prevDown', { towerId: data.towerId, roomId: data.roomId, documentId: data.documentId })
        }
    }

    async waveDown(data: { towerId: string, roomId: string, documentId: string }): Promise<any> {
        this.transferringFileTypes[data.documentId + '-waveform'] = 'application/json'
        let cached = this.cache.get(data.documentId + '-waveform')
        if (cached) {
            let callbacks = this.fileTransferListeners[data.documentId + '-waveform']
            if (callbacks) {
                Object.values(callbacks).forEach(callback => {
                    callback({ data: this.cache.get(data.documentId + '-waveform') })
                })
            }
        } else {
            return this.network.request('file/waveDown', { towerId: data.towerId, roomId: data.roomId, documentId: data.documentId })
        }
    }

    async docDown(data: { towerId: string, roomId: string, documentId: string, useRest?: boolean }): Promise<any> {
        this.transferringFileTypes[data.documentId + '-original'] = 'image/jpg'
        let cached = this.cache.get(data.documentId + '-original')
        if (cached) {
            let callbacks = this.fileTransferListeners[data.documentId + '-original']
            if (callbacks) {
                Object.values(callbacks).forEach(callback => {
                    callback({ data: this.cache.get(data.documentId + '-original'), newChunk: this.cache.get(data.documentId + '-original') })
                })
            }
        } else {
            return this.network.request('file/docDown', { towerId: data.towerId, roomId: data.roomId, documentId: data.documentId, transferType: data.useRest ? 'rest' : 'websocket' })
        }
    }

    async group(data: { towerId: string, roomId: string }): Promise<any> {
        return this.network.request('file/group', { towerId: data.towerId, roomId: data.roomId })
    }

    async updateDoc(data: { towerId: string, roomId: string, documentId: string, document: any }): Promise<any> {
        return this.network.request('file/updateDocument', { towerId: data.towerId, roomId: data.roomId, documentId: data.documentId, document: data.document })
    }

    async removeDoc(data: { towerId: string, roomId: string, documentId: string }): Promise<any> {
        return this.network.request('file/removeDocument', { towerId: data.towerId, roomId: data.roomId, documentId: data.documentId })
    }

    createChunks(file: any, cSize: number = 250 * 1024) {
        let startPointer = 0;
        let endPointer = file.size;
        let chunks = [];
        while (startPointer < endPointer) {
            let newStartPointer = startPointer + cSize;
            chunks.push(file.slice(startPointer, newStartPointer));
            startPointer = newStartPointer;
        }
        return chunks;
    }

    async forwardChunkUpload(towerId: string, roomId: string, tempDocId: string, uploadToken: string, chunks: any, pointer: number, finishCallback: () => void) {
        if (chunks.length === pointer) {
            finishCallback()
        } else {
            await api.services.file.uploadData({ towerId, roomId, tempDocId, uploadToken, data: chunks[pointer] })
            setTimeout(() => this.forwardChunkUpload(towerId, roomId, tempDocId, uploadToken, chunks, pointer + 1, finishCallback));
        }
    }

    async upload(data: { towerId: string, roomId: string, file: any, folderId: string }): Promise<any> {
        return new Promise(async resolve => {
            let mimeType = data.file.type.split('/')
            let title = data.file.name
            let fileType = mimeType[0], extension = mimeType[1]
            let body1 = await api.services.file.startUpload({ towerId: data.towerId, roomId: data.roomId, folderId: data.folderId })
            let { tempDocId, uploadToken } = body1
            let chunks = this.createChunks(data.file)
            setTimeout(() => this.forwardChunkUpload(data.towerId, data.roomId, tempDocId, uploadToken, chunks, 0, () => {
                api.services.file
                    .endUpload({ towerId: data.towerId, roomId: data.roomId, tempDocId, uploadToken, extension, fileType, title })
                    .then((body2: any) => {
                        let { document: doc } = body2
                        resolve(doc)
                    })
            }))
        })
    }

    async getDocuemnt(data: { towerId: string, roomId: string, documentId: string }): Promise<any> {
        return this.network.request('file/getDocument', { towerId: data.towerId, roomId: data.roomId, documentId: data.documentId })
    }
}

export default FileService
