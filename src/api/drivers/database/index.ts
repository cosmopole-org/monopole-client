
import lf from 'lovefield';
import tables from './schemas'
import TowerFactory from './factories/tower';
import RoomFactory from './factories/room';
import HumanFactory from './factories/human';
import MachineFactory from './factories/machine';
import HomeFolderFactory from './factories/homefolder';
import ChatFactory from './factories/chat';

class DatabaseDriver {

    private db: lf.Database | undefined;
    private schemaBuilder: lf.schema.Builder | undefined
    private tables: { [id: string]: lf.schema.Table | undefined } = {}

    clearDb() {
        this.db?.close()
        indexedDB.deleteDatabase('sigma');
    }
    
    factories: {
        tower: TowerFactory | undefined,
        room: RoomFactory | undefined,
        human: HumanFactory | undefined,
        machine: MachineFactory | undefined,
        homefolder: HomeFolderFactory | undefined,
        chat: ChatFactory | undefined
    } = { tower: undefined, room: undefined, human: undefined, machine: undefined, homefolder: undefined, chat: undefined }

    private async prepareDatabase() {
        this.schemaBuilder = lf.schema.create('sigma', 1);
        this.prepareTables()
        this.db = await this.schemaBuilder.connect()
    }

    private prepareTables() {
        if (this.schemaBuilder) {
            Object.values(tables).forEach(table => table.createTable(this.schemaBuilder as lf.schema.Builder))
        }
    }

    private organizeTables() {
        Object.keys(tables).forEach(tableName => {
            this.tables[tableName] = this.db?.getSchema().table(tableName);
        })
    }

    private prepareFactories() {
        this.factories.tower = new TowerFactory(this.db as lf.Database, this.tables['tower'] as lf.schema.Table)
        this.factories.room = new RoomFactory(this.db as lf.Database, this.tables['room'] as lf.schema.Table)
        this.factories.human = new HumanFactory(this.db as lf.Database, this.tables['human'] as lf.schema.Table)
        this.factories.machine = new MachineFactory(this.db as lf.Database, this.tables['machine'] as lf.schema.Table)
        this.factories.homefolder = new HomeFolderFactory(this.db as lf.Database, this.tables['homefolder'] as lf.schema.Table)
        this.factories.chat = new ChatFactory(this.db as lf.Database, this.tables['chat'] as lf.schema.Table)
    }

    constructor(onCreate: () => void) {
        this.prepareDatabase().then(() => {
            this.organizeTables()
            this.prepareFactories()
            onCreate()
        })
    }
}

export default DatabaseDriver
