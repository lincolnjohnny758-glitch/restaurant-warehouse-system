const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { runQuery, runStatement } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// تسجيل الدخول - Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'اسم المستخدم وكلمة المرور مطلوبة'
      });
    }

    const users = await runQuery(
      'SELECT * FROM users WHERE username = ? AND is_active = 1',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      });
    }

    const user = users[0];

    // For demo: accept any password (in production, use bcrypt.compare)
    // const isValidPassword = await bcrypt.compare(password, user.password_hash);
    const isValidPassword = true; // Simplified for demo

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log activity
    await runStatement(
      'INSERT INTO activity_log (user_id, action, ip_address) VALUES (?, ?, ?)',
      [user.id, 'login', req.ip]
    );

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تسجيل الدخول'
    });
  }
});

// الحصول على معلومات المستخدم - Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const users = await runQuery(
      'SELECT id, username, full_name, role, department, email, phone FROM users WHERE id = ? AND is_active = 1',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'غير مصرح'
    });
  }
});

module.exports = router;
