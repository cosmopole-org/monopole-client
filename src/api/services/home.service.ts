import { State, hookstate } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import { api } from "../.."
import ITower from "../models/tower"
import IHomeFolder from "../models/homefolder"

class HomeService {


    storage: DatabaseDriver
    network: NetworkDriver
    memory: {
        myHumanId: State<any>,
        spaces: State<any>,
        humans: State<any>,
        machines: State<any>,
        homeFolders: State<any>,
        known: {
            spaces: State<any>,
            humans: State<any>,
            machines: State<any>,
        }
    }

    constructor(
        storage: DatabaseDriver,
        network: NetworkDriver,
        memory: {
            myHumanId: State<any>,
            spaces: State<any>,
            humans: State<any>,
            machines: State<any>,
            homeFolders: State<any>,
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
    }

    async moveTowerToFolder(data: { towerId: string, homeFolderId: string }): Promise<void> {
        return this.network.request('home/moveTowerToFolder', { towerId: data.towerId, homeFolderId: data.homeFolderId }).then(async (body: any) => {
            let spaces = this.memory.spaces.get({ noproxy: true })
            let tower: ITower = spaces[data.towerId]
            tower.folderId = data.homeFolderId
            await api.storage.factories.tower?.update(tower)
            this.memory.spaces.set({ ...spaces })
            return body
        })
    }

    async removeTowerFromFolder(data: { towerId: string }): Promise<void> {
        let spaces = this.memory.spaces.get({ noproxy: true })
        let tower: ITower = spaces[data.towerId]
        return this.network.request('home/removeTowerFromFolder', { towerId: data.towerId, homeFolderId: tower.folderId }).then(async (body: any) => {
            tower.folderId = '-'
            await api.storage.factories.tower?.update(tower)
            this.memory.spaces.set({ ...spaces })
            return body
        })
    }

    async create(data: { title: string }): Promise<void> {
        return this.network.request('home/create', { title: data.title }).then(async (body: any) => {
            let { homeFolder } = body;
            await this.storage.factories.homefolder?.create(homeFolder)
            this.memory.homeFolders.set([...this.memory.homeFolders.get({ noproxy: true }), homeFolder])
            return body
        })
    }

    async remove(data: { homeFolderId: string }): Promise<void> {
        return this.network.request('home/remove', { homeFolderId: data.homeFolderId }).then(async (body: any) => {
            await this.storage.factories.homefolder?.remove(data.homeFolderId)
            this.memory.homeFolders.set([...this.memory.homeFolders.get({ noproxy: true }).filter((f: any) => f.id !== data.homeFolderId)])
            return body
        })
    }

    async read(): Promise<void> {
        return this.network.request('home/read', {}).then((body: any) => {
            let { homeFolders } = body
            this.storage.factories.homefolder?.createBatch(homeFolders)
            this.memory.homeFolders.set(homeFolders)
            let spaces = this.memory.spaces.get({ noproxy: true })
            homeFolders.forEach((folder: IHomeFolder) => {
                folder.towerIds.forEach(tid => {
                    spaces[tid].folderId = folder.id
                })
            });
            this.storage.factories.tower?.createBatch(Object.values(spaces))
            this.memory.spaces.set({ ...spaces })
            return body
        })
    }
}

export default HomeService
