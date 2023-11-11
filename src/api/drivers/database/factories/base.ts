
abstract class BaseFactory {

    db: lf.Database
    table: lf.schema.Table

    public abstract create(data: any): void
    public abstract read(): void
    public abstract update(data: any): void
    public abstract remove(roomId: string): void

    constructor(db: lf.Database, table: lf.schema.Table) {
        this.db = db
        this.table = table
    }
}

export default BaseFactory
