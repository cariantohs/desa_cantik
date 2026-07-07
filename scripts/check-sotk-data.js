import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Missing DATABASE_URL in environment. Aborting.');
    process.exit(1);
  }

  let conn;
  try {
    conn = await mysql.createConnection({ uri: databaseUrl });
    console.log('Connected. Fetching jabatan_sotk...');
    const [jabatanRows] = await conn.query('SELECT id, nama_jabatan, pejabat_nama, parent_id, urutan FROM jabatan_sotk ORDER BY urutan, id');
    console.table(jabatanRows);

    console.log('Fetching dusun_sotk...');
    const [dusunRows] = await conn.query('SELECT id, nama_dusun, kepala, urutan FROM dusun_sotk ORDER BY urutan, id');
    console.table(dusunRows);
  } catch (err) {
    console.error('Check failed:', err);
    process.exitCode = 1;
  } finally {
    if (conn) await conn.end();
  }
}

run();
