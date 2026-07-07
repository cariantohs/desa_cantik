import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Missing DATABASE_URL in environment. Aborting.');
    process.exit(1);
  }

  const sqlPath = path.resolve(process.cwd(), 'db', 'migrations', '001_add_sotk_tables.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('Migration file not found:', sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');

  let conn;
  try {
    conn = await mysql.createConnection({ uri: databaseUrl, multipleStatements: true });
    console.log('Connected to database. Executing migration...');
    const [result] = await conn.query(sql);
    console.log('Migration executed successfully.');
    console.log(result);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    if (conn) await conn.end();
  }
}

run();
