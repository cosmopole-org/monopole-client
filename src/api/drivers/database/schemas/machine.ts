import lf from "lovefield";

const createTable = (schemaBuilder: lf.schema.Builder) => {
    return schemaBuilder.createTable('machine').
        addColumn('id', lf.Type.STRING).
        addColumn('name', lf.Type.STRING).
        addColumn('secret', lf.Type.OBJECT).
        addPrimaryKey(['id']);
}

export default { createTable }
