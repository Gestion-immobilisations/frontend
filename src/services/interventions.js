const STORAGE_KEY = 'technicien_interventions';

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAll = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const interventionsService = {
  getAll: () => readAll(),

  getById: (id) => readAll().find((i) => i.id === id),

  create: (payload) => {
    const items = readAll();
    const entry = {
      id: `INT-${Date.now()}`,
      ...payload,
      statut: payload.statut || 'declaree',
      created_at: new Date().toISOString(),
    };
    items.unshift(entry);
    writeAll(items);
    return entry;
  },

  update: (id, updates) => {
    const items = readAll();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
    writeAll(items);
    return items[idx];
  },

  getActives: () => readAll().filter((i) => i.statut !== 'resolue'),
};

export default interventionsService;
