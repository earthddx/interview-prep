import { useState, useRef, useEffect } from 'react';
import styles from './Timer.module.css';

export default function Timer({ defaultMinutes = 30 }) {
  const [secs, setSecs] = useState(defaultMinutes * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSecs(s => {
          if (s <= 0) { clearInterval(ref.current); setRunning(false); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(ref.current);
    }
    return () => clearInterval(ref.current);
  }, [running]);

  const reset = (m) => { setRunning(false); setSecs(m * 60); };
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const color = secs < 60 ? 'var(--accent3)' : secs < 300 ? 'var(--accent5)' : 'var(--accent)';

  return (
    <div className={styles.wrap}>
      <div className={styles.display} style={{ color }}>{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}</div>
      <div className={styles.buttons}>
        <button className="btn" onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Start'}</button>
        <button className="btn" onClick={() => reset(30)}>30m</button>
        <button className="btn" onClick={() => reset(45)}>45m</button>
        <button className="btn" style={{ color: 'var(--accent3)', borderColor: 'var(--accent3)' }} onClick={() => reset(defaultMinutes)}>Reset</button>
      </div>
    </div>
  );
}
