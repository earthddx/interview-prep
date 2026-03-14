import { useState } from 'react';
import styles from './Accordion.module.css';

export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.accordion}>
      <div className={styles.header} onClick={() => setOpen(o => !o)}>
        <span className={styles.title}>{title}</span>
        <span className={styles.arrow} style={{ transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </div>
      {open && <div className={styles.body}>{children}</div>}
    </div>
  );
}
