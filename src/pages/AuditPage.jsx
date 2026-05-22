import React, { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Fab from '../components/ui/Fab';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import auditService from '../services/auditService';
import utilisateurService from '../services/utilisateurService';
import { formatDateTime } from '../utils/formatters';
import '../styles/pages/audit.css';

const ACTION_META = {
  CREATE: {
    title: 'Création',
    color: 'var(--af-success)',
    icon: AddCircleOutlineIcon,
    iconBg: 'var(--af-success-bg)',
  },
  UPDATE: {
    title: 'Mise à jour',
    color: 'var(--af-info)',
    icon: EditOutlinedIcon,
    iconBg: 'var(--af-info-bg)',
  },
  DELETE: {
    title: 'Suppression',
    color: 'var(--af-danger)',
    icon: DeleteOutlineIcon,
    iconBg: 'var(--af-danger-bg)',
  },
  LOGIN: {
    title: 'Connexion',
    color: 'var(--af-navy)',
    icon: CloudSyncOutlinedIcon,
    iconBg: 'var(--af-accent-bg)',
  },
  LOGOUT: {
    title: 'Déconnexion',
    color: 'var(--af-warning)',
    icon: RestartAltOutlinedIcon,
    iconBg: 'var(--af-warning-bg)',
  },
};

const MODULE_LABELS = {
  utilisateurs: "Utilisateurs",
  biens: "Gestion d'actifs",
  auth: 'Sécurité',
};

function mapEntry(entry) {
  const meta = ACTION_META[entry.action] || {
    title: entry.action,
    color: 'var(--af-navy)',
    icon: HistoryOutlinedIcon,
    iconBg: 'var(--af-accent-bg)',
  };
  const moduleKey = (entry.table_concernee || '').toLowerCase();

  return {
    id: entry.id,
    time: entry.date_action ? formatDateTime(entry.date_action) : '—',
    title: `${meta.title} — ${entry.table_concernee || 'système'}`,
    description: entry.nouvelles_valeurs
      ? JSON.stringify(entry.nouvelles_valeurs).slice(0, 120)
      : entry.anciennes_valeurs
        ? JSON.stringify(entry.anciennes_valeurs).slice(0, 120)
        : '—',
    entityId: entry.id_enregistrement ? `#${entry.id_enregistrement}` : '—',
    module: MODULE_LABELS[moduleKey] || entry.table_concernee || '—',
    moduleKey,
    userId: entry.id_utilisateur,
    userName: entry.utilisateur_nom,
    color: meta.color,
    icon: meta.icon,
    iconBg: meta.iconBg,
    action: entry.action,
  };
}

const AuditPage = () => {
  const [dateFilter, setDateFilter] = useState('24h');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [journal, summaryData, usersData] = await Promise.all([
          auditService.getJournal({ skip: 0, limit: 100 }),
          auditService.getSummary(),
          utilisateurService.getAll({ skip: 0, limit: 200 }),
        ]);
        setEntries((journal?.items ?? []).map(mapEntry));
        setTotal(journal?.total ?? 0);
        setSummary(summaryData);
        setUsers(usersData?.items ?? []);
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || 'Erreur de chargement');
        setEntries([]);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredEntries = useMemo(() => {
    let list = entries;
    if (moduleFilter !== 'all') {
      list = list.filter((e) => e.moduleKey.includes(moduleFilter));
    }
    if (userFilter !== 'all') {
      list = list.filter((e) => String(e.userId) === userFilter);
    }
    return list;
  }, [entries, moduleFilter, userFilter]);

  const distribution = useMemo(() => {
    if (!summary?.distribution?.length) {
      return [
        { label: 'Modifications', pct: 0, color: 'var(--af-navy)' },
        { label: 'Créations', pct: 0, color: 'var(--af-accent)' },
        { label: 'Suppressions', pct: 0, color: 'var(--af-danger)' },
      ];
    }
    const mapLabel = {
      UPDATE: 'Modifications',
      CREATE: 'Créations',
      DELETE: 'Suppressions',
    };
    return summary.distribution
      .filter((d) => mapLabel[d.action])
      .map((d) => ({
        label: mapLabel[d.action],
        pct: d.percent,
        color:
          d.action === 'DELETE'
            ? 'var(--af-danger)'
            : d.action === 'CREATE'
              ? 'var(--af-accent)'
              : 'var(--af-navy)',
      }));
  }, [summary]);

  return (
    <div className="af-page">
      <PageHeader
        title="Journal d'audit"
        subtitle="Suivi chronologique de l'activité du système et des modifications d'actifs."
      />

      {error && (
        <p className="af-empty-message" style={{ marginBottom: 16, color: 'var(--af-danger)' }}>
          {error}
        </p>
      )}

      <div className="af-audit__layout">
        <div>
          <div className="af-audit__filters">
            <div className="af-audit__filter">
              <label htmlFor="audit-date">Date</label>
              <select
                id="audit-date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="24h">Dernières 24 heures</option>
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
              </select>
            </div>
            <div className="af-audit__filter">
              <label htmlFor="audit-module">Module</label>
              <select
                id="audit-module"
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
              >
                <option value="all">Tous les modules</option>
                <option value="biens">Gestion d&apos;actifs</option>
                <option value="utilisateur">Utilisateurs</option>
                <option value="auth">Sécurité</option>
              </select>
            </div>
            <div className="af-audit__filter">
              <label htmlFor="audit-user">Utilisateur</label>
              <select
                id="audit-user"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <option value="all">Tous les responsables</option>
                {users.map((u) => (
                  <option key={u.id} value={String(u.id)}>
                    {u.prenom} {u.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="af-card">
            {loading ? (
              <p className="af-empty-message" style={{ padding: 20 }}>
                Chargement…
              </p>
            ) : filteredEntries.length === 0 ? (
              <p className="af-empty-message" style={{ padding: 20 }}>
                Aucune donnée disponible
              </p>
            ) : (
              filteredEntries.map((entry) => {
                const Icon = entry.icon;
                return (
                  <div key={entry.id} className="af-audit-entry">
                    <div className="af-audit-entry__bar" style={{ background: entry.color }} />
                    <span className="af-audit-entry__time">{entry.time}</span>
                    <div
                      className="af-audit-entry__icon"
                      style={{ background: entry.iconBg, color: entry.color }}
                    >
                      <Icon fontSize="small" />
                    </div>
                    <div className="af-audit-entry__body">
                      <h4>{entry.title}</h4>
                      <p>{entry.description}</p>
                    </div>
                    <div className="af-audit-entry__meta">
                      <strong>ID: {entry.entityId}</strong>
                      Module: {entry.module}
                      {entry.userName && (
                        <>
                          <br />
                          Par: {entry.userName}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div
              style={{
                padding: '14px 20px',
                fontSize: '0.8125rem',
                color: 'var(--af-text-muted)',
              }}
            >
              {filteredEntries.length === 0
                ? 'Aucune entrée'
                : `Affichage de ${filteredEntries.length} sur ${total} entrée(s)`}
            </div>
          </div>
        </div>

        <aside className="af-audit-sidebar">
          <h3>Résumé de l&apos;activité</h3>

          <div className="af-card af-audit-sidebar__stat">
            <div style={{ fontSize: '0.8125rem', color: 'var(--af-text-muted)' }}>
              Actions ce jour
            </div>
            <div className="af-audit-sidebar__stat-value">
              {loading ? '…' : summary?.actions_today ?? '—'}
            </div>
          </div>

          <div className="af-audit-sidebar__section-title">Alertes critiques</div>
          <div
            className="af-card"
            style={{
              padding: 14,
              borderColor: '#fecaca',
              background: 'var(--af-danger-bg)',
            }}
          >
            <WarningAmberOutlinedIcon sx={{ color: 'var(--af-danger)', mb: 1 }} />
            <strong style={{ color: 'var(--af-danger)' }}>
              {summary?.delete_today ?? 0} suppression(s)
            </strong>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '0.8125rem',
                color: 'var(--af-danger-text)',
              }}
            >
              Nécessite vérification
            </p>
          </div>

          <div className="af-audit-sidebar__section-title">Répartition</div>
          {distribution.map((row) => (
            <div key={row.label} className="af-distribution-row">
              <div className="af-distribution-row__head">
                <span>{row.label}</span>
                <span>{row.pct}%</span>
              </div>
              <div className="af-progress">
                <div
                  className="af-progress__bar"
                  style={{ width: `${row.pct}%`, background: row.color }}
                />
              </div>
            </div>
          ))}
        </aside>
      </div>

      <Fab ariaLabel="Nouvelle entrée" />
    </div>
  );
};

export default AuditPage;
