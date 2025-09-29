import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Database } from './sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize DB
const db = new Database(path.join(__dirname, '../data/app.db'));
await db.initialize();

// Controller routes
import itemsRouter from './views/items.controller.js';
app.use('/api/items', itemsRouter(db));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


