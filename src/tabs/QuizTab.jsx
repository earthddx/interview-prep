import { useState } from 'react';
import { flashcardSets } from '../data/flashcards';
import { quizQuestions } from '../data/quizQuestions';

const SETS = [
  { key: 'all',      label: 'All Topics' },
  { key: 'aws',      label: 'AWS / Cloud' },
  { key: 'arch',     label: 'Architecture' },
  { key: 'behavioral', label: 'Behavioral' },
  { key: 'coding',   label: 'Coding Concepts' },
  { key: 'jsreact',  label: 'JS & React' },
];

function Flashcards() {
  const [setKey, setSetKey] = useState('all');
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = flashcardSets[setKey];
  const card = cards[idx];

  const go = (dir) => {
    setFlipped(false);
    setTimeout(() => setIdx(i => (i + dir + cards.length) % cards.length), 0);
  };

  const switchSet = (k) => { setSetKey(k); setIdx(0); setFlipped(false); };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {SETS.map(s => (
          <button key={s.key} className={`btn ${setKey === s.key ? 'btn-primary' : ''}`} onClick={() => switchSet(s.key)}>{s.label}</button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 10 }}>Click the card to reveal the answer</div>

      <div style={{ perspective: 1000, marginBottom: 16, cursor: 'pointer' }} onClick={() => setFlipped(f => !f)}>
        <div style={{ minHeight: 180, position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.5s', transform: flipped ? 'rotateY(180deg)' : 'none' }}>
          {/* Front */}
          <div style={{ position: 'absolute', width: '100%', minHeight: 180, backfaceVisibility: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: 'var(--text-bright)' }}>{card.q}</p>
          </div>
          {/* Back */}
          <div style={{ position: 'absolute', width: '100%', minHeight: 180, backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,rgba(88,166,255,.1),rgba(63,185,80,.1))', border: '1px solid var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', transform: 'rotateY(180deg)' }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text)' }}>{card.a}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 10 }}>
        <button className="btn" onClick={() => go(-1)}>← Prev</button>
        <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{idx + 1} / {cards.length}</span>
        <button className="btn" onClick={() => go(1)}>Next →</button>
      </div>
    </div>
  );
}

function MultipleChoice() {
  const [answers, setAnswers] = useState({});

  const answer = (qi, oi) => {
    if (answers[qi] !== undefined) return;
    setAnswers(a => ({ ...a, [qi]: oi }));
  };

  const score = Object.entries(answers).filter(([qi, oi]) => quizQuestions[qi].correct === oi).length;

  return (
    <div>
      {Object.keys(answers).length === quizQuestions.length && (
        <div className="highlight green" style={{ marginBottom: 16 }}>
          <p><strong>Score: {score} / {quizQuestions.length}</strong> {score === quizQuestions.length ? '— Perfect! 🎯' : score >= 3 ? '— Good work!' : '— Review the explanations below.'}</p>
        </div>
      )}
      {quizQuestions.map((q, qi) => {
        const answered = answers[qi] !== undefined;
        return (
          <div key={qi} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-bright)', marginBottom: 12 }}>Q{qi+1}: {q.q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt, oi) => {
                let borderColor = 'var(--border)', background = 'var(--surface)', color = 'var(--text)';
                if (answered) {
                  if (oi === q.correct) { borderColor = 'var(--accent2)'; background = 'rgba(63,185,80,.1)'; color = 'var(--accent2)'; }
                  else if (oi === answers[qi] && oi !== q.correct) { borderColor = 'var(--accent3)'; background = 'rgba(247,129,102,.1)'; color = 'var(--accent3)'; }
                }
                return (
                  <div key={oi} onClick={() => answer(qi, oi)} style={{ padding: '10px 14px', borderRadius: 6, border: `1px solid ${borderColor}`, background, cursor: answered ? 'default' : 'pointer', fontSize: 13, color, transition: 'all 0.15s' }}>
                    {opt}
                  </div>
                );
              })}
            </div>
            {answered && (
              <div style={{ marginTop: 10, padding: 10, background: 'var(--surface)', borderLeft: '3px solid var(--accent)', borderRadius: '0 6px 6px 0', fontSize: 13 }}>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function QuizTab() {
  return (
    <div style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4 }}>Flash Quiz</div>
      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>Test your knowledge on key concepts</div>

      <Flashcards />

      <div style={{ height: 1, background: 'var(--border)', margin: '28px 0' }} />

      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 16 }}>Multiple Choice Quiz</div>
      <MultipleChoice />
    </div>
  );
}
