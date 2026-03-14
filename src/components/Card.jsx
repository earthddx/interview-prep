import styles from './Card.module.css';

export function Card({ children, style }) {
  return <div className={styles.card} style={style}>{children}</div>;
}

export function CardHeader({ title, tag, tagColor = 'blue' }) {
  return (
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      {tag && <span className={`tag tag-${tagColor}`}>{tag}</span>}
    </div>
  );
}
