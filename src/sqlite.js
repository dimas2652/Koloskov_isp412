import sqlite3 from 'sqlite3';
import fs from 'fs';

sqlite3.verbose();

export class Database {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
  }

  async initialize() {
    await fs.promises.mkdir(this._dirOf(this.dbPath), { recursive: true });
    this.db = await this._open(this.dbPath);
    await this._run(`CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }

  _dirOf(filePath) {
    return filePath.substring(0, Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\')));
  }

  _open(filename) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(filename, (err) => {
        if (err) return reject(err);
        resolve(db);
      });
    });
  }

  _run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  _get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  _all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  // CRUD helpers
  async listItems() {
    return this._all('SELECT * FROM items ORDER BY id DESC');
  }

  async getItem(id) {
    return this._get('SELECT * FROM items WHERE id = ?', [id]);
  }

  async createItem({ title, description }) {
    const result = await this._run('INSERT INTO items (title, description) VALUES (?, ?)', [title, description ?? null]);
    return this.getItem(result.lastID);
  }

  async updateItem(id, { title, description }) {
    await this._run('UPDATE items SET title = ?, description = ? WHERE id = ?', [title, description ?? null, id]);
    return this.getItem(id);
  }

  async deleteItem(id) {
    const existing = await this.getItem(id);
    if (!existing) return { deleted: false };
    const result = await this._run('DELETE FROM items WHERE id = ?', [id]);
    return { deleted: result.changes > 0 };
  }
}


