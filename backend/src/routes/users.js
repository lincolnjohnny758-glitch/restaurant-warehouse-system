const express = require('express');
const router = express.Router();
const { runQuery } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const users = await runQuery('SELECT id, username, full_name, role, department, email, phone FROM users WHERE is_active = 1');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ' });
  }
});

module.exports = router;
