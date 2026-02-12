# 📖 API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
جميع الـ endpoints (ما عدا `/auth/login`) تتطلب JWT token في الـ header:

```http
Authorization: Bearer <token>
```

---

## 🔐 Authentication

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "full_name": "المدير العام",
    "role": "admin"
  }
}
```

### Logout
```http
POST /api/auth/logout
```

### Get Current User
```http
GET /api/auth/me
```

---

## 📦 Requests

### Get All Requests
```http
GET /api/requests?status=pending&department=kitchen
```

**Query Parameters:**
- `status`: pending | approved | rejected | preparing | ready | delivered
- `department`: اسم القسم
- `from_date`: تاريخ البداية (YYYY-MM-DD)
- `to_date`: تاريخ النهاية (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "request_number": "REQ-2026-001",
      "requester_name": "أحمد محمد",
      "department_name": "المطبخ",
      "status": "pending",
      "priority": "high",
      "created_at": "2026-02-12T10:00:00Z"
    }
  ]
}
```

### Create Request
```http
POST /api/requests
```

**Request Body:**
```json
{
  "requester_id": 1,
  "department_id": 2,
  "priority": "high",
  "notes": "طلب عاجل",
  "items": [
    {
      "item_id": 5,
      "quantity": 10
    }
  ]
}
```

### Approve Request
```http
POST /api/requests/:id/approve
```

**Request Body:**
```json
{
  "approver_id": 1,
  "notes": "تمت الموافقة"
}
```

### Reject Request
```http
POST /api/requests/:id/reject
```

---

## 🛒 Items & Inventory

### Get All Items
```http
GET /api/items
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "طحين",
      "category_name": "مواد جافة",
      "current_stock": 50,
      "par_level": 100,
      "unit": "كيس"
    }
  ]
}
```

### Get Low Stock Items
```http
GET /api/items/low-stock
```

### Create Item
```http
POST /api/items
```

**Request Body:**
```json
{
  "name": "سكر",
  "category_id": 1,
  "unit": "كيس",
  "par_level": 50,
  "current_stock": 20
}
```

---

## 📊 Reports

### Dashboard Statistics
```http
GET /api/reports/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRequests": 120,
    "pendingRequests": 45,
    "completionRate": 85,
    "lowStock": [
      {
        "item_name": "طحين",
        "current_stock": 20,
        "par_level": 100
      }
    ]
  }
}
```

### Daily Report
```http
GET /api/reports/daily?date=2026-02-12
```

### Top Items
```http
GET /api/reports/top-items?limit=10
```

---

## 👥 Users

### Get All Users
```http
GET /api/users
```

### Create User
```http
POST /api/users
```

**Request Body:**
```json
{
  "username": "user123",
  "password": "password123",
  "full_name": "محمد أحمد",
  "role": "requester",
  "department_id": 1,
  "pin_code": "1234"
}
```

---

## Error Handling

جميع الأخطاء تُرجع بالتنسيق التالي:

```json
{
  "success": false,
  "message": "وصف الخطأ بالعربية"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
