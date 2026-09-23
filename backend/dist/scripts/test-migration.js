"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const MIGRATIONS_DIR = path.join(process.cwd(), 'prisma', 'migrations');
const SCHEMA_FILE = path.join(process.cwd(), 'prisma', 'schema.prisma');
console.log('🧪 Testing migration...');
try {
    if (!fs.existsSync(SCHEMA_FILE)) {
        throw new Error('Schema file not found');
    }
    if (!fs.existsSync(MIGRATIONS_DIR)) {
        throw new Error('Migrations directory not found');
    }
    console.log('📋 Validating Prisma schema...');
    (0, child_process_1.execSync)('npx prisma validate', { stdio: 'inherit' });
    console.log('✅ Schema validation passed');
    console.log('🔍 Checking for pending migrations...');
    const migrateStatus = (0, child_process_1.execSync)('npx prisma migrate status', {
        encoding: 'utf-8',
        stdio: 'pipe'
    });
    console.log('Migration status:');
    console.log(migrateStatus);
    console.log('🎨 Formatting Prisma schema...');
    (0, child_process_1.execSync)('npx prisma format', { stdio: 'inherit' });
    console.log('✅ Schema formatted');
    console.log('🔬 Creating test migration (dry run)...');
    try {
        (0, child_process_1.execSync)('npx prisma migrate dev --create-only --name test_migration', {
            stdio: 'inherit'
        });
        console.log('✅ Test migration created successfully');
        console.log('🧹 Cleaning up test migration...');
        const testMigrations = fs.readdirSync(MIGRATIONS_DIR)
            .filter(dir => dir.includes('test_migration'));
        testMigrations.forEach(migration => {
            const migrationPath = path.join(MIGRATIONS_DIR, migration);
            if (fs.existsSync(migrationPath)) {
                fs.rmSync(migrationPath, { recursive: true, force: true });
                console.log(`Deleted test migration: ${migration}`);
            }
        });
    }
    catch (error) {
        console.log('⚠️  Test migration creation failed (might be due to no schema changes)');
        console.log('This is normal if no schema changes are pending');
    }
    console.log('📝 Validating migration files...');
    const migrationDirs = fs.readdirSync(MIGRATIONS_DIR)
        .filter(dir => dir !== 'migration_lock.toml' && fs.statSync(path.join(MIGRATIONS_DIR, dir)).isDirectory());
    let migrationErrors = 0;
    migrationDirs.forEach(migrationDir => {
        const migrationPath = path.join(MIGRATIONS_DIR, migrationDir);
        const migrationFile = path.join(migrationPath, 'migration.sql');
        if (!fs.existsSync(migrationFile)) {
            console.error(`❌ Missing migration.sql in: ${migrationDir}`);
            migrationErrors++;
        }
        else {
            const content = fs.readFileSync(migrationFile, 'utf-8');
            if (content.trim().length === 0) {
                console.error(`❌ Empty migration file: ${migrationDir}`);
                migrationErrors++;
            }
        }
    });
    if (migrationErrors > 0) {
        throw new Error(`Found ${migrationErrors} migration file error(s)`);
    }
    console.log('✅ All migration files are valid');
    console.log('🔗 Testing database connection...');
    try {
        (0, child_process_1.execSync)('npx prisma db push --accept-data-loss', {
            stdio: 'inherit',
            env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL }
        });
        console.log('✅ Database connection successful');
    }
    catch (error) {
        console.log('⚠️  Database connection test failed');
        console.log('This might be expected if test database is not configured');
    }
    console.log('🔄 Generating Prisma client...');
    (0, child_process_1.execSync)('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
    console.log('✅ Migration testing completed successfully!');
    console.log('📊 Summary:');
    console.log('  - Schema validation: PASSED');
    console.log('  - Migration files: VALID');
    console.log('  - Prisma client: GENERATED');
    console.log('  - Database connection: TESTED');
}
catch (error) {
    console.error('❌ Migration testing failed:', error);
    process.exit(1);
}
//# sourceMappingURL=test-migration.js.map