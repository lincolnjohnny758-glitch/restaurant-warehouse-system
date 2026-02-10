const express = require('express');
const router = express.Router();
const { runQuery } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const items = await runQuery('SELECT i.*, c.name as category_name FROM items i JOIN categories c ON i.category_id = c.id WHERE i.is_active = 1');
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الأصناف' });
  }
});

router.get('/low-stock', async (req, res) => {
  try {
    const items = await runQuery('SELECT * FROM low_stock_items');
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ' });
  }
});

module.exports = router;
