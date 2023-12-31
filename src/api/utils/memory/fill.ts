import { State } from "@hookstate/core"
import { DatabaseDriver } from "../../drivers"
import memoryUtils from "."
import IChat from "../../models/chat"

const fill = async (
    storage: DatabaseDriver,
    memory: {
        myHumanId: State<any>,
        spaces: State<any>,
        chats: State<any>,
        humans: State<any>,
        machines: State<any>,
        homeFolders: State<any>,
        known: {
            spaces: State<any>,
            humans: State<any>,
            machines: State<any>,
        }
    }
) => {
    let myHumanId = localStorage.getItem('myHumanId')
    memory.myHumanId.set(myHumanId !== null ? myHumanId : undefined)
    let towers = await storage.factories.tower?.read()
    let rooms = await storage.factories.room?.read()
    memory.spaces.set(memoryUtils.spaces.prepareSpaces(towers as Array<any>, rooms as Array<any>, { ...memory.spaces.get({ noproxy: true }) }))
    memory.known.spaces.set(memoryUtils.spaces.prepareSpaces(towers as Array<any>, rooms as Array<any>, { ...memory.known.spaces.get({ noproxy: true }) }))
    let humans = await storage.factories.human?.read()
    memory.humans.set(memoryUtils.humans.prepareHumans(humans as Array<any>, { ...memory.humans.get({ noproxy: true }) }))
    memory.known.humans.set(memoryUtils.humans.prepareHumans(humans as Array<any>, { ...memory.known.humans.get({ noproxy: true }) }))
    let machines = await storage.factories.machine?.read()
    memory.machines.set(memoryUtils.machines.prepareMachines(machines as Array<any>, { ...memory.machines.get({ noproxy: true }) }))
    memory.known.machines.set(memoryUtils.machines.prepareMachines(machines as Array<any>, { ...memory.known.machines.get({ noproxy: true }) }))
    let homeFolders = await storage.factories.homefolder?.read()
    memory.homeFolders.set(homeFolders)
}

export default fill
