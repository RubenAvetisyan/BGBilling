import mysql from 'mysql2/promise';


export default class BillingDatabase {
    private config: Record<string, any>;
    private _pool: mysql.Pool | undefined;

    constructor(config: Record<string, any>) {
        this.config = config;
    }

    get pool() {
        if (!this._pool) {
            this._pool = mysql.createPool(this.config);
        }
        return this._pool;
    }

    async query(sql: string, args?: any[]): Promise<any> {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.execute(sql, args);
            return rows;
        } finally {
            connection.release();
        }
    }

    async beginTransaction(): Promise<void> {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
        } finally {
            connection.release();
        }
    }

    async commit(): Promise<void> {
        const connection = await this.pool.getConnection();
        try {
            await connection.commit();
        } finally {
            connection.release();
        }
    }

    async rollback(): Promise<void> {
        const connection = await this.pool.getConnection();
        try {
            await connection.rollback();
        } finally {
            connection.release();
        }
    }

    async close(): Promise<void> {
        await this.pool.end();
    }
}
