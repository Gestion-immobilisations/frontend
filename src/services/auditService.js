import api from './api';

const ENDPOINT = '/audit';

export const auditService = {
  getJournal: async (params = {}) => {
    const { skip = 0, limit = 50, action, table_concernee, recherche } = params;
    const queryParams = new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    });
    if (action) queryParams.set('action', action);
    if (table_concernee) queryParams.set('table_concernee', table_concernee);
    if (recherche) queryParams.set('recherche', recherche);

    const response = await api.get(`${ENDPOINT}/?${queryParams}`);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get(`${ENDPOINT}/summary`);
    return response.data;
  },
};

export default auditService;
