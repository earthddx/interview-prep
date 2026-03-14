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

const STAR_EXAMPLES = [
  {
    title: 'Led a complex technical project',
    prompt: '"Tell me about a time you led a complex technical project from architecture to delivery."',
    S: 'Our monolithic Node.js backend was becoming a bottleneck — deploys took 45 minutes, a single bug could take down unrelated features, and the team of 8 engineers were constantly stepping on each other. The business wanted to launch a new payments feature but the team lead flagged it would take 3 months inside the monolith.',
    T: 'I volunteered to lead the extraction of the payments domain into a standalone microservice — design, implementation, and zero-downtime migration — while the rest of the team kept shipping on the monolith.',
    A: 'I started with a PoC using the Strangler Fig pattern to validate we could intercept traffic at the API gateway without touching existing code. I wrote an ADR comparing REST vs async messaging for inter-service calls and proposed async (SQS) for non-critical flows and sync REST for real-time queries. I set up a separate CI/CD pipeline in GitHub Actions with independent test, security scan, and deploy stages. I ran a canary release at 5% traffic, monitored error rates and p99 latency in CloudWatch, then gradually shifted to 100%.',
    R: 'Delivered in 6 weeks instead of 3 months. Deploy time for the payments service dropped from 45 minutes to 4 minutes. The monolith stabilised — unrelated incidents dropped by 60% in Q1. The pattern became the template for two further service extractions.',
  },
  {
    title: 'Production incident you resolved',
    prompt: '"Describe a significant production incident: how did you detect, diagnose, fix, and prevent it?"',
    S: 'At 2am on a Tuesday, our e-commerce checkout API started returning 503s. It affected roughly 12% of users — those hitting one of our three EC2 instances. We had no on-call rotation at the time; I saw the PagerDuty alert come through and jumped on.',
    T: 'As the most senior engineer available, I owned the incident: diagnose the root cause, restore service, and communicate clearly to the business — with no playbook to follow.',
    A: 'I checked CloudWatch first — memory usage on the affected instance was at 99%, CPU was normal. I tailed the application logs and found a flood of uncaught promise rejections from a third-party shipping API that was timing out but not being handled — each request was leaking an event listener, exhausting memory over 2 hours. I immediately detached the instance from the load balancer to restore service to 100% of users, then deployed a hotfix adding a timeout and catch block. I sent a plain-English Slack update to the business every 20 minutes throughout. In the post-mortem I added memory utilisation as a CloudWatch alarm, set up automatic instance recycling, and added an integration test for the shipping API failure path.',
    R: 'Service restored in 34 minutes. Memory alarm caught a recurrence 3 weeks later and auto-recycled the instance with zero user impact. The incident became the catalyst for formalising our on-call rota and runbooks.',
  },
  {
    title: 'Process improvement you drove',
    prompt: '"Tell me about a process improvement you drove — in CI/CD, code quality, or team workflow."',
    S: 'Our team was merging directly to main with no automated checks. PRs were reviewed sporadically, and we\'d discovered two separate incidents where secrets were accidentally committed and pushed — one was a Stripe test key that had to be rotated.',
    T: 'Nobody had formally been asked to fix this, but it was clearly a risk. I took ownership of designing and rolling out a CI/CD security baseline across all 11 repositories.',
    A: 'I mapped out the risk surface first: no pre-commit hooks, no secret scanning, no SAST, dependency updates manual and infrequent. I introduced detect-secrets as a pre-commit hook (preventing commits containing credentials), added Trivy for container scanning and npm audit to the GitHub Actions pipeline as a required check, and configured Dependabot for weekly automated dependency PRs. I wrote a one-page ADR explaining each decision and ran a 30-minute team demo. To avoid slowing the team down, I made the pipeline fail fast — secret scan and lint ran first, heavier SAST ran in parallel.',
    R: 'Zero secret leaks in the 8 months following rollout. CI feedback time dropped by 2 minutes (parallelisation). Dependabot caught and auto-merged 3 high-severity CVE patches before they were even discussed in a team meeting. The approach was adopted by a second team after they saw the results.',
  },
  {
    title: 'Technical disagreement with a teammate',
    prompt: '"How did you handle a technical disagreement with a teammate or manager? What was the outcome?"',
    S: 'We were building a new internal dashboard and my teammate wanted to use a GraphQL API with a shared schema across the frontend and an ML pipeline. I felt a simple REST API was a better fit — the dashboard had well-defined, stable data needs and the ML team was on Python with no GraphQL tooling.',
    T: 'We were at an impasse. Both of us had strong opinions and the tech lead wanted a decision within a week so the frontend team could start.',
    A: 'Instead of escalating immediately, I proposed we each write a one-pager outlining our approach: technical justification, risks, and estimated effort. I kept mine factual — "our query patterns are fixed, REST gives us HTTP caching for free, and the ML team integration is a REST call anyway." My teammate\'s counter was that GraphQL would make future features easier to add. We brought both to the tech lead together and I explicitly said I was happy to be wrong — I wanted the best outcome for the team. The tech lead sided with REST for the MVP with an explicit note in the ADR that we\'d revisit if the query flexibility became a bottleneck.',
    R: 'We shipped the dashboard on time. The REST API has been in production for 18 months with no need to revisit. More importantly, my teammate and I established a "write the one-pager first" norm that we still use for technical debates.',
  },
];

function StarExamples() {
  const labelColor = { S: 'var(--accent)', T: 'var(--accent5)', A: 'var(--accent2)', R: 'var(--accent4)' };
  const labelName = { S: 'Situation', T: 'Task', A: 'Action', R: 'Result' };
  return (
    <Card>
      <CardHeader title="STAR Example Stories" tag="Reference" tagColor="green" />
      <div className="highlight"><p>Use these as templates — adapt the details to your own experience. The structure matters more than the specifics.</p></div>
      {STAR_EXAMPLES.map(ex => (
        <Accordion key={ex.title} title={ex.title}>
          <div className="highlight" style={{ marginBottom: 12 }}><p><em>{ex.prompt}</em></p></div>
          {['S', 'T', 'A', 'R'].map(k => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: labelColor[k], color: 'var(--bg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-dim)' }}>{labelName[k]}</span>
              </div>
              <p style={{ margin: 0, paddingLeft: 30, fontSize: 13, lineHeight: 1.7, color: 'var(--text)' }}>{ex[k]}</p>
            </div>
          ))}
        </Accordion>
      ))}
    </Card>
  );
}

const CONTENT = {
  star: (
    <>
      <StarBuilder />
      <StarExamples />
    </>
  ),
  leadership: (
    <Card>
      <CardHeader title="Leadership & Ownership Questions" tag="Core Values" tagColor="red" />
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
        <div className="highlight green" style={{ marginTop: 10 }}><p><strong>Key angle:</strong> Mention you communicated proactively with the dev lead — many JDs specifically call out proactive communication.</p></div>
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
        <div className="highlight orange"><p><strong>Key expectation:</strong> "Communicate with the development lead to raise issues and <strong>anticipate potential barriers</strong>." Emphasize proactive communication.</p></div>
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
      <CardHeader title="Smart Questions to Ask" tag="Show Genuine Interest" tagColor="green" />
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
      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>Strong candidates demonstrate ownership, initiative, communication, and a DevSecOps mindset</div>
      {CONTENT[active]}
      {!doneSections.has(active) ? (
        <button className="btn btn-primary" onClick={() => onTopicDone(active)}>Mark as Reviewed ✓</button>
      ) : (
        <div style={{ color: 'var(--accent2)', fontSize: 13, marginTop: 4 }}>✓ Reviewed</div>
      )}
    </SidebarLayout>
  );
}
