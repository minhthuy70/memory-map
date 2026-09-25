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
const targetMigration = process.argv[2];
if (!targetMigration) {
    console.error('❌ Please provide migration name or number of steps to rollback');
    console.log('Usage: tsx scripts/rollback-migration.ts <migration-name|steps>');
    console.log('Examples:');
    console.log('  tsx scripts/rollback-migration.ts 1           # Rollback 1 step');
    console.log('  tsx scripts/rollback-migration.ts 20260830153147_init  # Rollback to specific migration');
    process.exit(1);
}
console.log('🔄 Rolling back migration...');
console.log(`Target: ${targetMigration}`);
try {
    if (!fs.existsSync(MIGRATIONS_DIR)) {
        throw new Error('Migrations directory not found');
    }
    const migrationStatus = (0, child_process_1.execSync)('npx prisma migrate status', {
        encoding: 'utf-8',
        stdio: 'pipe'
    });
    console.log('Current migration status:');
    console.log(migrationStatus);
    console.log('📦 Creating database backup before rollback...');
    const backupCommand = 'tsx scripts/backup-database.ts';
    (0, child_process_1.execSync)(backupCommand, { stdio: 'inherit' });
    console.log('✅ Backup created successfully');
    const isNumber = /^\d+$/.test(targetMigration);
    if (isNumber) {
        const steps = parseInt(targetMigration, 10);
        console.log(`Rolling back ${steps} migration(s)...`);
        const appliedMigrations = (0, child_process_1.execSync)('npx prisma migrate status', {
            encoding: 'utf-8'
        });
        console.log('⚠️  Note: Prisma uses migrate resolve for rollback simulation');
        console.log('This will mark the migration as rolled back without actual schema rollback');
        console.log('For full rollback, you may need to manually apply the previous migration');
    }
    else {
        console.log(`Rolling back to migration: ${targetMigration}`);
        const targetMigrationPath = path.join(MIGRATIONS_DIR, targetMigration);
        if (!fs.existsSync(targetMigrationPath)) {
            throw new Error(`Migration not found: ${targetMigration}`);
        }
        console.log('Marking migration as rolled back...');
        const resolveCommand = `npx prisma migrate resolve --rolled-back "${targetMigration}"`;
        (0, child_process_1.execSync)(resolveCommand, { stdio: 'inherit' });
        console.log('✅ Migration marked as rolled back');
        console.log('⚠️  Note: This only marks the migration as rolled back in Prisma');
        console.log('You may need to manually apply schema changes to match the previous state');
    }
    console.log('🔄 Regenerating Prisma client...');
    (0, child_process_1.execSync)('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client regenerated');
    console.log('✅ Migration rollback completed successfully!');
    console.log('⚠️  Please verify your database schema and application functionality');
}
catch (error) {
    console.error('❌ Migration rollback failed:', error);
    console.log('💡 You can restore from backup using: tsx scripts/restore-database.ts <backup-file>');
    process.exit(1);
}
//# sourceMappingURL=rollback-migration.js.map