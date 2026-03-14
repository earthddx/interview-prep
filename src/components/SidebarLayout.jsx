import styles from './SidebarLayout.module.css';

export function SidebarLayout({ sidebar, children }) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>{sidebar}</aside>
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
