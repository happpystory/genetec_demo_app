import styles from './App.module.scss';
import { IfxButton } from '@infineon/design-system-react';
import { useEvents } from '../features/events/hooks/useEvents';
import { DataGrid } from '../components/DataGrid';
import type { DataGridColumn } from '../components/DataGrid';
import type { ScheduleEvent } from '../features/events/types/event.types';

const eventColumns: DataGridColumn<ScheduleEvent>[] = [
  { label: 'Title', accessor: 'title' },
  { label: 'Start', accessor: 'start' },
  { label: 'Duration', accessor: 'durationMin' },
  { label: 'Category', accessor: 'category' },
  { label: 'Location', accessor: 'location' },
  { label: 'Organizer', accessor: 'organizer' },
];

function App() {
  const { events, status, reload } = useEvents();

  const getEventId = (event: ScheduleEvent) => event.id;

  const handleSimulateErrorClick = () => {
    reload({ simulateError: true });
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.brand}>GENETEC</span>
          <span className={styles.product}>Events</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeading}>
            <h1 className={styles.pageTitle}>Event Management</h1>
            <p className={styles.pageSubtitle}>View and manage scheduled events.</p>
          </div>

          <IfxButton type="button">+ New event</IfxButton>
        </div>

        <section className={styles.content}>
          <div className={styles.gridColumn}>
            <p className={styles.debugInfo}>
              Status: {status}
              {status === 'ready' && ` · ${events.length.toLocaleString()} events`}
            </p>
            <IfxButton type="button" onClick={handleSimulateErrorClick}>
              Simulate error
            </IfxButton>

            <div className={styles.gridSection}>
              <DataGrid columns={eventColumns} rows={events} getRowId={getEventId} />
            </div>
          </div>

          <div className={styles.sectionPlaceholder}>Timeline here</div>
        </section>
      </main>
    </div>
  );
}

export default App;