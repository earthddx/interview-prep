import { useState } from 'react';
import './index.css';
import styles from './App.module.css';
import Overview from './tabs/Overview';
import CodingAssessment from './tabs/CodingAssessment';
import SystemDesign from './tabs/SystemDesign';
import Behavioral from './tabs/Behavioral';
import QuizTab from './tabs/QuizTab';
import JSReact from './tabs/JSReact';

const TABS = [
  { id: 'overview',   label: 'Overview',          badge: 'Home' },
  { id: 'jsreact',    label: 'JS & React',         badge: '12 topics' },
  { id: 'coding',     label: 'Coding Assessment',  badge: '10 topics' },
  { id: 'sysdesign',  label: 'System Design',      badge: '7 scenarios' },
  { id: 'behavioral', label: 'Behavioral',         badge: '12 questions' },
  { id: 'quiz',       label: 'Quiz Me',            badge: 'Flash' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [doneSections, setDoneSections] = useState(new Set());

  const markDone = (id) => setDoneSections(prev => new Set([...prev, id]));

  const totalTopics = 12 + 10 + 7 + 7;
  const pct = Math.round((doneSections.size / totalTopics) * 100);

  return (
    <>
      <header className={styles.header}>
        <span className={styles.title}>Bloomberg INDG — Interview Prep Dashboard</span>
        <div className={styles.headerRight}>
          <span className={styles.progressLabel}>Overall Prep</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          <span className={styles.progressLabel}>{pct}%</span>
          <span className={styles.badge}>Full-Stack / DevSecOps</span>
        </div>
      </header>

      <nav className={styles.nav}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tabBtn} ${activeTab === t.id ? styles.active : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
            <span className={`${styles.tabBadge} ${activeTab === t.id ? styles.activeBadge : ''}`}>{t.badge}</span>
          </button>
        ))}
      </nav>

      {activeTab === 'overview'   && <Overview />}
      {activeTab === 'jsreact'    && <JSReact          onTopicDone={markDone} doneSections={doneSections} />}
      {activeTab === 'coding'     && <CodingAssessment onTopicDone={markDone} doneSections={doneSections} />}
      {activeTab === 'sysdesign'  && <SystemDesign     onTopicDone={markDone} doneSections={doneSections} />}
      {activeTab === 'behavioral' && <Behavioral       onTopicDone={markDone} doneSections={doneSections} />}
      {activeTab === 'quiz'       && <QuizTab />}
    </>
  );
}
