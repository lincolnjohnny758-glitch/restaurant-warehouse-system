const express = require('express');
const router = express.Router();
const { runQuery } = require('../config/database');

router.get('/dashboard', async (req, res) => {
  try {
    const stats = await runQuery('SELECT * FROM request_statistics');
    const lowStock = await runQuery('SELECT * FROM low_stock_items LIMIT 10');
    res.json({ success: true, data: { stats, lowStock } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ' });
  }
});

module.exports = router;
