import sqlite3 from "sqlite3";
import { open } from "sqlite";

const db = await open ({
    filename:"./dev.db",
    driver: sqlite3.Database,
});

await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

await db.exec (`
     CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT,
    completed BOOLEAN DEFAULT 0,
    userId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

export default db;