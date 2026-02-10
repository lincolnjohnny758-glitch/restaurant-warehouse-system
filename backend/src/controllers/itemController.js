const db = require('../config/database');

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await db.all(`
      SELECT i.*, c.name as category_name 
      FROM items i 
      LEFT JOIN categories c ON i.category_id = c.id 
      ORDER BY i.name
    `);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const items = await db.all(`
      SELECT i.*, c.name as category_name 
      FROM items i 
      LEFT JOIN categories c ON i.category_id = c.id 
      WHERE i.current_stock <= i.par_level
      ORDER BY i.current_stock ASC
    `);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new item
exports.createItem = async (req, res) => {
  try {
    const { name, category_id, unit, par_level, current_stock } = req.body;
    
    const result = await db.run(
      'INSERT INTO items (name, category_id, unit, par_level, current_stock) VALUES (?, ?, ?, ?, ?)',
      [name, category_id, unit, par_level, current_stock]
    );
    
    res.json({ success: true, data: { id: result.lastID } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;
