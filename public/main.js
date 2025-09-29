const API = '/api/items';

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function loadItems() {
  const tbody = document.querySelector('#itemsTable tbody');
  tbody.innerHTML = '<tr><td colspan="5">Загрузка...</td></tr>';
  try {
    const items = await fetchJSON(API);
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Нет данных</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    for (const item of items) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>
          <input value="${escapeHtml(item.title)}" data-id="${item.id}" class="edit-title" />
        </td>
        <td>
          <input value="${escapeHtml(item.description || '')}" data-id="${item.id}" class="edit-description" />
        </td>
        <td>${new Date(item.created_at).toLocaleString()}</td>
        <td>
          <button data-id="${item.id}" class="save">Сохранить</button>
          <button data-id="${item.id}" class="delete">Удалить</button>
        </td>
      `;
      tbody.appendChild(tr);
    }

    tbody.querySelectorAll('button.save').forEach(btn => btn.addEventListener('click', onSave));
    tbody.querySelectorAll('button.delete').forEach(btn => btn.addEventListener('click', onDelete));
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:red;">Ошибка: ${e.message}</td></tr>`;
  }
}

async function onCreate() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  if (!title) {
    alert('Введите заголовок');
    return;
  }
  try {
    await fetchJSON(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    await loadItems();
  } catch (e) {
    alert(e.message);
  }
}

async function onSave(e) {
  const id = Number(e.currentTarget.getAttribute('data-id'));
  const row = e.currentTarget.closest('tr');
  const title = row.querySelector('.edit-title').value.trim();
  const description = row.querySelector('.edit-description').value.trim();
  if (!title) {
    alert('Заголовок обязателен');
    return;
  }
  try {
    await fetchJSON(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
    await loadItems();
  } catch (e) {
    alert(e.message);
  }
}

async function onDelete(e) {
  const id = Number(e.currentTarget.getAttribute('data-id'));
  if (!confirm('Удалить запись?')) return;
  try {
    await fetchJSON(`${API}/${id}`, { method: 'DELETE' });
    await loadItems();
  } catch (e) {
    alert(e.message);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.getElementById('createBtn').addEventListener('click', onCreate);
loadItems();


