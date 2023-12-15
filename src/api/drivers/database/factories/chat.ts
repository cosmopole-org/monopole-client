
import lf from 'lovefield'
import BaseFactory from './base'
import IChat from '../../../models/chat';

class ChatFactory extends BaseFactory {

    public static initialize(db: lf.Database, table: lf.schema.Table) {
        return new ChatFactory(db, table)
    }

    private _create(data: any) {
        return this.table.createRow({
            id: data.id,
            roomId: data.roomId,
            towerId: data.towerId
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

    public async update(data: IChat) {
        let updateQuery = this.db.update(this.table).where(this.table.id.eq(data.id));
        updateQuery.set(this.table.roomId, data.roomId)
        updateQuery.set(this.table.towerId, data.towerId)
        await updateQuery.exec();
    }

    public async remove(chatId: string) {
        this.db.delete().from(this.table).where(this.table.id.eq(chatId)).exec()
    }

    constructor(db: lf.Database, table: lf.schema.Table) {
        super(db, table)
    }
}

export default ChatFactory
