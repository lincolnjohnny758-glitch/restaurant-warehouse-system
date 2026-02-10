# 🍽️ نظام إدارة المخازن والطلبات للمطاعم
Restaurant Warehouse & Orders Management System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D14.0-blue)](https://postgresql.org/)

## 📖 نظرة عامة

نظام متكامل لإدارة طلبات المخازن في المطاعم الكبيرة متعددة الأقسام. يعمل على الشبكة المحلية (LAN) بدون إنترنت، مع دعم 500+ مستخدم متزامن واستجابة فورية أقل من 200 مللي ثانية.

### ✨ المميزات الرئيسية

- 🔄 **تحديثات فورية** عبر WebSocket
- 🚀 **أداء عالي** - استجابة < 200ms
- 👥 **دعم 500+ مستخدم** متزامن
- 🌐 **دعم RTL** للغة العربية
- 📱 **واجهات متعددة** - Web Dashboard
- 🔐 **نظام صلاحيات** محكم (RBAC)
- 📊 **تقارير وتحليلات** شاملة
- 🔔 **إشعارات فورية** للطلبات
- 📦 **إدارة مخزون ذكية** مع Par Levels
- 🖨️ **طباعة فواتير** و QR Codes

## 🏗️ البنية التقنية

### Backend
- **Node.js** v18+ with Fastify
- **PostgreSQL** 14+ (Database)
- **Redis** (Caching & Sessions)
- **Socket.io** (Real-time updates)
- **JWT** (Authentication)

### Frontend
- **React** 18+ with TypeScript
- **TailwindCSS** (Styling)
- **RTL Support** (Arabic)
- **PWA** Ready

### DevOps
- **PM2** (Process Management)
- **Nginx** (Reverse Proxy)
- **Docker** Support
- **Hot Backup** System

## 📁 هيكل المشروع

```
restaurant-warehouse-system/
├── backend/               # Node.js Backend
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── models/       # Database Models
│   │   ├── routes/       # API Routes
│   │   ├── controllers/  # Business Logic
│   │   ├── middleware/   # Auth, Validation
│   │   ├── services/     # WebSocket, Notifications
│   │   └── server.js     # Main Server
│   ├── migrations/       # Database Migrations
│   └── package.json
├── frontend/             # React Frontend
│   ├── src/
│   │   ├── components/   # React Components
│   │   ├── pages/        # Page Components
│   │   ├── services/     # API Services
│   │   ├── hooks/        # Custom Hooks
│   │   └── App.tsx
│   └── package.json
├── database/             # Database Scripts
│   ├── schema.sql        # Database Schema
│   ├── seed.sql          # Sample Data
│   └── migrations/
├── docs/                 # Documentation
│   ├── API.md           # API Documentation
│   ├── DEPLOYMENT.md    # Deployment Guide
│   └── USER_GUIDE.md    # User Manual
└── README.md
```

## 🚀 البدء السريع

### المتطلبات الأساسية

- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- Redis >= 6.0
- npm or yarn

### 1. تثبيت Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run migrate
npm run seed
npm start
```

### 2. تثبيت Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm start
```

### 3. تهيئة قاعدة البيانات

```bash
psql -U postgres
CREATE DATABASE restaurant_warehouse;
\c restaurant_warehouse
\i database/schema.sql
\i database/seed.sql
```

## 📚 الوثائق

- [📖 API Documentation](docs/API.md)
- [🚀 Deployment Guide](docs/DEPLOYMENT.md)
- [👤 User Guide](docs/USER_GUIDE.md)
- [🗄️ Database Schema](docs/DATABASE.md)

## 🎯 الأدوار والصلاحيات

| الدور | الصلاحيات |
|-------|----------|
| 👤 **Requester** | إنشاء طلبات، عرض طلباتهم فقط |
| 📦 **Warehouse** | استقبال وتجهيز الطلبات، إدارة المخزون |
| 👔 **Manager** | الموافقة/الرفض، عرض التقارير |
| 🛡️ **Security** | مراجعة الفواتير، مسح QR Codes |
| ⚡ **Admin** | صلاحيات كاملة، الإعدادات، التحليلات |

## 🔄 سير العمل

1. **إنشاء الطلب** → الموظف يطلب أصناف
2. **التحقق التلقائي** → النظام يطبق قواعد الموافقة
3. **الموافقة** → مدير يوافق/يرفض
4. **التجهيز** → المخزن يجهز الطلب
5. **التسليم** → القسم يستلم
6. **تحديث المخزون** → خصم تلقائي + تنبيهات

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Requests
```
GET    /api/requests
POST   /api/requests
GET    /api/requests/:id
POST   /api/requests/:id/approve
POST   /api/requests/:id/reject
POST   /api/requests/:id/prepare
POST   /api/requests/:id/ready
POST   /api/requests/:id/deliver
```

### Items & Inventory
```
GET    /api/items
POST   /api/items
GET    /api/items/low-stock
GET    /api/inventory
POST   /api/inventory/transaction
```

### Reports
```
GET    /api/reports/daily
GET    /api/reports/weekly
GET    /api/reports/top-items
GET    /api/reports/performance
```

## 🔐 الأمان

- ✅ JWT Authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Password Hashing (bcrypt)
- ✅ PIN Code Support
- ✅ Comprehensive Audit Logging
- ✅ SQL Injection Protection
- ✅ XSS Protection

## 📊 Database Schema

### الجداول الرئيسية

- `users` - المستخدمون
- `departments` - الأقسام
- `items` - الأصناف
- `categories` - الفئات
- `requests` - الطلبات
- `request_items` - تفاصيل الطلبات
- `inventory_transactions` - حركة المخزون
- `approvals` - الموافقات
- `notifications` - الإشعارات
- `audit_logs` - سجل الأحداث

## 🛠️ الإعداد للإنتاج

### Using PM2

```bash
npm install -g pm2
pm2 start backend/src/server.js --name restaurant-backend
pm2 startup
pm2 save
```

### Using Docker

```bash
docker-compose up -d
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.local;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

## 📈 الأداء

- ⚡ Response Time: < 200ms
- 👥 Concurrent Users: 500+
- 💾 Database Queries: Optimized with Indexes
- 🔄 Real-time Updates: WebSocket
- 💨 Caching: Redis

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء Branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add AmazingFeature'`)
4. Push للـ Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📝 الترخيص

MIT License - انظر [LICENSE](LICENSE) للتفاصيل

## 👨‍💻 المطور

تم التطوير بواسطة فريق تطوير نظام المطاعم

## 📞 الدعم

لأي استفسارات أو مشاكل، يرجى فتح Issue في GitHub.

---

**Made with ❤️ for Restaurant Management**
