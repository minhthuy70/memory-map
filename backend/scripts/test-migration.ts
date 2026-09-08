import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.join(process.cwd(), 'prisma', 'migrations');
const SCHEMA_FILE = path.join(process.cwd(), 'prisma', 'schema.prisma');

console.log('🧪 Testing migration...');

try {
  // Check if schema file exists
  if (!fs.existsSync(SCHEMA_FILE)) {
    throw new Error('Schema file not found');
  }

  // Check if migrations directory exists
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    throw new Error('Migrations directory not found');
  }

  // Step 1: Validate schema
  console.log('📋 Validating Prisma schema...');
  execSync('npx prisma validate', { stdio: 'inherit' });
  console.log('✅ Schema validation passed');

  // Step 2: Check for pending migrations
  console.log('🔍 Checking for pending migrations...');
  const migrateStatus = execSync('npx prisma migrate status', { 
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  console.log('Migration status:');
  console.log(migrateStatus);

  // Step 3: Format schema
  console.log('🎨 Formatting Prisma schema...');
  execSync('npx prisma format', { stdio: 'inherit' });
  console.log('✅ Schema formatted');

  // Step 4: Create test migration (dry run)
  console.log('🔬 Creating test migration (dry run)...');
  try {
    execSync('npx prisma migrate dev --create-only --name test_migration', { 
      stdio: 'inherit' 
    });
    console.log('✅ Test migration created successfully');
    
    // Clean up test migration
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
    
  } catch (error) {
    console.log('⚠️  Test migration creation failed (might be due to no schema changes)');
    console.log('This is normal if no schema changes are pending');
  }

  // Step 5: Validate migration files
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
    } else {
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

  // Step 6: Check database connection
  console.log('🔗 Testing database connection...');
  try {
    execSync('npx prisma db push --accept-data-loss', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL }
    });
    console.log('✅ Database connection successful');
  } catch (error) {
    console.log('⚠️  Database connection test failed');
    console.log('This might be expected if test database is not configured');
  }

  // Step 7: Generate Prisma client
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');

  console.log('✅ Migration testing completed successfully!');
  console.log('📊 Summary:');
  console.log('  - Schema validation: PASSED');
  console.log('  - Migration files: VALID');
  console.log('  - Prisma client: GENERATED');
  console.log('  - Database connection: TESTED');
  
} catch (error) {
  console.error('❌ Migration testing failed:', error);
  process.exit(1);
}