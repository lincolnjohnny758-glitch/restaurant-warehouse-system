const express = require('express');
const router = express.Router();
const { runQuery, runStatement } = require('../config/database');

// Get all requests
router.get('/', async (req, res) => {
  try {
    const { status, department } = req.query;
    let query = `
      SELECT r.*, u.full_name as requester_name, u.department
      FROM requests r
      JOIN users u ON r.requester_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }
    if (department) {
      query += ' AND u.department = ?';
      params.push(department);
    }

    query += ' ORDER BY r.created_at DESC';
    const requests = await runQuery(query, params);
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في جلب الطلبات' });
  }
});

// Get single request with items
router.get('/:id', async (req, res) => {
  try {
    const requests = await runQuery(
      `SELECT r.*, u.full_name as requester_name 
       FROM requests r 
       JOIN users u ON r.requester_id = u.id 
       WHERE r.id = ?`,
      [req.params.id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    }

    const items = await runQuery(
      `SELECT ri.*, i.name, i.name_en, i.unit 
       FROM request_items ri 
       JOIN items i ON ri.item_id = i.id 
       WHERE ri.request_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...requests[0], items } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في جلب الطلب' });
  }
});

// Create new request
router.post('/', async (req, res) => {
  try {
    const { requester_id, department, priority, notes, items } = req.body;
    const requestNumber = `REQ-${new Date().getFullYear()}-${Date.now()}`;

    const result = await runStatement(
      `INSERT INTO requests (request_number, requester_id, department, priority, notes) 
       VALUES (?, ?, ?, ?, ?)`,
      [requestNumber, requester_id, department, priority || 'normal', notes]
    );

    if (items && items.length > 0) {
      for (const item of items) {
        await runStatement(
          `INSERT INTO request_items (request_id, item_id, quantity_requested, unit) 
           VALUES (?, ?, ?, ?)`,
          [result.id, item.item_id, item.quantity, item.unit]
        );
      }
    }

    res.json({ success: true, message: 'تم إنشاء الطلب بنجاح', id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في إنشاء الطلب' });
  }
});

// Update request status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, approved_by } = req.body;
    await runStatement(
      'UPDATE requests SET status = ?, approved_by = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, approved_by, req.params.id]
    );
    res.json({ success: true, message: 'تم تحديث حالة الطلب' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في تحديث الطلب' });
  }
});

module.exports = router;
