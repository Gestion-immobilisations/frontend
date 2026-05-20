const STORAGE_KEY = 'technicien_reparations';

const defaultReparations = [
  {
    id: 'REP-001',
    id_bien: null,
    asset: 'Compresseur AX-90',
    ticket: 'BK-8821',
    date: '2023-10-24',
    parts: ['VALVE-SET-B', 'SEAL-KIT-A'],
    cout: 1245,
    description: 'Remplacement vanne et joints',
  },
];

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReparations));
      return defaultReparations;
    }
    return JSON.parse(raw);
  } catch {
    return defaultReparations;
  }
};

const writeAll = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

export const reparationsService = {
  getAll: () => readAll(),

  create: (payload) => {
    const items = readAll();
    const entry = {
      id: `REP-${Date.now()}`,
      ticket: `BK-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      ...payload,
    };
    items.unshift(entry);
    writeAll(items);
    return entry;
  },
};

export default reparationsService;
