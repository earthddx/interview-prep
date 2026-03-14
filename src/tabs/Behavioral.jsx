import { useState } from 'react';
import Accordion from '../components/Accordion';
import { Card, CardHeader } from '../components/Card';
import { SidebarLayout, SidebarSection, SidebarItem } from '../components/SidebarLayout';

const TOPICS = [
  { id: 'star',       label: 'STAR Method Builder' },
  { id: 'leadership', label: 'Leadership & Ownership' },
  { id: 'collab',     label: 'Collaboration & Communication' },
  { id: 'technical',  label: 'Technical Decision Making' },
  { id: 'challenges', label: 'Handling Challenges' },
  { id: 'agile',      label: 'Agile & DevSecOps Experience' },
  { id: 'questions',  label: 'Questions to Ask Them' },
];

const STAR_PROMPTS = {
  lead: "Tell me about a time you led a complex technical project from architecture to delivery.",
  prod: "Describe a significant production incident: how did you detect, diagnose, fix, and prevent it?",
  process: "Tell me about a process improvement you drove — in CI/CD, code quality, or team workflow.",
  conflict: "How did you handle a technical disagreement with a teammate or manager? What was the outcome?",
  learn: "Describe a time you had to learn a new technology or language quickly to deliver a project.",
};

function StarBuilder() {
  const [story, setStory] = useState('');
  const [fields, setFields] = useState({ S: '', T: '', A: '', R: '' });
  const set = (k, v) => setFields(f => ({ ...f, [k]: v }));

  const letters = [
    { k: 'S', label: 'Situation', color: 'var(--accent)', hint: 'What was the context? Team, company, product?' },
    { k: 'T', label: 'Task', color: 'var(--accent5)', hint: 'What specifically were you asked to do or took ownership of?' },
    { k: 'A', label: 'Action', color: 'var(--accent2)', hint: 'What actions did YOU personally take? Be technical and specific.' },
    { k: 'R', label: 'Result', color: 'var(--accent4)', hint: 'Measurable outcome — "reduced by 40%", "zero downtime", "saved 20 hours/week".' },
  ];

  return (
    <Card>
      <CardHeader title="STAR Answer Builder" tag="Practice Tool" tagColor="orange" />
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 13, color: 'var(--text-dim)' }}>Story topic: </label>
        <select value={story} onChange={e => setStory(e.target.value)} style={{ marginLeft: 8, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', padding: '6px 10px', borderRadius: 6, fontSize: 13 }}>
          <option value="">-- Select a question --</option>
          <option value="lead">Led a complex technical project</option>
          <option value="prod">Production incident you resolved</option>
          <option value="process">Process improvement you drove</option>
          <option value="conflict">Technical disagreement</option>
          <option value="learn">Learning a new technology quickly</option>
        </select>
      </div>
      {story && <div className="highlight" style={{ marginBottom: 14 }}><p>{STAR_PROMPTS[story]}</p></div>}
      {letters.map(({ k, label, color, hint }) => (
        <div key={k} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-dim)' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: color, color: 'var(--bg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{k}</span>
            {label}
          </div>
          <textarea
            value={fields[k]}
            onChange={e => set(k, e.target.value)}
            placeholder={hint}
            style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', minHeight: 70, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      ))}
    </Card>
  );
}

const CONTENT = {
  star: <StarBuilder />,
  leadership: (
    <Card>
      <CardHeader title="Leadership & Ownership Questions" tag="INDG Core Values" tagColor="red" />
      <Accordion title='"Tell me about a time you took ownership of a critical problem."' defaultOpen>
        <div className="highlight"><p><strong>What they're testing:</strong> Initiative, accountability, ability to work independently.</p></div>
        <h3>Answer Structure:</h3>
        <ol>
          <li>Set the scene — what was the critical issue?</li>
          <li>Explain why YOU took ownership (not just assigned)</li>
          <li>Walk through your decision-making process</li>
          <li>Describe the technical solution</li>
          <li>Quantify the impact: uptime restored, SLA met</li>
          <li>What did you put in place to prevent recurrence?</li>
        </ol>
        <div className="highlight green" style={{ marginTop: 10 }}><p><strong>INDG angle:</strong> Mention you communicated proactively with the dev lead — they specifically call this out in the JD.</p></div>
      </Accordion>
      <Accordion title='"How have you influenced technical decisions without direct authority?"'>
        <ul>
          <li>Talk about proposing a better approach (new framework, architecture pattern)</li>
          <li>Describe how you built the case: PoC, benchmarks, cost analysis</li>
          <li>Mention empirical evidence — "I ran a PoC showing X% improvement"</li>
          <li>How did you get buy-in? Address concerns?</li>
        </ul>
      </Accordion>
      <Accordion title='"Describe a time you made a difficult technical tradeoff."'>
        <p>The JD says "make well-reasoned design decisions and tradeoffs." They <em>will</em> ask this.</p>
        <ul>
          <li>Frame the competing forces: consistency vs speed, cost vs performance</li>
          <li>Explain how you gathered data to inform the decision</li>
          <li>Show you can commit — not just analyze</li>
          <li>Reflect: was it the right call? What would you do differently?</li>
        </ul>
      </Accordion>
    </Card>
  ),
  collab: (
    <Card>
      <CardHeader title="Collaboration & Communication" tag="Team Fit" tagColor="green" />
      <Accordion title='"How do you communicate blockers to your team lead?"' defaultOpen>
        <div className="highlight orange"><p><strong>INDG specifically says:</strong> "Communicate with the development lead to raise issues and <strong>anticipate potential barriers</strong>." Emphasize proactive communication.</p></div>
        <ul>
          <li>Surface blockers early — not after they've already delayed delivery</li>
          <li>Describe your "no surprises" approach: weekly sync, async updates, flagging risks</li>
          <li>Give an example of when you raised an issue before it became a problem</li>
          <li>Frame blockers: "here's the issue, here's what I've tried, here's my proposed path"</li>
        </ul>
      </Accordion>
      <Accordion title={`"Tell me about a time you disagreed with a teammate's approach."`}>
        <ul>
          <li>Engage disagreement with curiosity, not ego</li>
          <li>Make your case with evidence, not just opinion</li>
          <li>Show you can "disagree and commit" once a decision is made</li>
          <li>Emphasize you kept the team relationship intact</li>
        </ul>
      </Accordion>
    </Card>
  ),
  technical: (
    <Card>
      <CardHeader title="Technical Decision Making" tag="Architecture Mindset" tagColor="purple" />
      <Accordion title='"Describe your approach to architecting a new system."' defaultOpen>
        <ol>
          <li><strong>Understand the problem domain</strong> — business requirements, constraints, scale</li>
          <li><strong>Identify quality attributes</strong> — availability, security, performance</li>
          <li><strong>Generate options</strong> — at least 2-3 architectural approaches</li>
          <li><strong>Evaluate via PoC or analysis</strong> — "seek empirical evidence" (exact JD language!)</li>
          <li><strong>Document the ADR</strong> — what you chose, why, what you rejected</li>
          <li><strong>Validate with the team</strong> — architecture review</li>
        </ol>
        <div className="highlight"><p>You can literally quote the JD: <em>"I follow the practice of seeking empirical evidence through proof of concepts, tests, and external research before committing to a design."</em></p></div>
      </Accordion>
      <Accordion title='"How do you stay current with technology?"'>
        <ul>
          <li>AWS re:Invent talks, AWS What's New feed</li>
          <li>Hacker News, ThoughtWorks Tech Radar</li>
          <li>Building side projects with new tech</li>
          <li>Engineering blogs: Netflix, Stripe, Cloudflare, Martin Fowler</li>
          <li>Meetups, conferences, team knowledge sharing</li>
        </ul>
      </Accordion>
    </Card>
  ),
  challenges: (
    <Card>
      <CardHeader title="Handling Challenges & Failures" tag="Resilience Check" tagColor="red" />
      <Accordion title='"Tell me about a time something you built broke in production."' defaultOpen>
        <div className="highlight green"><p><strong>Key insight:</strong> They're not testing if you've failed — everyone has. They're testing how you handle it: ownership, methodical debugging, communication, and learning.</p></div>
        <ol>
          <li>What happened and what was the impact?</li>
          <li>How did you detect it? (monitoring, customer report)</li>
          <li>Immediate response? (incident response, communication)</li>
          <li>How did you diagnose it? (logs, traces, elimination)</li>
          <li>How did you fix it? (quick fix vs root cause)</li>
          <li>What did you put in place so it never happens again?</li>
        </ol>
      </Accordion>
      <Accordion title='"Describe a time you had to learn a new technology quickly."'>
        <p>JD says: <em>"ability to quickly learn new technologies and programming languages."</em></p>
        <ul>
          <li>Context — why the new tech was needed</li>
          <li>Your learning approach: docs, tutorials, PoC, talk to experts</li>
          <li>How quickly you got productive</li>
          <li>What you built and the outcome</li>
        </ul>
      </Accordion>
    </Card>
  ),
  agile: (
    <Card>
      <CardHeader title="Agile & DevSecOps Experience" tag="Process Questions" tagColor="orange" />
      <Accordion title="Agile / Scrum Questions" defaultOpen>
        <ul>
          <li><strong>"How do you handle scope creep in a sprint?"</strong> → Protect the sprint goal, escalate scope changes through the PO, re-negotiate timeline with evidence</li>
          <li><strong>"How do you estimate user stories?"</strong> → Story points (Fibonacci), planning poker, break down large stories</li>
          <li><strong>"What makes a good pull request?"</strong> → Small focused changes, descriptive title, linked ticket, tests included, self-reviewed first</li>
          <li><strong>"How do you approach code reviews?"</strong> → Constructive, explain the why, don't block on style (use linters), 24-48h SLA</li>
        </ul>
      </Accordion>
      <Accordion title="DevSecOps Questions">
        <ul>
          <li><strong>"What does DevSecOps mean to you?"</strong> → Security is everyone's responsibility. Shift security left: secret detection in commit hooks, SAST in CI, dependency scanning, DAST before prod.</li>
          <li><strong>"How do you handle secrets in code?"</strong> → Never in code. AWS Secrets Manager or Parameter Store. Pre-commit hooks to detect accidental commits.</li>
          <li><strong>"How do you ensure compliance in a fast-moving team?"</strong> → Compliance-as-code (AWS Config Rules, OPA), security gates in CI/CD, tagging strategy for resource ownership.</li>
        </ul>
      </Accordion>
    </Card>
  ),
  questions: (
    <Card>
      <CardHeader title="Smart Questions to Ask INDG" tag="Show Genuine Interest" tagColor="green" />
      <div className="highlight"><p><strong>Rule:</strong> Ask questions that show you've read the JD and are thinking about how to succeed there.</p></div>
      <h3>About the Role</h3>
      <ul>
        <li>"What does success look like in the first 90 days for this role?"</li>
        <li>"What are the biggest technical challenges the team is facing right now?"</li>
        <li>"How autonomous are engineers in architectural decisions vs following a standardized approach?"</li>
        <li>"What's the current state of the CI/CD and DevSecOps pipeline — what are you proud of and what's being improved?"</li>
      </ul>
      <h3>About the Team</h3>
      <ul>
        <li>"How does the DevSecOps team interact with product teams? Embedded or platform team?"</li>
        <li>"How do you balance feature velocity with security and quality?"</li>
      </ul>
      <h3>About Growth</h3>
      <ul>
        <li>"How do engineers typically grow from this role? What's the path to senior / staff?"</li>
        <li>"Are there opportunities to work across different parts of the stack — IaC to frontend?"</li>
      </ul>
      <div className="highlight orange" style={{ marginTop: 16 }}>
        <p><strong>Best closing question:</strong> "Is there anything from our conversation that gives you pause about my fit for this role?" — Shows confidence, gives you a chance to address concerns.</p>
      </div>
    </Card>
  ),
};

export default function Behavioral({ onTopicDone, doneSections }) {
  const [active, setActive] = useState('star');

  return (
    <SidebarLayout
      sidebar={
        <>
          <SidebarSection title="Question Categories">
            {TOPICS.map(t => (
              <SidebarItem key={t.id} label={t.label} active={active === t.id} done={doneSections.has(t.id)} onClick={() => setActive(t.id)} />
            ))}
          </SidebarSection>
          <SidebarSection title="Your Core Stories">
            <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.8 }}>
              Prepare 5 versatile stories:<br />
              1. Led a major tech decision<br />
              2. Production incident solved<br />
              3. Process improvement driven<br />
              4. Difficult stakeholder situation<br />
              5. Learned fast under pressure
            </div>
          </SidebarSection>
        </>
      }
    >
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4 }}>Behavioral Interview Prep</div>
      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>INDG cares about ownership, initiative, communication, and DevSecOps mindset</div>
      {CONTENT[active]}
      {!doneSections.has(active) ? (
        <button className="btn btn-primary" onClick={() => onTopicDone(active)}>Mark as Reviewed ✓</button>
      ) : (
        <div style={{ color: 'var(--accent2)', fontSize: 13, marginTop: 4 }}>✓ Reviewed</div>
      )}
    </SidebarLayout>
  );
}
