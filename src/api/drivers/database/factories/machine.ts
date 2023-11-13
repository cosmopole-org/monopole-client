
import lf from 'lovefield'
import BaseFactory from './base'
import IHuman from '../../../models/human';
import IMachine from '../../../models/machine';

class MachineFactory extends BaseFactory {

    public static initialize(db: lf.Database, table: lf.schema.Table) {
        return new MachineFactory(db, table)
    }

    private _create(data: any) {
        return this.table.createRow({
            id: data.id,
            name: data.name,
            secret: data.secret
        });
    }

    public create(data: any) {
        let row = this._create(data)
        return this.db.insertOrReplace().into(this.table).values([row]).exec();
    }

    public createBatch(data: Array<any>) {
        let rows = data.map(d => this._create(d))
        return this.db.insertOrReplace().into(this.table).values(rows).exec();
    }

    public async read() {
        return this.db.select().from(this.table).exec();
    }

    public async update(data: IMachine) {
        let updateQuery = this.db.update(this.table).where(this.table.id.eq(data.id));
        updateQuery.set(this.table.name, data.name)
        updateQuery.set(this.table.secret, data.secret)
        await updateQuery.exec();
    }

    public async remove(machineId: string) {
        this.db.delete().from(this.table).where(this.table.id.eq(machineId)).exec()
    }

    constructor(db: lf.Database, table: lf.schema.Table) {
        super(db, table)
    }
}

export default MachineFactory
