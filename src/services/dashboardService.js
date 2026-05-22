import { biensService } from './biens';
import utilisateurService from './utilisateurService';
import auditService from './auditService';

export const dashboardService = {
  loadOverview: async ({ isAdmin = false } = {}) => {
    const result = {
      biens: null,
      utilisateurs: null,
      maintenances: null,
      alertes: null,
      recentActivities: [],
      errors: [],
    };

    try {
      const biensStats = await biensService.getStatistics();
      if (biensStats?.total != null) {
        result.biens = biensStats.total;
      }
      const parEtat = biensStats?.par_etat || {};
      const alertCount =
        (parEtat.panne || 0) + (parEtat.maintenance || 0) + (parEtat.PANNE || 0) + (parEtat.MAINTENANCE || 0);
      result.alertes = alertCount;
    } catch (err) {
      result.errors.push({ source: 'biens', message: err?.response?.data?.detail || err.message });
    }

    if (isAdmin) {
      try {
        const usersData = await utilisateurService.getAll({ skip: 0, limit: 1 });
        result.utilisateurs = usersData?.total ?? 0;
      } catch (err) {
        result.errors.push({ source: 'utilisateurs', message: err?.response?.data?.detail || err.message });
      }

      try {
        const auditData = await auditService.getJournal({ skip: 0, limit: 5 });
        result.recentActivities = auditData?.items ?? [];
      } catch (err) {
        result.errors.push({ source: 'audit', message: err?.response?.data?.detail || err.message });
      }
    }

    return result;
  },
};

export default dashboardService;
