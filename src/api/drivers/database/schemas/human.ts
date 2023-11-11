import lf from "lovefield";

const createTable = (schemaBuilder: lf.schema.Builder) => {
    return schemaBuilder.createTable('human').
        addColumn('id', lf.Type.STRING).
        addColumn('firstName', lf.Type.STRING).
        addColumn('lastName', lf.Type.STRING).
        addColumn('secret', lf.Type.OBJECT).
        addPrimaryKey(['id']);
}

export default { createTable }
