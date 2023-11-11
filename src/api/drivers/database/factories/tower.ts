
import lf from 'lovefield'
import BaseFactory from './base'
import ITower from '../../../models/tower';

class TowerFactory extends BaseFactory {

    public static initialize(db: lf.Database, table: lf.schema.Table) {
        return new TowerFactory(db, table)
    }

    private _create(data: any) {
        return this.table.createRow({
            id: data.id,
            title: data.title,
            avatarId: data.avatarId,
            isPublic: data.isPublic,
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

    public async update(data: ITower) {
        let updateQuery = this.db.update(this.table).where(this.table.id.eq(data.id));
        updateQuery.set(this.table.title, data.title)
        updateQuery.set(this.table.avatarId, data.avatarId)
        updateQuery.set(this.table.isPublic, data.isPublic)
        updateQuery.set(this.table.secret, data.secret)
        await updateQuery.exec();
    }

    public remove() {

    }

    constructor(db: lf.Database, table: lf.schema.Table) {
        super(db, table)
    }
}

export default TowerFactory