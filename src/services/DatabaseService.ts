import { 
  Tenant, 
  TenantDatabase, 
  TenantSchema, 
  TenantFilter,
  TenantAwareEntity,
  QueryOptions,
  TenantId
} from '../types/multiTenancy';

// Database Service for Multi-Tenancy
export class DatabaseService {
  private static instance: DatabaseService;
  private tenantDatabases: Map<string, TenantDatabase> = new Map();
  private tenantSchemas: Map<string, TenantSchema> = new Map();
  private connectionPool: Map<string, any> = new Map();

  private constructor() {
    this.initializeDefaultSchemas();
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Initialize default schemas for new tenants
  private initializeDefaultSchemas(): void {
    const defaultSchema: TenantSchema = {
      id: 'default_schema',
      tenantId: 'default',
      name: 'Default Schema',
      version: '1.0.0',
      tables: [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'uuid', nullable: false, isPrimary: true, isUnique: true, isIndexed: true },
            { name: 'tenant_id', type: 'uuid', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'email', type: 'varchar(255)', nullable: false, isPrimary: false, isUnique: true, isIndexed: true },
            { name: 'first_name', type: 'varchar(100)', nullable: false, isPrimary: false, isUnique: false, isIndexed: false },
            { name: 'last_name', type: 'varchar(100)', nullable: false, isPrimary: false, isUnique: false, isIndexed: false },
            { name: 'role', type: 'varchar(50)', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'is_active', type: 'boolean', nullable: false, defaultValue: true, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'created_at', type: 'timestamp', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'updated_at', type: 'timestamp', nullable: false, isPrimary: false, isUnique: false, isIndexed: false }
          ],
          indexes: [
            { name: 'idx_users_tenant_id', columns: ['tenant_id'], type: 'btree', unique: false },
            { name: 'idx_users_email', columns: ['email'], type: 'btree', unique: true },
            { name: 'idx_users_role', columns: ['role'], type: 'btree', unique: false }
          ],
          constraints: [
            { name: 'fk_users_tenant', type: 'foreign_key', definition: 'FOREIGN KEY (tenant_id) REFERENCES tenants(id)' }
          ]
        },
        {
          name: 'groups',
          columns: [
            { name: 'id', type: 'uuid', nullable: false, isPrimary: true, isUnique: true, isIndexed: true },
            { name: 'tenant_id', type: 'uuid', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'name', type: 'varchar(255)', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'description', type: 'text', nullable: true, isPrimary: false, isUnique: false, isIndexed: false },
            { name: 'trainer_id', type: 'uuid', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'is_active', type: 'boolean', nullable: false, defaultValue: true, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'created_at', type: 'timestamp', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'updated_at', type: 'timestamp', nullable: false, isPrimary: false, isUnique: false, isIndexed: false }
          ],
          indexes: [
            { name: 'idx_groups_tenant_id', columns: ['tenant_id'], type: 'btree', unique: false },
            { name: 'idx_groups_trainer_id', columns: ['trainer_id'], type: 'btree', unique: false }
          ],
          constraints: [
            { name: 'fk_groups_tenant', type: 'foreign_key', definition: 'FOREIGN KEY (tenant_id) REFERENCES tenants(id)' },
            { name: 'fk_groups_trainer', type: 'foreign_key', definition: 'FOREIGN KEY (trainer_id) REFERENCES users(id)' }
          ]
        },
        {
          name: 'presentations',
          columns: [
            { name: 'id', type: 'uuid', nullable: false, isPrimary: true, isUnique: true, isIndexed: true },
            { name: 'tenant_id', type: 'uuid', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'title', type: 'varchar(255)', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'description', type: 'text', nullable: true, isPrimary: false, isUnique: false, isIndexed: false },
            { name: 'trainer_id', type: 'uuid', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'status', type: 'varchar(50)', nullable: false, defaultValue: 'draft', isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'file_path', type: 'varchar(500)', nullable: true, isPrimary: false, isUnique: false, isIndexed: false },
            { name: 'created_at', type: 'timestamp', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
            { name: 'updated_at', type: 'timestamp', nullable: false, isPrimary: false, isUnique: false, isIndexed: false }
          ],
          indexes: [
            { name: 'idx_presentations_tenant_id', columns: ['tenant_id'], type: 'btree', unique: false },
            { name: 'idx_presentations_trainer_id', columns: ['trainer_id'], type: 'btree', unique: false },
            { name: 'idx_presentations_status', columns: ['status'], type: 'btree', unique: false }
          ],
          constraints: [
            { name: 'fk_presentations_tenant', type: 'foreign_key', definition: 'FOREIGN KEY (tenant_id) REFERENCES tenants(id)' },
            { name: 'fk_presentations_trainer', type: 'foreign_key', definition: 'FOREIGN KEY (trainer_id) REFERENCES users(id)' }
          ]
        }
      ],
      migrations: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tenantSchemas.set('default', defaultSchema);
  }

  // Database Connection Management
  async getConnection(tenantId: string): Promise<any> {
    if (this.connectionPool.has(tenantId)) {
      return this.connectionPool.get(tenantId);
    }

    // In a real implementation, this would create a database connection
    // For now, we'll simulate a connection object
    const connection = {
      tenantId,
      isConnected: true,
      lastUsed: new Date(),
      query: async (sql: string, params: any[] = []) => {
        console.log(`[${tenantId}] Executing query:`, sql, params);
        return this.simulateQuery(sql, params, tenantId);
      }
    };

    this.connectionPool.set(tenantId, connection);
    return connection;
  }

  private async simulateQuery(sql: string, params: any[], tenantId: string): Promise<any> {
    // Simulate database query execution
    // In a real implementation, this would execute actual SQL
    console.log(`Simulating query for tenant ${tenantId}:`, sql);
    
    // Return mock data based on the query type
    if (sql.toLowerCase().includes('select')) {
      return this.generateMockSelectResult(sql, tenantId);
    } else if (sql.toLowerCase().includes('insert')) {
      return { insertId: `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    } else if (sql.toLowerCase().includes('update')) {
      return { affectedRows: Math.floor(Math.random() * 10) + 1 };
    } else if (sql.toLowerCase().includes('delete')) {
      return { affectedRows: Math.floor(Math.random() * 5) + 1 };
    }

    return { success: true };
  }

  private generateMockSelectResult(sql: string, tenantId: string): any[] {
    // Generate mock data based on the table being queried
    if (sql.toLowerCase().includes('users')) {
      return [
        {
          id: `user_1_${tenantId}`,
          tenant_id: tenantId,
          email: 'user1@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'trainer',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
    } else if (sql.toLowerCase().includes('groups')) {
      return [
        {
          id: `group_1_${tenantId}`,
          tenant_id: tenantId,
          name: 'Leadership Team',
          description: 'Core leadership group',
          trainer_id: `user_1_${tenantId}`,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
    }

    return [];
  }

  // Tenant-Aware Query Builder
  buildTenantQuery(
    table: string,
    options: QueryOptions,
    tenantId: string
  ): { sql: string; params: any[] } {
    let sql = `SELECT * FROM ${table}`;
    const params: any[] = [];
    const conditions: string[] = [];

    // Always add tenant isolation
    conditions.push('tenant_id = ?');
    params.push(tenantId);

    // Add filters
    if (options.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value !== undefined && value !== null) {
          conditions.push(`${key} = ?`);
          params.push(value);
        }
      }
    }

    // Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Add sorting
    if (options.sortBy) {
      sql += ` ORDER BY ${options.sortBy} ${options.sortOrder || 'ASC'}`;
    }

    // Add pagination
    if (options.page && options.limit) {
      const offset = (options.page - 1) * options.limit;
      sql += ` LIMIT ? OFFSET ?`;
      params.push(options.limit, offset);
    }

    return { sql, params };
  }

  // CRUD Operations with Tenant Isolation
  async find<T extends TenantAwareEntity>(
    table: string,
    options: QueryOptions,
    tenantId: string
  ): Promise<T[]> {
    const connection = await this.getConnection(tenantId);
    const { sql, params } = this.buildTenantQuery(table, options, tenantId);
    
    const result = await connection.query(sql, params);
    return result as T[];
  }

  async findOne<T extends TenantAwareEntity>(
    table: string,
    id: string,
    tenantId: string
  ): Promise<T | null> {
    const connection = await this.getConnection(tenantId);
    const sql = `SELECT * FROM ${table} WHERE id = ? AND tenant_id = ?`;
    const params = [id, tenantId];
    
    const result = await connection.query(sql, params);
    return result.length > 0 ? result[0] as T : null;
  }

  async create<T extends TenantAwareEntity>(
    table: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'tenantId'>,
    tenantId: string
  ): Promise<T> {
    const connection = await this.getConnection(tenantId);
    const now = new Date();
    const id = `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const insertData = {
      ...data,
      id,
      tenant_id: tenantId,
      created_at: now,
      updated_at: now
    };

    const columns = Object.keys(insertData).join(', ');
    const placeholders = Object.keys(insertData).map(() => '?').join(', ');
    const values = Object.values(insertData);

    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    await connection.query(sql, values);

    return { ...insertData, id, tenantId, createdAt: now, updatedAt: now } as unknown as T;
  }

  async update<T extends TenantAwareEntity>(
    table: string,
    id: string,
    data: Partial<T>,
    tenantId: string
  ): Promise<T | null> {
    const connection = await this.getConnection(tenantId);
    const now = new Date();
    
    const updateData = {
      ...data,
      updated_at: now
    };

    const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), id, tenantId];

    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ? AND tenant_id = ?`;
    const result = await connection.query(sql, values);

    if (result.affectedRows > 0) {
      return this.findOne<T>(table, id, tenantId);
    }

    return null;
  }

  async delete(
    table: string,
    id: string,
    tenantId: string
  ): Promise<boolean> {
    const connection = await this.getConnection(tenantId);
    const sql = `DELETE FROM ${table} WHERE id = ? AND tenant_id = ?`;
    const params = [id, tenantId];
    
    const result = await connection.query(sql, params);
    return result.affectedRows > 0;
  }

  // Schema Management
  async createTenantSchema(tenantId: string): Promise<TenantSchema> {
    const defaultSchema = this.tenantSchemas.get('default');
    if (!defaultSchema) {
      throw new Error('Default schema not found');
    }

    const tenantSchema: TenantSchema = {
      ...defaultSchema,
      id: `schema_${tenantId}`,
      tenantId,
      name: `Schema for ${tenantId}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tenantSchemas.set(tenantId, tenantSchema);
    
    // In a real implementation, this would create the actual database schema
    await this.createDatabaseTables(tenantId, tenantSchema);
    
    return tenantSchema;
  }

  private async createDatabaseTables(tenantId: string, schema: TenantSchema): Promise<void> {
    const connection = await this.getConnection(tenantId);
    
    for (const table of schema.tables) {
      const createTableSQL = this.generateCreateTableSQL(table);
      await connection.query(createTableSQL);
    }
  }

  private generateCreateTableSQL(table: any): string {
    const columns = table.columns.map((col: any) => {
      let columnDef = `${col.name} ${col.type}`;
      if (!col.nullable) columnDef += ' NOT NULL';
      if (col.defaultValue !== undefined) columnDef += ` DEFAULT ${col.defaultValue}`;
      if (col.isPrimary) columnDef += ' PRIMARY KEY';
      return columnDef;
    }).join(', ');

    const indexes = table.indexes.map((idx: any) => {
      const unique = idx.unique ? 'UNIQUE ' : '';
      return `CREATE ${unique}INDEX ${idx.name} ON ${table.name} (${idx.columns.join(', ')})`;
    }).join('; ');

    const constraints = table.constraints.map((constraint: any) => {
      return `CONSTRAINT ${constraint.name} ${constraint.definition}`;
    }).join(', ');

    let sql = `CREATE TABLE ${table.name} (${columns}`;
    if (constraints) sql += `, ${constraints}`;
    sql += ')';

    if (indexes) sql += `; ${indexes}`;
    
    return sql;
  }

  // Migration Management
  async runMigration(tenantId: string, migration: any): Promise<boolean> {
    const connection = await this.getConnection(tenantId);
    
    try {
      await connection.query(migration.sql);
      
      // Record migration
      const schema = this.tenantSchemas.get(tenantId);
      if (schema) {
        schema.migrations.push({
          ...migration,
          appliedAt: new Date()
        });
        schema.updatedAt = new Date();
      }
      
      return true;
    } catch (error) {
      console.error(`Migration failed for tenant ${tenantId}:`, error);
      return false;
    }
  }

  // Database Health and Monitoring
  async checkDatabaseHealth(tenantId: string): Promise<{
    status: 'healthy' | 'warning' | 'error';
    message: string;
    metrics: Record<string, any>;
  }> {
    const connection = await this.getConnection(tenantId);
    
    try {
      // Simulate health check
      await connection.query('SELECT 1');
      
      return {
        status: 'healthy',
        message: 'Database connection is healthy',
        metrics: {
          connectionPoolSize: this.connectionPool.size,
          activeConnections: Array.from(this.connectionPool.values()).filter(c => c.isConnected).length,
          lastHealthCheck: new Date()
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        metrics: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  // Connection Pool Management
  async closeConnection(tenantId: string): Promise<void> {
    const connection = this.connectionPool.get(tenantId);
    if (connection) {
      connection.isConnected = false;
      this.connectionPool.delete(tenantId);
    }
  }

  async closeAllConnections(): Promise<void> {
    const tenantIds = Array.from(this.connectionPool.keys());
    for (const tenantId of tenantIds) {
      await this.closeConnection(tenantId);
    }
  }

  // Utility Methods
  getConnectionPoolSize(): number {
    return this.connectionPool.size;
  }

  getActiveConnections(): string[] {
    return Array.from(this.connectionPool.keys());
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance(); 