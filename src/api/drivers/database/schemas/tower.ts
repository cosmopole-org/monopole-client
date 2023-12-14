import lf from "lovefield";

const createTable = (schemaBuilder: lf.schema.Builder) => {
    return schemaBuilder.createTable('tower').
        addColumn('id', lf.Type.STRING).
        addColumn('title', lf.Type.STRING).
        addColumn('avatarId', lf.Type.STRING).
        addColumn('isPublic', lf.Type.BOOLEAN).
        addColumn('secret', lf.Type.OBJECT).
        addColumn('folderId', lf.Type.STRING).
        addPrimaryKey(['id']);
}

export default { createTable }
