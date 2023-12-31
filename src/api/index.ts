
import { State, hookstate } from "@hookstate/core";
import { CacheDriver, DatabaseDriver, NetworkDriver } from "./drivers";
import * as Services from "./services";
import memoryUtils from "./utils/memory";
import ITower from "./models/tower";
import IHuman from "./models/human";
import IHomeFolder from "./models/homefolder";
import IChat from "./models/chat";

class Api {

    private static _instance: Api;

    public key: string = Math.random().toString().substring(2);

    public static async reset(): Promise<Api> {
        localStorage.clear()
        Api._instance.storage.clearDb()
        return Api.initilize()
    }

    public static async initilize(): Promise<Api> {
        return new Promise(resolve => {
            let storage = new DatabaseDriver(() => {
                Api._instance = new Api(storage)
                resolve(Api._instance)
            })
        })
    }

    storage: DatabaseDriver
    network: NetworkDriver
    cache: CacheDriver
    services: {
        human: Services.HumanService,
        tower: Services.TowerService,
        room: Services.RoomService,
        invite: Services.InviteService,
        machine: Services.MachineService,
        worker: Services.WorkerService,
        messenger: Services.MessengerService
        file: Services.FileService,
        home: Services.HomeService,
        interaction: Services.InteractionService,
        call: Services.CallService
    }
    memory: {
        myHumanId: State<any>,
        spaces: State<{ [id: string]: ITower }>,
        chats: State<{ [id: string]: IChat }>,
        humans: State<{ [id: string]: IHuman }>,
        machines: State<any>,
        messages: { [id: string]: any },
        homeFolders: State<any>,
        known: {
            spaces: State<any>,
            humans: State<any>,
            machines: State<any>,
        }
    }

    constructor(storage: DatabaseDriver) {
        this.storage = storage
        this.cache = new CacheDriver()
        let myHumanId: string | undefined = undefined
        let spaces: { [id: string]: ITower } = {}
        let chats: { [id: string]: IChat } = {}
        let humans: { [id: string]: IHuman } = {}
        let machines: { [id: string]: IHuman } = {}
        let messages: { [id: string]: any } = {}
        let homeFolders: Array<IHomeFolder> = []
        this.memory = {
            myHumanId: hookstate(myHumanId),
            spaces: hookstate(spaces),
            chats: hookstate(chats),
            humans: hookstate(humans),
            machines: hookstate(machines),
            messages: messages,
            homeFolders: hookstate(homeFolders),
            known: {
                spaces: hookstate(spaces),
                humans: hookstate(humans),
                machines: hookstate(machines),
            }
        }
        memoryUtils.fill(this.storage, this.memory)
        this.network = new NetworkDriver()
        this.services = {
            human: new Services.HumanService(this.storage, this.network, this.memory),
            tower: new Services.TowerService(this.storage, this.network, this.memory),
            room: new Services.RoomService(this.storage, this.network, this.memory),
            machine: new Services.MachineService(this.storage, this.network, this.memory),
            worker: new Services.WorkerService(this.storage, this.network, this.memory),
            invite: new Services.InviteService(this.storage, this.network, this.memory),
            messenger: new Services.MessengerService(this.storage, this.network, this.memory),
            file: new Services.FileService(this.storage, this.network, this.cache, this.memory),
            home: new Services.HomeService(this.storage, this.network, this.memory),
            interaction: new Services.InteractionService(this.storage, this.network, this.memory),
            call: new Services.CallService(this.storage, this.network, this.memory)
        }
    }
}

export default Api
