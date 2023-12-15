import lf from "lovefield";

const createTable = (schemaBuilder: lf.schema.Builder) => {
    return schemaBuilder.createTable('chat').
        addColumn('id', lf.Type.STRING).
        addColumn('roomId', lf.Type.STRING).
        addColumn('towerId', lf.Type.STRING).
        addPrimaryKey(['id']);
}

export default { createTable }
