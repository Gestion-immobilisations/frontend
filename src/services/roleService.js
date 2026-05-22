import api from './api';
import { HIDDEN_ROLES } from '../utils/roleConfig';

const ENDPOINT = '/roles';

export const roleService = {
  getAll: async () => {
    const response = await api.get(`${ENDPOINT}/`);
    const data = response.data;
    let roles = data?.roles ?? [];

    if (roles.length && typeof roles[0] === 'string') {
      roles = roles.map((nom) => ({ nom, description: null, actif: true }));
    }

    return roles.filter((r) => !HIDDEN_ROLES.has(String(r.nom || '').toUpperCase()));
  },
};

export default roleService;
