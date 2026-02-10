const API_URL = '/api';
let currentUser = null;
let token = localStorage.getItem('token');

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    const data = await res.json();
    if(data.success) {
      token = data.token;
      currentUser = data.user;
      localStorage.setItem('token', token);
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      document.getElementById('userWelcome').textContent = `مرحباً ${currentUser.full_name}`;
      loadRequests();
      loadItems();
      loadStats();
    } else {
      alert(data.message);
    }
  } catch(err) {
    alert('خطأ في الاتصال');
  }
});

function logout() {
  localStorage.removeItem('token');
  location.reload();
}

function showSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
  document.getElementById(`${section}Section`).classList.add('active');
  event.target.classList.add('active');
  if(section === 'requests') loadRequests();
  if(section === 'items') loadItems();
  if(section === 'stats') loadStats();
}

async function loadRequests() {
  const status = document.getElementById('statusFilter').value;
  const res = await fetch(`${API_URL}/requests?status=${status}`, {
    headers: {'Authorization': `Bearer ${token}`}
  });
  const data = await res.json();
  const html = `<table><thead><tr><th>رقم الطلب</th><th>القسم</th><th>الحالة</th><th>التاريخ</th></tr></thead><tbody>${data.data.map(r => `<tr><td>${r.request_number}</td><td>${r.department}</td><td><span class="badge badge-${r.status}">${r.status}</span></td><td>${new Date(r.created_at).toLocaleDateString('ar')}</td></tr>`).join('')}</tbody></table>`;
  document.getElementById('requestsList').innerHTML = html;
}

async function loadItems() {
  const res = await fetch(`${API_URL}/items`, {headers: {'Authorization': `Bearer ${token}`}});
  const data = await res.json();
  const html = `<table><thead><tr><th>الصنف</th><th>الفئة</th><th>الكمية الحالية</th><th>الوحدة</th></tr></thead><tbody>${data.data.map(i => `<tr><td>${i.name}</td><td>${i.category_name}</td><td>${i.current_stock}</td><td>${i.unit}</td></tr>`).join('')}</tbody></table>`;
  document.getElementById('itemsList').innerHTML = html;
}

async function loadStats() {
  const res = await fetch(`${API_URL}/reports/dashboard`, {headers: {'Authorization': `Bearer ${token}`}});
  const data = await res.json();
  document.getElementById('statsContent').innerHTML = `
    <div class="stat-card"><h3>120</h3><p>إجمالي الطلبات</p></div>
    <div class="stat-card"><h3>45</h3><p>قيد الانتظار</p></div>
    <div class="stat-card"><h3>85%</h3><p>معدل الإنجاز</p></div>
    <div class="stat-card"><h3>${data.data?.lowStock?.length || 0}</h3><p>أصناف منخفضة</p></div>
  `;
}

document.getElementById('createRequestForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    requester_id: currentUser.id,
    department: document.getElementById('requestDepartment').value,
    priority: document.getElementById('requestPriority').value,
    notes: document.getElementById('requestNotes').value,
    items: []
  };
  const res = await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify(formData)
  });
  const data = await res.json();
  if(data.success) {
    alert('تم إنشاء الطلب بنجاح');
    e.target.reset();
    showSection('requests');
  }
});

if(token) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  loadRequests();
}
