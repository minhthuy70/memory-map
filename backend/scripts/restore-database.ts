import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Get backup file from command line argument
const backupFile = process.argv[2];

if (!backupFile) {
  console.error('❌ Please provide a backup file path');
  console.log('Usage: tsx scripts/restore-database.ts <backup-file>');
  console.log('Example: tsx scripts/restore-database.ts backups/backup-2024-01-01.sql');
  process.exit(1);
}

const backupPath = path.resolve(backupFile);

// Check if backup file exists
if (!fs.existsSync(backupPath)) {
  console.error(`❌ Backup file not found: ${backupPath}`);
  process.exit(1);
}

console.log('Restoring database from backup...');
console.log(`Backup file: ${backupPath}`);

try {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Parse database URL to get connection details
  const url = new URL(databaseUrl);
  const dbName = url.pathname.slice(1);
  const dbUser = url.username;
  const dbHost = url.hostname;
  const dbPort = url.port || '5432';

  const psqlCommand = `psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} < "${backupPath}"`;
  
  // Set PGPASSWORD environment variable for psql
  const dbPassword = url.password;
  const env = { ...process.env, PGPASSWORD: dbPassword };
  
  execSync(psqlCommand, { env, stdio: 'inherit' });
  
  console.log('✅ Database restored successfully!');
  console.log(`📁 Restored from: ${backupPath}`);
  
} catch (error) {
  console.error('❌ Restore failed:', error);
  process.exit(1);
}
