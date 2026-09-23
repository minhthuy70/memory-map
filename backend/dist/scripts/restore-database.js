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
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const backupFile = process.argv[2];
if (!backupFile) {
    console.error('❌ Please provide a backup file path');
    console.log('Usage: tsx scripts/restore-database.ts <backup-file>');
    console.log('Example: tsx scripts/restore-database.ts backups/backup-2024-01-01.sql');
    process.exit(1);
}
const backupPath = path.resolve(backupFile);
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
    const url = new URL(databaseUrl);
    const dbName = url.pathname.slice(1);
    const dbUser = url.username;
    const dbHost = url.hostname;
    const dbPort = url.port || '5432';
    const psqlCommand = `psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} < "${backupPath}"`;
    const dbPassword = url.password;
    const env = { ...process.env, PGPASSWORD: dbPassword };
    (0, child_process_1.execSync)(psqlCommand, { env, stdio: 'inherit' });
    console.log('✅ Database restored successfully!');
    console.log(`📁 Restored from: ${backupPath}`);
}
catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
}
//# sourceMappingURL=restore-database.js.map