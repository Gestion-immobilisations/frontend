import api from './api';

const ENDPOINT = '/utilisateurs';

export const utilisateurService = {
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100, actif, recherche } = params;
    const queryParams = new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    });
    if (actif !== undefined && actif !== null) {
      queryParams.set('actif', String(actif));
    }
    if (recherche) {
      queryParams.set('recherche', recherche);
    }
    const response = await api.get(`${ENDPOINT}?${queryParams}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  },
};

export default utilisateurService;
