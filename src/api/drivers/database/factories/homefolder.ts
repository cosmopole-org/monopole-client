
import lf from 'lovefield'
import BaseFactory from './base'
import IHomeFolder from '../../../models/homefolder';

class HomeFolderFactory extends BaseFactory {

    public static initialize(db: lf.Database, table: lf.schema.Table) {
        return new HomeFolderFactory(db, table)
    }

    private _create(data: any) {
        return this.table.createRow({
            id: data.id,
            title: data.title,
            towerIds: data.towerIds
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

    public async update(data: IHomeFolder) {
        let updateQuery = this.db.update(this.table).where(this.table.id.eq(data.id));
        updateQuery.set(this.table.title, data.title)
        await updateQuery.exec();
    }

    public async remove(homeFolderId: string) {
        this.db.delete().from(this.table).where(this.table.id.eq(homeFolderId)).exec()
    }

    constructor(db: lf.Database, table: lf.schema.Table) {
        super(db, table)
    }
}

export default HomeFolderFactory
