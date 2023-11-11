
import { State } from "@hookstate/core"
import { DatabaseDriver, NetworkDriver } from "../drivers"
import memoryUtils from "../utils/memory"

class HumanService {

    storage: DatabaseDriver
    memory: {
        myHumanId: State<any>,
        spaces: State<any>,
        humans: State<any>,
        machines: State<any>
    }
    network: NetworkDriver

    private _cCode: string | undefined
    private _token: string | undefined
    private updateToken(token: string) {
        this._token = token
        localStorage.setItem('token', token)
    }

    isSessionAvailable() {
        return this._token !== undefined
    }

    constructor(
        storage: DatabaseDriver,
        network: NetworkDriver,
        memory: {
            myHumanId: State<any>,
            spaces: State<any>,
            humans: State<any>,
            machines: State<any>
        }
    ) {
        this.storage = storage
        this.memory = memory
        this.network = network
        let t = localStorage.getItem('token')
        this._token = t !== null ? t : undefined
    }

    async signUp(data: { phone: string }): Promise<void> {
        return this.network.request('human/signUp', { email: data.phone }).then((body: any) => {
            if (body.success) {
                this._cCode = body.cCode
            }
            return body
        })
    }

    async verify(data: { vCode: string }): Promise<void> {
        if (this._cCode) {
            return this.network.request('human/verify', { cCode: this._cCode, vCode: data.vCode }).then((body: any) => {
                if (body.success) {
                    if (body.session?.token) {
                        this.updateToken(body.session.token)
                        let { towers, rooms, human } = body
                        this.storage.factories.tower?.createBatch(towers)
                        this.storage.factories.room?.createBatch(rooms)
                        this.storage.factories.human?.create(human)
                        localStorage.setItem('myHumanId', human.id)
                        let newSpaces = memoryUtils.spaces.prepareSpaces(towers, rooms, { ...this.memory.spaces.get() })
                        this.memory.spaces.set(newSpaces)
                        this.memory.humans.set(memoryUtils.humans.prepareHumans([human], this.memory.humans.get({ noproxy: true })))
                        this.memory.myHumanId.set(human.id)
                    }
                }
                return { ...body, accountExist: body.session !== undefined }
            })
        }
    }

    async complete(data: { firstName: string, lastName?: string }): Promise<void> {
        return this.network.request('human/complete', { cCode: this._cCode, firstName: data.firstName, lastName: data.lastName }).then((body: any) => {
            if (body.success) {
                if (body.session?.token) {
                    this.updateToken(body.session.token)
                    let { tower, room, human } = body
                    this.storage.factories.tower?.create(tower)
                    this.storage.factories.room?.create(room)
                    this.storage.factories.human?.create(human)
                    localStorage.setItem('myHumanId', human.id)
                    let newSpaces = memoryUtils.spaces.prepareSpaces([tower], [room], { ...this.memory.spaces.get({ noproxy: true }) })
                    this.memory.spaces.set(newSpaces)
                    this.memory.humans.set(memoryUtils.humans.prepareHumans([human], this.memory.humans.get({ noproxy: true })))
                    this.memory.myHumanId.set(human.id)
                }
            }
            return body
        })
    }

    async update(data: { firstName: string, lastName?: string }): Promise<void> {
        return this.network.request('human/update', { firstName: data.firstName, lastName: data.lastName }).then((body: any) => {
            if (body.success) {
                let { human } = body
                this.storage.factories.human?.update(human)
                this.memory.humans.set(memoryUtils.humans.prepareHumans([human], this.memory.humans.get({ noproxy: true })))
            }
            return body
        })
    }

    async signIn(): Promise<any> {
        if (this._token) {
            return this.network.request('human/signIn', { token: this._token })
        } else {
            return new Promise(resolve => {
                resolve({ success: false, error: { message: 'token empty.' } })
            })
        }
    }

    async readById(data: { targetHumanId: string }): Promise<void> {
        return this.network.request('human/readById', { targetHumanId: data.targetHumanId })
    }

    async search(data: { query: string, offset?: number, count?: number }): Promise<void> {
        return this.network.request('human/search', { token: this._token })
    }
}

export default HumanService