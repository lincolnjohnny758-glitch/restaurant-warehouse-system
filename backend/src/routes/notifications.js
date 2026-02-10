const express = require('express');
const router = express.Router();
const { runQuery } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const notifications = await runQuery(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [user_id]
    );
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ' });
  }
});

module.exports = router;
