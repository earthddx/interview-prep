import { useState } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import styles from './App.module.css';
import Overview from './tabs/Overview';
import CodingAssessment from './tabs/CodingAssessment';
import SystemDesign from './tabs/SystemDesign';
import Behavioral from './tabs/Behavioral';
import QuizTab from './tabs/QuizTab';
import JSReact from './tabs/JSReact';

const TABS = [
  { id: 'overview',   label: 'Overview',          badge: 'Home',          path: '/' },
  { id: 'jsreact',    label: 'JS & React',         badge: '12 topics',     path: '/jsreact' },
  { id: 'coding',     label: 'Coding Assessment',  badge: '10 topics',     path: '/coding' },
  { id: 'sysdesign',  label: 'System Design',      badge: '8 scenarios',   path: '/sysdesign' },
  { id: 'behavioral', label: 'Behavioral',         badge: '12 questions',  path: '/behavioral' },
  { id: 'quiz',       label: 'Quiz Me',            badge: 'Flash',         path: '/quiz' },
];

export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [doneSections, setDoneSections] = useState(new Set());

  const activeTab = TABS.find(t => t.path === pathname)?.id ?? 'overview';
  const markDone = (id) => setDoneSections(prev => new Set([...prev, id]));

  const totalTopics = 12 + 10 + 7 + 7;
  const pct = Math.round((doneSections.size / totalTopics) * 100);

  return (
    <>
      <header className={styles.header}>
        <span className={styles.title}>Interview Prep Dashboard</span>
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
            onClick={() => navigate(t.path)}
          >
            {t.label}
            <span className={`${styles.tabBadge} ${activeTab === t.id ? styles.activeBadge : ''}`}>{t.badge}</span>
          </button>
        ))}
      </nav>

      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/jsreact"    element={<JSReact          onTopicDone={markDone} doneSections={doneSections} />} />
        <Route path="/coding"     element={<CodingAssessment onTopicDone={markDone} doneSections={doneSections} />} />
        <Route path="/sysdesign"  element={<SystemDesign     onTopicDone={markDone} doneSections={doneSections} />} />
        <Route path="/behavioral" element={<Behavioral       onTopicDone={markDone} doneSections={doneSections} />} />
        <Route path="/quiz"       element={<QuizTab />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
