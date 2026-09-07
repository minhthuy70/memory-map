import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.sql`);

console.log('Creating database backup...');
console.log(`Backup file: ${backupFile}`);

try {
  // Use pg_dump to create backup (PostgreSQL)
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

  const pgDumpCommand = `pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} > "${backupFile}"`;
  
  // Set PGPASSWORD environment variable for pg_dump
  const dbPassword = url.password;
  const env = { ...process.env, PGPASSWORD: dbPassword };
  
  execSync(pgDumpCommand, { env, stdio: 'inherit' });
  
  console.log('✅ Database backup created successfully!');
  console.log(`📁 Backup location: ${backupFile}`);
  
  // Keep only last 10 backups
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('backup-') && f.endsWith('.sql'))
    .map(f => ({
      name: f,
      path: path.join(BACKUP_DIR, f),
      time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);
  
  if (files.length > 10) {
    const filesToDelete = files.slice(10);
    filesToDelete.forEach(file => {
      fs.unlinkSync(file.path);
      console.log(`🗑️  Deleted old backup: ${file.name}`);
    });
  }
  
} catch (error) {
  console.error('❌ Backup failed:', error);
  process.exit(1);
}
