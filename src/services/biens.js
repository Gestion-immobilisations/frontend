// frontend/src/services/biens.js
import api from './api';

const BIENS_ENDPOINT = '/biens';

export const biensService = {
  /**
   * Récupère la liste des biens avec filtres et pagination
   */
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, type_bien, etat, search } = params;
    const queryParams = new URLSearchParams({
      skip: (page - 1) * limit,
      limit,
      ...(type_bien && { type_bien }),
      ...(etat && { etat }),
      ...(search && { search })
    });
    
    const response = await api.get(`${BIENS_ENDPOINT}?${queryParams}`);
    return response.data;
  },

  /**
   * Récupère un bien par son ID
   */
  getById: async (id) => {
    const response = await api.get(`${BIENS_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Crée un nouveau bien
   */
  create: async (bienData) => {
    const response = await api.post(BIENS_ENDPOINT, bienData);
    return response.data;
  },

  /**
   * Met à jour un bien
   */
  update: async (id, bienData) => {
    const response = await api.put(`${BIENS_ENDPOINT}/${id}`, bienData);
    return response.data;
  },

  /**
   * Supprime un bien
   */
  delete: async (id) => {
    await api.delete(`${BIENS_ENDPOINT}/${id}`);
  },

  /**
   * Génère le QR code d'un bien
   */
  generateQRCode: async (id) => {
    const response = await api.get(`${BIENS_ENDPOINT}/${id}/qr-code`, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Change l'état d'un bien
   */
  updateEtat: async (id, nouvelEtat) => {
    const response = await api.patch(`${BIENS_ENDPOINT}/${id}/etat`, null, {
      params: { nouvel_etat: nouvelEtat }
    });
    return response.data;
  },

  /**
   * Récupère les statistiques des biens
   */
  getStatistics: async () => {
    const response = await api.get(`${BIENS_ENDPOINT}/statistics/summary`);
    return response.data;
  }
};

export default biensService;