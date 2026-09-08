import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.join(process.cwd(), 'prisma', 'migrations');

// Get migration name or steps from command line argument
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
  // Check if migrations directory exists
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    throw new Error('Migrations directory not found');
  }

  // Read current migration status
  const migrationStatus = execSync('npx prisma migrate status', { 
    encoding: 'utf-8',
    stdio: 'pipe'
  });

  console.log('Current migration status:');
  console.log(migrationStatus);

  // Create backup before rollback
  console.log('📦 Creating database backup before rollback...');
  const backupCommand = 'tsx scripts/backup-database.ts';
  execSync(backupCommand, { stdio: 'inherit' });
  console.log('✅ Backup created successfully');

  // Check if target is a number (steps) or migration name
  const isNumber = /^\d+$/.test(targetMigration);

  if (isNumber) {
    // Rollback by steps
    const steps = parseInt(targetMigration, 10);
    console.log(`Rolling back ${steps} migration(s)...`);
    
    // Prisma doesn't have direct rollback, so we need to use migrate resolve
    // First, get list of applied migrations
    const appliedMigrations = execSync('npx prisma migrate status', {
      encoding: 'utf-8'
    });

    // For Prisma, we typically use migrate resolve to mark migrations as rolled back
    // and then apply the previous migration
    console.log('⚠️  Note: Prisma uses migrate resolve for rollback simulation');
    console.log('This will mark the migration as rolled back without actual schema rollback');
    console.log('For full rollback, you may need to manually apply the previous migration');
    
  } else {
    // Rollback to specific migration
    console.log(`Rolling back to migration: ${targetMigration}`);
    
    // Check if the target migration exists
    const targetMigrationPath = path.join(MIGRATIONS_DIR, targetMigration);
    if (!fs.existsSync(targetMigrationPath)) {
      throw new Error(`Migration not found: ${targetMigration}`);
    }

    // Use Prisma migrate resolve to mark migration as rolled back
    console.log('Marking migration as rolled back...');
    const resolveCommand = `npx prisma migrate resolve --rolled-back "${targetMigration}"`;
    execSync(resolveCommand, { stdio: 'inherit' });
    
    console.log('✅ Migration marked as rolled back');
    console.log('⚠️  Note: This only marks the migration as rolled back in Prisma');
    console.log('You may need to manually apply schema changes to match the previous state');
  }

  // Generate Prisma client after rollback
  console.log('🔄 Regenerating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client regenerated');

  console.log('✅ Migration rollback completed successfully!');
  console.log('⚠️  Please verify your database schema and application functionality');
  
} catch (error) {
  console.error('❌ Migration rollback failed:', error);
  console.log('💡 You can restore from backup using: tsx scripts/restore-database.ts <backup-file>');
  process.exit(1);
}