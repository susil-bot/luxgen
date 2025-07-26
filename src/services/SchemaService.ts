import { 
  TenantSchema, 
  SchemaTable, 
  SchemaColumn, 
  SchemaIndex, 
  SchemaConstraint, 
  SchemaMigration,
  TenantId
} from '../types/multiTenancy';

// Schema Service for Multi-Tenancy
export class SchemaService {
  private static instance: SchemaService;
  private schemas: Map<string, TenantSchema> = new Map();
  private migrations: Map<string, SchemaMigration[]> = new Map();
  private schemaVersions: Map<string, string[]> = new Map();

  private constructor() {
    this.initializeDefaultSchemas();
  }

  static getInstance(): SchemaService {
    if (!SchemaService.instance) {
      SchemaService.instance = new SchemaService();
    }
    return SchemaService.instance;
  }

  // Initialize default schemas
  private initializeDefaultSchemas(): void {
    const defaultSchema: TenantSchema = {
      id: 'default_schema_v1',
      tenantId: 'default',
      name: 'Default Schema v1.0',
      version: '1.0.0',
      tables: this.getDefaultTables(),
      migrations: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.schemas.set('default', defaultSchema);
    this.schemaVersions.set('default', ['1.0.0']);
  }

  private getDefaultTables(): SchemaTable[] {
    return [
      {
        name: 'tenants',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, isPrimary: true, isUnique: true, isIndexed: true },
          { name: 'name', type: 'varchar(255)', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
          { name: 'slug', type: 'varchar(100)', nullable: false, isPrimary: false, isUnique: true, isIndexed: true },
          { name: 'status', type: 'varchar(50)', nullable: false, defaultValue: 'active', isPrimary: false, isUnique: false, isIndexed: true },
          { name: 'created_at', type: 'timestamp', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
          { name: 'updated_at', type: 'timestamp', nullable: false, isPrimary: false, isUnique: false, isIndexed: false }
        ],
        indexes: [
          { name: 'idx_tenants_slug', columns: ['slug'], type: 'btree', unique: true },
          { name: 'idx_tenants_status', columns: ['status'], type: 'btree', unique: false }
        ],
        constraints: []
      },
      {
        name: 'tenant_users',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, isPrimary: true, isUnique: true, isIndexed: true },
          { name: 'tenant_id', type: 'uuid', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
          { name: 'user_id', type: 'uuid', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
          { name: 'role_id', type: 'uuid', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
          { name: 'status', type: 'varchar(50)', nullable: false, defaultValue: 'active', isPrimary: false, isUnique: false, isIndexed: true },
          { name: 'joined_at', type: 'timestamp', nullable: false, isPrimary: false, isUnique: false, isIndexed: true },
          { name: 'last_active_at', type: 'timestamp', nullable: true, isPrimary: false, isUnique: false, isIndexed: true }
        ],
        indexes: [
          { name: 'idx_tenant_users_tenant_id', columns: ['tenant_id'], type: 'btree', unique: false },
          { name: 'idx_tenant_users_user_id', columns: ['user_id'], type: 'btree', unique: false },
          { name: 'idx_tenant_users_role_id', columns: ['role_id'], type: 'btree', unique: false }
        ],
        constraints: [
          { name: 'fk_tenant_users_tenant', type: 'foreign_key', definition: 'FOREIGN KEY (tenant_id) REFERENCES tenants(id)' },
          { name: 'fk_tenant_users_user', type: 'foreign_key', definition: 'FOREIGN KEY (user_id) REFERENCES users(id)' },
          { name: 'fk_tenant_users_role', type: 'foreign_key', definition: 'FOREIGN KEY (role_id) REFERENCES tenant_roles(id)' }
        ]
      }
    ];
  }

  // Schema Management
  async createTenantSchema(tenantId: string, baseSchemaId?: string): Promise<TenantSchema> {
    const baseSchema = baseSchemaId ? this.schemas.get(baseSchemaId) : this.schemas.get('default');
    if (!baseSchema) {
      throw new Error('Base schema not found');
    }

    const newSchema: TenantSchema = {
      id: `schema_${tenantId}_v1`,
      tenantId,
      name: `Schema for ${tenantId}`,
      version: '1.0.0',
      tables: [...baseSchema.tables],
      migrations: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.schemas.set(tenantId, newSchema);
    this.schemaVersions.set(tenantId, ['1.0.0']);

    // Create initial migration
    const initialMigration: SchemaMigration = {
      id: `migration_${tenantId}_v1_initial`,
      version: '1.0.0',
      name: 'Initial Schema Creation',
      sql: this.generateCreateSchemaSQL(newSchema),
      appliedAt: new Date(),
      checksum: this.generateChecksum(newSchema)
    };

    newSchema.migrations.push(initialMigration);
    this.migrations.set(tenantId, [initialMigration]);

    return newSchema;
  }

  getTenantSchema(tenantId: string): TenantSchema | null {
    return this.schemas.get(tenantId) || null;
  }

  getAllSchemas(): TenantSchema[] {
    return Array.from(this.schemas.values());
  }

  // Table Management
  async addTable(
    tenantId: string,
    table: Omit<SchemaTable, 'name'> & { name: string }
  ): Promise<SchemaTable> {
    const schema = this.schemas.get(tenantId);
    if (!schema) {
      throw new Error('Schema not found for tenant');
    }

    // Validate table name
    if (schema.tables.some(t => t.name === table.name)) {
      throw new Error(`Table ${table.name} already exists`);
    }

    // Add table to schema
    schema.tables.push(table);
    schema.updatedAt = new Date();

    // Create migration
    const migration: SchemaMigration = {
      id: `migration_${tenantId}_add_table_${table.name}`,
      version: this.incrementVersion(schema.version),
      name: `Add table ${table.name}`,
      sql: this.generateCreateTableSQL(table),
      appliedAt: new Date(),
      checksum: this.generateChecksum(schema)
    };

    schema.migrations.push(migration);
    schema.version = migration.version;
    this.schemaVersions.get(tenantId)?.push(migration.version);

    return table;
  }

  async modifyTable(
    tenantId: string,
    tableName: string,
    modifications: {
      addColumns?: SchemaColumn[];
      dropColumns?: string[];
      modifyColumns?: { name: string; column: SchemaColumn }[];
      addIndexes?: SchemaIndex[];
      dropIndexes?: string[];
      addConstraints?: SchemaConstraint[];
      dropConstraints?: string[];
    }
  ): Promise<SchemaTable | null> {
    const schema = this.schemas.get(tenantId);
    if (!schema) {
      throw new Error('Schema not found for tenant');
    }

    const tableIndex = schema.tables.findIndex(t => t.name === tableName);
    if (tableIndex === -1) {
      throw new Error(`Table ${tableName} not found`);
    }

    const table = schema.tables[tableIndex];
    const originalTable = { ...table };

    // Apply modifications
    if (modifications.addColumns) {
      table.columns.push(...modifications.addColumns);
    }

    if (modifications.dropColumns) {
      table.columns = table.columns.filter(col => !modifications.dropColumns!.includes(col.name));
    }

    if (modifications.modifyColumns) {
      for (const { name, column } of modifications.modifyColumns) {
        const colIndex = table.columns.findIndex(col => col.name === name);
        if (colIndex !== -1) {
          table.columns[colIndex] = column;
        }
      }
    }

    if (modifications.addIndexes) {
      table.indexes.push(...modifications.addIndexes);
    }

    if (modifications.dropIndexes) {
      table.indexes = table.indexes.filter(idx => !modifications.dropIndexes!.includes(idx.name));
    }

    if (modifications.addConstraints) {
      table.constraints.push(...modifications.addConstraints);
    }

    if (modifications.dropConstraints) {
      table.constraints = table.constraints.filter(constraint => 
        !modifications.dropConstraints!.includes(constraint.name)
      );
    }

    // Create migration
    const migration: SchemaMigration = {
      id: `migration_${tenantId}_modify_table_${tableName}`,
      version: this.incrementVersion(schema.version),
      name: `Modify table ${tableName}`,
      sql: this.generateModifyTableSQL(tableName, modifications, originalTable),
      appliedAt: new Date(),
      checksum: this.generateChecksum(schema)
    };

    schema.migrations.push(migration);
    schema.version = migration.version;
    schema.updatedAt = new Date();
    this.schemaVersions.get(tenantId)?.push(migration.version);

    return table;
  }

  async dropTable(tenantId: string, tableName: string): Promise<boolean> {
    const schema = this.schemas.get(tenantId);
    if (!schema) {
      throw new Error('Schema not found for tenant');
    }

    const tableIndex = schema.tables.findIndex(t => t.name === tableName);
    if (tableIndex === -1) {
      return false;
    }

    const table = schema.tables[tableIndex];
    schema.tables.splice(tableIndex, 1);

    // Create migration
    const migration: SchemaMigration = {
      id: `migration_${tenantId}_drop_table_${tableName}`,
      version: this.incrementVersion(schema.version),
      name: `Drop table ${tableName}`,
      sql: `DROP TABLE IF EXISTS ${tableName};`,
      appliedAt: new Date(),
      checksum: this.generateChecksum(schema)
    };

    schema.migrations.push(migration);
    schema.version = migration.version;
    schema.updatedAt = new Date();
    this.schemaVersions.get(tenantId)?.push(migration.version);

    return true;
  }

  // Migration Management
  async runMigration(tenantId: string, migration: SchemaMigration): Promise<boolean> {
    try {
      // In a real implementation, this would execute the SQL against the database
      console.log(`Running migration for tenant ${tenantId}:`, migration.name);
      
      const schema = this.schemas.get(tenantId);
      if (schema) {
        schema.migrations.push(migration);
        schema.version = migration.version;
        schema.updatedAt = new Date();
      }

      const tenantMigrations = this.migrations.get(tenantId) || [];
      tenantMigrations.push(migration);
      this.migrations.set(tenantId, tenantMigrations);

      return true;
    } catch (error) {
      console.error(`Migration failed for tenant ${tenantId}:`, error);
      return false;
    }
  }

  async rollbackMigration(tenantId: string, version: string): Promise<boolean> {
    const schema = this.schemas.get(tenantId);
    if (!schema) {
      throw new Error('Schema not found for tenant');
    }

    const migrationIndex = schema.migrations.findIndex(m => m.version === version);
    if (migrationIndex === -1) {
      throw new Error(`Migration version ${version} not found`);
    }

    // Remove migration and revert schema
    const migration = schema.migrations[migrationIndex];
    schema.migrations.splice(migrationIndex, 1);

    // In a real implementation, this would execute rollback SQL
    console.log(`Rolling back migration for tenant ${tenantId}:`, migration.name);

    // Update schema version to previous migration
    if (schema.migrations.length > 0) {
      schema.version = schema.migrations[schema.migrations.length - 1].version;
    } else {
      schema.version = '1.0.0';
    }

    schema.updatedAt = new Date();
    return true;
  }

  getMigrations(tenantId: string): SchemaMigration[] {
    return this.migrations.get(tenantId) || [];
  }

  // Schema Validation
  validateSchema(schema: TenantSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for duplicate table names
    const tableNames = schema.tables.map(t => t.name);
    const duplicateTables = tableNames.filter((name, index) => tableNames.indexOf(name) !== index);
    if (duplicateTables.length > 0) {
      errors.push(`Duplicate table names: ${duplicateTables.join(', ')}`);
    }

    // Check for duplicate column names within tables
    for (const table of schema.tables) {
      const columnNames = table.columns.map(c => c.name);
      const duplicateColumns = columnNames.filter((name, index) => columnNames.indexOf(name) !== index);
      if (duplicateColumns.length > 0) {
        errors.push(`Duplicate column names in table ${table.name}: ${duplicateColumns.join(', ')}`);
      }
    }

    // Check for valid foreign key references
    for (const table of schema.tables) {
      for (const constraint of table.constraints) {
        if (constraint.type === 'foreign_key') {
          // This would validate that referenced tables and columns exist
          // For now, we'll just check basic syntax
          if (!constraint.definition.includes('REFERENCES')) {
            errors.push(`Invalid foreign key constraint in table ${table.name}: ${constraint.name}`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Schema Comparison
  compareSchemas(schema1: TenantSchema, schema2: TenantSchema): {
    added: SchemaTable[];
    removed: SchemaTable[];
    modified: { table: string; changes: any[] }[];
  } {
    const added: SchemaTable[] = [];
    const removed: SchemaTable[] = [];
    const modified: { table: string; changes: any[] }[] = [];

    // Find added and removed tables
    const tables1 = new Map(schema1.tables.map(t => [t.name, t]));
    const tables2 = new Map(schema2.tables.map(t => [t.name, t]));

    const tables2Entries = Array.from(tables2.entries());
    for (const [name, table] of tables2Entries) {
      if (!tables1.has(name)) {
        added.push(table);
      }
    }

    const tables1Entries = Array.from(tables1.entries());
    for (const [name, table] of tables1Entries) {
      if (!tables2.has(name)) {
        removed.push(table);
      }
    }

    // Find modified tables
    for (const [name, table1] of tables1Entries) {
      const table2 = tables2.get(name);
      if (table2) {
        const changes = this.compareTables(table1, table2);
        if (changes.length > 0) {
          modified.push({ table: name, changes });
        }
      }
    }

    return { added, removed, modified };
  }

  private compareTables(table1: SchemaTable, table2: SchemaTable): any[] {
    const changes: any[] = [];

    // Compare columns
    const columns1 = new Map(table1.columns.map(c => [c.name, c]));
    const columns2 = new Map(table2.columns.map(c => [c.name, c]));

    const columns2Entries = Array.from(columns2.entries());
    for (const [name, column2] of columns2Entries) {
      const column1 = columns1.get(name);
      if (!column1) {
        changes.push({ type: 'column_added', column: name });
      } else if (JSON.stringify(column1) !== JSON.stringify(column2)) {
        changes.push({ type: 'column_modified', column: name });
      }
    }

    const columns1Entries = Array.from(columns1.entries());
    for (const [name] of columns1Entries) {
      if (!columns2.has(name)) {
        changes.push({ type: 'column_removed', column: name });
      }
    }

    return changes;
  }

  // SQL Generation
  private generateCreateSchemaSQL(schema: TenantSchema): string {
    const tableSQLs = schema.tables.map(table => this.generateCreateTableSQL(table));
    return tableSQLs.join(';\n\n');
  }

  private generateCreateTableSQL(table: SchemaTable): string {
    const columns = table.columns.map(col => {
      let columnDef = `${col.name} ${col.type}`;
      if (!col.nullable) columnDef += ' NOT NULL';
      if (col.defaultValue !== undefined) columnDef += ` DEFAULT ${col.defaultValue}`;
      if (col.isPrimary) columnDef += ' PRIMARY KEY';
      return columnDef;
    }).join(',\n  ');

    const constraints = table.constraints.map(constraint => {
      return `CONSTRAINT ${constraint.name} ${constraint.definition}`;
    }).join(',\n  ');

    let sql = `CREATE TABLE ${table.name} (\n  ${columns}`;
    if (constraints) sql += `,\n  ${constraints}`;
    sql += '\n);';

    // Add indexes
    const indexes = table.indexes.map(idx => {
      const unique = idx.unique ? 'UNIQUE ' : '';
      return `CREATE ${unique}INDEX ${idx.name} ON ${table.name} (${idx.columns.join(', ')});`;
    });

    if (indexes.length > 0) {
      sql += '\n\n' + indexes.join('\n');
    }

    return sql;
  }

  private generateModifyTableSQL(
    tableName: string,
    modifications: any,
    originalTable: SchemaTable
  ): string {
    const sqlParts: string[] = [];

    if (modifications.addColumns) {
      for (const column of modifications.addColumns) {
        let columnDef = `ADD COLUMN ${column.name} ${column.type}`;
        if (!column.nullable) columnDef += ' NOT NULL';
        if (column.defaultValue !== undefined) columnDef += ` DEFAULT ${column.defaultValue}`;
        sqlParts.push(`ALTER TABLE ${tableName} ${columnDef};`);
      }
    }

    if (modifications.dropColumns) {
      for (const columnName of modifications.dropColumns) {
        sqlParts.push(`ALTER TABLE ${tableName} DROP COLUMN ${columnName};`);
      }
    }

    if (modifications.addIndexes) {
      for (const index of modifications.addIndexes) {
        const unique = index.unique ? 'UNIQUE ' : '';
        sqlParts.push(`CREATE ${unique}INDEX ${index.name} ON ${tableName} (${index.columns.join(', ')});`);
      }
    }

    if (modifications.dropIndexes) {
      for (const indexName of modifications.dropIndexes) {
        sqlParts.push(`DROP INDEX ${indexName};`);
      }
    }

    return sqlParts.join('\n');
  }

  // Utility Methods
  private incrementVersion(version: string): string {
    const parts = version.split('.');
    const major = parseInt(parts[0]);
    const minor = parseInt(parts[1]);
    const patch = parseInt(parts[2]) + 1;
    return `${major}.${minor}.${patch}`;
  }

  private generateChecksum(schema: TenantSchema): string {
    // Simple checksum generation for schema validation
    const schemaString = JSON.stringify(schema, null, 2);
    let hash = 0;
    for (let i = 0; i < schemaString.length; i++) {
      const char = schemaString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  // Schema Export and Import
  exportSchema(tenantId: string): string {
    const schema = this.schemas.get(tenantId);
    if (!schema) {
      throw new Error('Schema not found');
    }

    return JSON.stringify(schema, null, 2);
  }

  importSchema(jsonData: string, tenantId: string): TenantSchema {
    try {
      const schemaData = JSON.parse(jsonData);
      const { id, createdAt, updatedAt, ...importData } = schemaData;
      
      const schema: TenantSchema = {
        ...importData,
        id: `schema_${tenantId}_imported`,
        tenantId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Validate imported schema
      const validation = this.validateSchema(schema);
      if (!validation.valid) {
        throw new Error(`Invalid schema: ${validation.errors.join(', ')}`);
      }

      this.schemas.set(tenantId, schema);
      return schema;
    } catch (error) {
      throw new Error('Invalid schema JSON data');
    }
  }
}

// Export singleton instance
export const schemaService = SchemaService.getInstance(); 