import { useState, useEffect } from 'react';
import styles from './SidebarLayout.module.css';

export function SidebarLayout({ sidebar, timer, children }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.mobileBar}>
        <button className={styles.menuToggle} onClick={() => setOpen(o => !o)}>
          {open ? '✕ Close' : '☰ Topics'}
        </button>
        {isMobile && timer && <div className={styles.mobileTimer}>{timer}</div>}
      </div>
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <button className={styles.sidebarClose} onClick={() => setOpen(false)}>✕</button>
        {sidebar}
        {!isMobile && timer && <div className={styles.sidebarTimerSection}>{timer}</div>}
      </aside>
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export function SidebarSection({ title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

export function SidebarItem({ label, done, active, onClick }) {
  return (
    <div className={`${styles.item} ${active ? styles.active : ''}`} onClick={onClick}>
      <span className={`${styles.check} ${done ? styles.done : ''}`}>{done ? '✓' : ''}</span>
      {label}
    </div>
  );
}
