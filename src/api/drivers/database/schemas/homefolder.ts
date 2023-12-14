import lf from "lovefield";

const createTable = (schemaBuilder: lf.schema.Builder) => {
    return schemaBuilder.createTable('homefolder').
        addColumn('id', lf.Type.STRING).
        addColumn('title', lf.Type.STRING).
        addColumn('towerIds', lf.Type.OBJECT).
        addPrimaryKey(['id']);
}

export default { createTable }
