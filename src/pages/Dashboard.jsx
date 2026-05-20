import React, { useEffect, useState } from 'react';
import { AlertTriangle, Calendar, Wrench, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/Badge';
import biensService from '../services/biens';
import interventionsService from '../services/interventions';
import maintenancesService from '../services/maintenances';
import '../styles/technicien/dashboard.css';

const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

const calendarEvents = [
  { day: 0, time: '09:00', equipment: 'Pompe P1', task: 'Remplacement joint', type: 'critical' },
  { day: 1, time: '14:30', equipment: 'Convoyeur C3', task: 'Lubrification', type: 'normal' },
  { day: 2, time: '10:15', equipment: 'Moteur M2', task: 'Panne critique', type: 'urgent' },
  { day: 4, time: '11:00', equipment: 'Turbine T9', task: 'Inspection annuelle', type: 'normal' },
];

const criticalEquipment = [
  { name: 'Turbine Siemens V5', ref: 'TS-001-B', status: 'HORS SERVICE', statusVariant: 'critical' },
  { name: 'Compresseur Atlas', ref: 'CA-442-A', status: 'STABLE', statusVariant: 'stable' },
  { name: 'Convoyeur ligne B', ref: 'CL-089-C', status: 'MAINTENANCE', statusVariant: 'maintenance' },
];

const Dashboard = () => {
  const [stats, setStats] = useState({ pannes: 0, maintenances: 0, reparations: 0 });
  const [activities, setActivities] = useState([]);
  const [weekNum] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await biensService.getStatistics();
        if (data) {
          setStats({
            pannes: data.pannes_en_cours ?? data.en_panne ?? interventionsService.getActives().length,
            maintenances: data.en_maintenance ?? maintenancesService.getPlanifiees().length,
            reparations: data.reparations_en_cours ?? 0,
          });
        }
      } catch {
        setStats({
          pannes: interventionsService.getActives().length,
          maintenances: maintenancesService.getPlanifiees().length,
          reparations: 0,
        });
      }
    };
    loadStats();

    const ints = interventionsService.getAll().slice(0, 5).map((i) => ({
      time: new Date(i.created_at).toLocaleString('fr-FR'),
      intervention: i.description?.slice(0, 50) || i.equipement,
      technicien: 'Technicien',
      statut: i.statut === 'resolue' ? 'TERMINÉ' : 'EN COURS',
      statusKey: i.statut === 'resolue' ? 'termine' : 'en_cours',
    }));
    setActivities(ints.length ? ints : [
      { time: 'Il y a 10 min', intervention: 'Alerte température — Zone B', technicien: 'Système', statut: 'CRITIQUE', statusKey: 'critique' },
    ]);
  }, []);

  return (
    <section className="page dashboard">
      <div className="dashboard-widgets">
        <StatCard icon={AlertTriangle} value={stats.pannes} label="Pannes déclarées" badgeVariant="critical" iconVariant="danger" />
        <StatCard icon={Calendar} value={stats.maintenances} label="Maintenances planifiées" badgeVariant="scheduled" iconVariant="info" />
        <StatCard icon={Wrench} value={stats.reparations || '—'} label="Réparations en cours" badgeVariant="active" iconVariant="neutral" />
      </div>

      <div className="dashboard-main">
        <article className="info-card">
          <header className="info-card__header">
            <h3>Calendrier des interventions</h3>
            <span className="info-card__week-nav">
              <button type="button" className="btn btn--secondary btn--sm" aria-label="Semaine précédente"><ChevronLeft size={16} /></button>
              Semaine {weekNum}
              <button type="button" className="btn btn--secondary btn--sm" aria-label="Semaine suivante"><ChevronRight size={16} /></button>
            </span>
          </header>
          <div className="calendar-grid">
            {weekDays.map((day, idx) => {
              const events = calendarEvents.filter((e) => e.day === idx);
              return (
                <div key={day} className="calendar-day">
                  <p className="calendar-day__name">{day}</p>
                  {events.map((ev, i) => (
                    <div key={i} className={`calendar-event calendar-event--${ev.type}`}>
                      <strong>{ev.time}</strong>
                      <br />
                      {ev.equipment} — {ev.task}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </article>

        <aside className="dashboard-aside">
          <article className="info-card">
            <h3>Équipements critiques</h3>
            {criticalEquipment.map((eq) => (
              <div key={eq.ref} className="equipment-row">
                <span className="equipment-row__icon"><Wrench size={20} aria-hidden /></span>
                <span className="equipment-row__body">
                  <p className="equipment-row__name">{eq.name}</p>
                  <p className="equipment-row__ref">Réf. {eq.ref}</p>
                </span>
                <span className={`status-chip status-chip--${eq.statusVariant}`}>{eq.status}</span>
              </div>
            ))}
          </article>

          <article className="report-card">
            <h3>Rapport de service</h3>
            <p>Générez un rapport détaillé de vos interventions pour validation.</p>
            <button type="button" className="btn">
              <FileText size={16} aria-hidden />
              Générer le PDF
            </button>
          </article>
        </aside>
      </div>

      <article className="card dashboard-activities">
        <header className="card__header"><h3>Activités récentes</h3></header>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Heure</th>
                <th>Intervention</th>
                <th>Technicien</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-secondary)' }}>{act.time}</td>
                  <td style={{ fontWeight: 500 }}>{act.intervention}</td>
                  <td>{act.technicien}</td>
                  <td><StatusBadge status={act.statusKey} label={act.statut} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default Dashboard;
