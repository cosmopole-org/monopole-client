import { State, hookstate } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"

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
        return this.network.request('home/moveTowerToFolder', { towerId: data.towerId, homeFolderId: data.homeFolderId })
    }

    async removeTowerFromFolder(data: { towerId: string, homeFolderId: string }): Promise<void> {
        return this.network.request('home/removeTowerFromFolder', { towerId: data.towerId, homeFolderId: data.homeFolderId })
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
        return this.network.request('home/remove', { homeFolderId: data.homeFolderId })
    }

    async read(): Promise<void> {
        return this.network.request('home/read', {}).then((body: any) => {
            let { homeFolders } = body
            this.storage.factories.homefolder?.createBatch(homeFolders)
            this.memory.homeFolders.set(homeFolders)
            return body
        })
    }
}

export default HomeService
