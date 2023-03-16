import type { RowDataPacket } from 'mysql2'
import BillingDatabase from './BillingDatabase'

interface FieldDefinition {
  PK: boolean
  IX: boolean
  type: string
  nullable: string | boolean | 'true' | 'false'
  defaultValue: string
  description: string
}

interface ReferenceTable {
  thisField?: string
  tableName?: string
  field?: string
}

export interface TableDefinition {
  fields: Record<string, FieldDefinition>
  referenceTables: ReferenceTable[] | []
}

interface TableInstance {
  getFields(): string[]
  getTableName(): string
}

type TableClass<T> = new (config: T) => BillingDatabase & TableInstance

function getTableClass<T extends Record<string, any>>(
  tableName: string,
  fields: string,
  primaryKey: string,
  referenceTables: string,
): TableClass<T> {
  return class Table extends BillingDatabase implements TableInstance {
    constructor(config: T) {
      super(config)
    }

    static getFields(): string[] {
      return fields.split(',')
    }

    static getTableName(): string {
      return tableName
    }

    async getAll(): Promise<Record<string, any>[]> {
      const [rows] = await this.pool.execute<RowDataPacket[]>(
                `SELECT ${fields} FROM ${tableName} ${referenceTables}`,
      )
      return rows as Record<string, any>[]
    }

    async getById(id: number): Promise<Record<string, any> | null> {
      const [rows] = await this.pool.execute<RowDataPacket[]>(
                `SELECT ${fields} FROM ${tableName} ${referenceTables} WHERE ${primaryKey} = ?`,
                [id],
      )
      return rows.length > 0 ? (rows[0] as Record<string, any>) : null
    }

    getFields(): string[] {
      return Table.getFields()
    }

    getTableName(): string {
      return Table.getTableName()
    }
  }
}

export default function createTableClass<T extends Record<string, any>>(
  tableName: string,
  tableDefinition: TableDefinition,
): TableClass<T> {
  const fields = Object.keys(tableDefinition.fields).join(',')
  const primaryKey = Object.keys(tableDefinition.fields).find(
    fieldName => tableDefinition.fields[fieldName].PK,
  )
  const referenceTables = tableDefinition.referenceTables
    ? tableDefinition.referenceTables
      .map(
        refTable =>
                    `LEFT JOIN ${refTable.tableName} ON ${tableName}.${refTable.thisField} = ${refTable.tableName}.${refTable.field}`,
      )
      .join(' ')
    : ''

  const Table = getTableClass(tableName, fields, primaryKey!, referenceTables)
  return Table as TableClass<T>
}
