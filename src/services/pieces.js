const STORAGE_KEY = 'technicien_pieces';
const DEMANDES_KEY = 'technicien_demandes_pieces';

const defaultPieces = [
  { id: 1, reference: 'VALVE-SET-B', designation: 'Kit vanne hydraulique', quantite: 4, seuil_alerte: 5, prix_marche: 245.5, unite: '€' },
  { id: 2, reference: 'FILTER-OIL-12', designation: 'Filtre à huile industriel', quantite: 12, seuil_alerte: 8, prix_marche: 38.9, unite: '€' },
  { id: 3, reference: 'BEARING-6205', designation: 'Roulement 6205', quantite: 2, seuil_alerte: 6, prix_marche: 18.75, unite: '€' },
  { id: 4, reference: 'SEAL-KIT-A', designation: 'Kit joints étanchéité', quantite: 7, seuil_alerte: 5, prix_marche: 89.0, unite: '€' },
];

const readPieces = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPieces));
      return defaultPieces;
    }
    return JSON.parse(raw);
  } catch {
    return defaultPieces;
  }
};

const writePieces = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

const readDemandes = () => {
  try {
    const raw = localStorage.getItem(DEMANDES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeDemandes = (items) => localStorage.setItem(DEMANDES_KEY, JSON.stringify(items));

export const piecesService = {
  getAll: () => readPieces(),

  getStockFaible: () => {
    return readPieces().filter((p) => p.quantite <= p.seuil_alerte);
  },

  update: (id, updates) => {
    const items = readPieces();
    const idx = items.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates };
    writePieces(items);
    return items[idx];
  },

  create: (payload) => {
    const items = readPieces();
    const entry = { id: Date.now(), ...payload };
    items.push(entry);
    writePieces(items);
    return entry;
  },

  updatePrixMarche: (id, prix_marche) => {
    return piecesService.update(id, { prix_marche: Number(prix_marche) });
  },

  ajusterStock: (id, delta) => {
    const piece = readPieces().find((p) => p.id === id);
    if (!piece) return null;
    return piecesService.update(id, { quantite: Math.max(0, piece.quantite + delta) });
  },

  getDemandes: () => readDemandes(),

  creerDemande: (payload) => {
    const demandes = readDemandes();
    const entry = {
      id: `DEM-${Date.now()}`,
      statut: 'en_attente',
      date: new Date().toISOString(),
      ...payload,
    };
    demandes.unshift(entry);
    writeDemandes(demandes);
    return entry;
  },
};

export default piecesService;
