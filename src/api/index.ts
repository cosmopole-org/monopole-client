
import { State, hookstate } from "@hookstate/core";
import { DatabaseDriver, NetworkDriver } from "./drivers";
import * as Services from "./services";
import memoryUtils from "./utils/memory";
import ITower from "./models/tower";
import IHuman from "./models/human";

class Api {

    public static async initilize(): Promise<Api> {
        return new Promise(resolve => {
            let storage = new DatabaseDriver(() => {
                resolve(new Api(storage))
            })
        })
    }

    storage: DatabaseDriver
    network: NetworkDriver
    services: {
        human: Services.HumanService,
        tower: Services.TowerService,
        room: Services.RoomService,
        invite: Services.InviteService,
        machine: Services.MachineService
    }
    memory: {
        myHumanId: State<any>,
        spaces: State<{ [id: string]: ITower }>,
        humans: State<{ [id: string]: IHuman }>,
        machines: State<any>,
        known: {
            spaces: State<any>,
            humans: State<any>,
            machines: State<any>,
        }
    }

    constructor(storage: DatabaseDriver) {
        this.storage = storage
        let myHumanId: string | undefined = undefined
        let spaces: { [id: string]: ITower } = {}
        let humans: { [id: string]: IHuman } = {}
        let machines = {}
        this.memory = {
            myHumanId: hookstate(myHumanId),
            spaces: hookstate(spaces),
            humans: hookstate(humans),
            machines: hookstate(machines),
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
            invite: new Services.InviteService(this.network)
        }
    }
}

export default Api
