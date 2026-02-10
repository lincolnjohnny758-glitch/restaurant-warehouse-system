const db = require('../config/database');

// Get all requests with filters
exports.getAllRequests = async (req, res) => {
  try {
    const { status, department, from_date, to_date } = req.query;
    let query = 'SELECT r.*, u.full_name as requester_name, d.name as department_name FROM requests r JOIN users u ON r.requester_id = u.id JOIN departments d ON r.department_id = d.id WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }
    if (department) {
      query += ' AND r.department_id = ?';
      params.push(department);
    }
    if (from_date) {
      query += ' AND r.created_at >= ?';
      params.push(from_date);
    }
    if (to_date) {
      query += ' AND r.created_at <= ?';
      params.push(to_date);
    }

    query += ' ORDER BY r.created_at DESC';
    
    const requests = await db.all(query, params);
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new request
exports.createRequest = async (req, res) => {
  try {
    const { requester_id, department_id, priority, notes, items } = req.body;
    
    const result = await db.run(
      'INSERT INTO requests (requester_id, department_id, priority, notes, status) VALUES (?, ?, ?, ?, "pending")',
      [requester_id, department_id, priority, notes]
    );
    
    const requestId = result.lastID;
    
    // Insert request items
    for (const item of items) {
      await db.run(
        'INSERT INTO request_items (request_id, item_id, quantity_requested) VALUES (?, ?, ?)',
        [requestId, item.item_id, item.quantity]
      );
    }
    
    res.json({ success: true, data: { id: requestId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve request
exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { approver_id, notes } = req.body;
    
    await db.run(
      'UPDATE requests SET status = "approved", approved_by = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?',
      [approver_id, id]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject request  
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { approver_id, notes } = req.body;
    
    await db.run(
      'UPDATE requests SET status = "rejected", approved_by = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?',
      [approver_id, id]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;
