import { describe, expect, it, test } from 'vitest'

import createTableClass from '../src/createTableClass';
import BillingDatabase from '../src/BillingDatabase';
import tableClasses from '../src/tables'

// Define a mock config object
const mockConfig = { /* ... */ };

// Define a mock table definition
const mockTableDefinition = {
    fields: {
        id: { PK: true, IX: false, type: 'INT', nullable: false, defaultValue: '0', description: '' },
        name: { PK: false, IX: false, type: 'VARCHAR(255)', nullable: true, defaultValue: null, description: '' },
        email: { PK: false, IX: false, type: 'VARCHAR(255)', nullable: true, defaultValue: null, description: '' },
    },
    referenceTables: [],
};

describe('createTableClass', () => {
    test('should return a valid Table class', () => {
        const Table = createTableClass<typeof mockConfig>('address_area', tableClasses['address_area']);
        const table = new Table(mockConfig);
        expect(table).toBeInstanceOf(BillingDatabase);
        // expect(table).toHaveProperty('getAll');
        // expect(table).toHaveProperty('getById');
        // expect(table).toHaveProperty('getFields');
        // expect(table).toHaveProperty('getTableName');
    });

    // test('should return a Table class with correct tableName and fields', () => {
    //     const Table = createTableClass<typeof mockConfig>('users', mockTableDefinition);
    //     expect(Table.getTableName()).toBe('users');
    //     expect(Table.getFields()).toEqual(['id', 'name', 'email']);
    // });

    // test('should return a Table class with getAll and getById methods', () => {
    //     const Table = createTableClass<typeof mockConfig>('users', mockTableDefinition);
    //     const table = new Table(mockConfig);
    //     expect(typeof table.getAll).toBe('function');
    //     expect(typeof table.getById).toBe('function');
    // });
});
