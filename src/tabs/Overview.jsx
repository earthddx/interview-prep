import { useState } from 'react';
import { Card, CardHeader } from '../components/Card';

const CHECKLIST = [
  'Review this entire dashboard and take notes',
  'Write your 5 core STAR stories (behavioral section)',
  'Practice 3-4 coding problems (arrays, graphs, DP)',
  'Sketch 2 system design diagrams from memory',
  'Review AWS services: Lambda, SQS, SNS, API GW, DynamoDB',
  'Prepare 3-5 smart questions to ask the interviewers',
  'Research Bloomberg INDG\'s products / recent news',
  'Get good sleep and test your audio/video setup',
];

export default function Overview() {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked(c => ({ ...c, [i]: !c[i] }));

  return (
    <div style={{ padding: 24 }}>
      {/* Banner */}
      <div style={{ background: 'linear-gradient(135deg,rgba(88,166,255,.1),rgba(210,168,255,.1))', border: '1px solid rgba(88,166,255,.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-bright)' }}>3 Interviews Coming Up</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Bloomberg Industrial Group (INDG) — Full-Stack DevSecOps Engineer</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[['#58a6ff','Coding Assessment'],['#3fb950','System Design'],['#ffa657','Behavioral']].map(([color,label]) => (
            <div key={label} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />{label}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {[['3','Interview Rounds','var(--accent)'],['var(--accent2)','var(--accent2)'],].slice(0,1).concat([]).map(() => null)}
        {[
          { num: '3', label: 'Interview Rounds', color: 'var(--accent)' },
          { num: Object.values(checked).filter(Boolean).length, label: 'Items Checked Off', color: 'var(--accent2)' },
          { num: '3+', label: 'Years Experience Required', color: 'var(--accent4)' },
        ].map(({ num, label, color }) => (
          <div key={label} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color }}>{num}</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Role Snapshot */}
        <Card>
          <CardHeader title="Role Snapshot" tag="INDG" />
          <p>Senior-level full-stack engineer on a <strong>DevSecOps team</strong> building customer-facing web applications. Own architecture decisions, write high-quality code independently.</p>
          <div className="highlight green">
            <p><strong>Key Theme:</strong> They want someone who thinks in systems — cloud-native, resilient, secure, scalable.</p>
          </div>
          <div className="divider" />
          <h3>What They're Really Hiring For</h3>
          <ul>
            <li><strong>Architect + Builder</strong> — design AND implement</li>
            <li><strong>Cloud-native fluency</strong> — AWS, serverless, event-driven, IaC</li>
            <li><strong>DevSecOps mindset</strong> — security built-in, not bolted on</li>
            <li><strong>Communication</strong> — surface issues early, document decisions</li>
            <li><strong>Agile team player</strong> — Scrum, delivery cadence, PR reviews</li>
          </ul>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader title="Target Tech Stack" tag="Must Know" tagColor="purple" />
          <h3>Cloud & Infrastructure</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {['AWS','Lambda','API Gateway','S3','DynamoDB','CloudFormation','Terraform','CDK'].map(t => <span key={t} className="tag tag-blue">{t}</span>)}
          </div>
          <h3>Architecture Patterns</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {['Microservices','Event-Driven','Serverless','Microfrontend','SOA','CQRS'].map(t => <span key={t} className="tag tag-green">{t}</span>)}
          </div>
          <h3>DevSecOps</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['CI/CD','IaC','SAST/DAST','Container Security','Shift-Left Security'].map(t => <span key={t} className="tag tag-orange">{t}</span>)}
          </div>
        </Card>
      </div>

      {/* Strategy */}
      <Card>
        <CardHeader title="Master Strategy for All 3 Rounds" />
        <div className="grid-3">
          {[
            { color: 'blue', label: 'Round 1: Coding', items: ['Expect LeetCode medium difficulty','Focus: arrays, hashmaps, graphs, DP','Always explain time & space complexity','Mention edge cases before coding','Narrate your thought process','Ask: "Optimize for readability or performance?"'] },
            { color: 'green', label: 'Round 2: System Design', items: ['Drive with requirements clarification first','Always mention scale: RPS, data size, latency','Lead with cloud-native AWS solutions','Bring up security at each layer (DevSecOps!)','Discuss tradeoffs explicitly','Show familiarity with event-driven + serverless'] },
            { color: 'orange', label: 'Round 3: Behavioral', items: ['Use STAR method for every answer','Prepare 5 core stories covering multiple questions','Highlight: ownership, ambiguity, cross-team impact','Mention metrics — "reduced latency by 40%"','They care about communication with leads','Ask smart questions at the end'] },
          ].map(({ color, label, items }) => (
            <div key={label}>
              <div className={`tag tag-${color}`} style={{ marginBottom: 10 }}>{label}</div>
              <ul style={{ marginTop: 8 }}>{items.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader title="Pre-Interview Checklist" tag="Track Progress" tagColor="purple" />
        {CHECKLIST.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: i < CHECKLIST.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div
              onClick={() => toggle(i)}
              style={{ width: 18, height: 18, border: `1px solid ${checked[i] ? 'var(--accent2)' : 'var(--border)'}`, borderRadius: 4, flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, background: checked[i] ? 'var(--accent2)' : 'transparent', color: 'var(--bg)', marginTop: 1 }}
            >{checked[i] ? '✓' : ''}</div>
            <span style={{ fontSize: 13, lineHeight: 1.6, textDecoration: checked[i] ? 'line-through' : 'none', color: checked[i] ? 'var(--text-dim)' : 'var(--text)' }}>{item}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
