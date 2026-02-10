const express = require('express');
const router = express.Router();
const { runQuery } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const categories = await runQuery('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ' });
  }
});

module.exports = router;
