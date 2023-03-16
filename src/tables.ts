import type { TableDefinition } from './createTableClass'
import createTableClass from './createTableClass'
import dbSchema from './utils/db-schema.json'

interface TableClasses {
  [key: string]: any // Replace `any` with actual table class type
}

const tableClasses: TableClasses = {}

for (const [tableName, tableDefinition] of Object.entries(dbSchema))
  tableClasses[tableName] = createTableClass<Record<string, TableDefinition>>(tableName, tableDefinition as unknown as TableDefinition)

export default tableClasses
