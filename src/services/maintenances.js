const STORAGE_KEY = 'technicien_maintenances';

const defaultItems = [
  {
    id: 'MAINT-2026-001',
    id_bien: null,
    title: 'Unité de pressage hydraulique P-402',
    subtitle: 'Maintenance préventive — semestrielle',
    type: 'preventive',
    date_prevue: new Date().toISOString().slice(0, 10),
    statut: 'planifiee',
    priorite: 'HAUTE',
    cout_estime: 1250,
    tasks: [
      { label: 'Inspection des niveaux d\'huile et filtres', done: true },
      { label: 'Vérification des joints d\'étanchéité haute pression', done: false },
      { label: 'Calibration des capteurs de pression', done: false },
    ],
  },
];

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      writeAll(defaultItems);
      return defaultItems;
    }
    return JSON.parse(raw);
  } catch {
    return defaultItems;
  }
};

const writeAll = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const maintenancesService = {
  getAll: () => readAll(),

  getPlanifiees: () => readAll().filter((m) => m.statut === 'planifiee' || m.statut === 'en_cours'),

  getHistorique: () => readAll().filter((m) => m.statut === 'terminee'),

  create: (payload) => {
    const items = readAll();
    const entry = {
      id: `MAINT-${Date.now()}`,
      statut: 'planifiee',
      tasks: [],
      ...payload,
      created_at: new Date().toISOString(),
    };
    items.unshift(entry);
    writeAll(items);
    return entry;
  },

  update: (id, updates) => {
    const items = readAll();
    const idx = items.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates };
    writeAll(items);
    return items[idx];
  },
};

export default maintenancesService;
