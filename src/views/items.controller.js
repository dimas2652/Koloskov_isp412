import express from 'express';

export default function itemsRouter(db) {
  const router = express.Router();

  // Get all
  router.get('/', async (_req, res) => {
    try {
      const items = await db.listItems();
      res.json(items);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Get one
  router.get('/:id', async (req, res) => {
    try {
      const item = await db.getItem(Number(req.params.id));
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Create
  router.post('/', async (req, res) => {
    try {
      const { title, description } = req.body || {};
      if (!title) return res.status(400).json({ error: 'title is required' });
      const item = await db.createItem({ title, description });
      res.status(201).json(item);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Update
  router.put('/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const existing = await db.getItem(id);
      if (!existing) return res.status(404).json({ error: 'Not found' });
      const { title, description } = req.body || {};
      if (!title) return res.status(400).json({ error: 'title is required' });
      const updated = await db.updateItem(id, { title, description });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Delete
  router.delete('/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const result = await db.deleteItem(id);
      if (!result.deleted) return res.status(404).json({ error: 'Not found' });
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}


