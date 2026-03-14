import { useState } from 'react';
import Accordion from '../components/Accordion';
import { Card, CardHeader } from '../components/Card';
import { SidebarLayout, SidebarSection, SidebarItem } from '../components/SidebarLayout';

const TOPICS = [
  { id: 'framework',     label: 'Design Framework' },
  { id: 'serverless',    label: 'Serverless API Platform' },
  { id: 'microservices', label: 'Microservices Architecture' },
  { id: 'eventdriven',   label: 'Event-Driven System' },
  { id: 'microfrontend', label: 'Microfrontend' },
  { id: 'cicd',          label: 'CI/CD & DevSecOps Pipeline' },
];

const AWS_REF = [
  ['Lambda','serverless compute'],['SQS','message queue (async decoupling)'],['SNS','pub/sub notifications'],
  ['EventBridge','event bus'],['API GW','REST/WebSocket gateway'],['DynamoDB','NoSQL, key-value'],
  ['Aurora','managed SQL (RDS)'],['CloudFront','CDN + edge'],['Cognito','auth + identity'],['EKS/ECS','container orchestration'],
];

const CONTENT = {
  framework: (
    <Card>
      <CardHeader title="System Design Framework (use every time)" tag="Do This First" tagColor="red" />
      <div className="grid-2">
        <div>
          <h3>Step 1: Clarify Requirements (5 min)</h3>
          <ul>
            <li>What are the functional requirements?</li>
            <li>Non-functional: scale, latency, availability?</li>
            <li>How many users / requests per second?</li>
            <li>Read-heavy or write-heavy?</li>
            <li>Consistency vs availability tolerance?</li>
            <li>What's in scope vs out of scope?</li>
          </ul>
          <div className="highlight" style={{ marginTop: 10 }}>
            <p>Good numbers: 100K DAU ≈ 1-2 RPS. 1M DAU ≈ 10-20 RPS. 1B DAU ≈ 10K+ RPS.</p>
          </div>
          <h3 style={{ marginTop: 16 }}>Step 2: High-Level Design (10 min)</h3>
          <ul>
            <li>Draw major components: clients, LB, services, DBs, caches</li>
            <li>Show data flow through the system</li>
            <li>Choose DB type (SQL vs NoSQL) with reasoning</li>
            <li>Define API contracts between services</li>
          </ul>
        </div>
        <div>
          <h3>Step 3: Deep Dive (10 min)</h3>
          <ul>
            <li>Pick the hardest component to go deep on</li>
            <li>How does scaling work? (horizontal vs vertical)</li>
            <li>Where are bottlenecks? How addressed?</li>
            <li>Caching strategy: what, TTL, invalidation</li>
            <li>Data partitioning / sharding</li>
            <li><strong>Security at each layer</strong> (auth, encryption, WAF)</li>
          </ul>
          <h3 style={{ marginTop: 16 }}>Step 4: Wrap Up (5 min)</h3>
          <ul>
            <li>Identify tradeoffs you made and why</li>
            <li>What would you do with more time?</li>
            <li>Monitoring: metrics, logs, traces (the 3 pillars)</li>
            <li>Failure modes & recovery</li>
          </ul>
          <div className="highlight green" style={{ marginTop: 10 }}>
            <p><strong>INDG Tip:</strong> Always weave in AWS services and DevSecOps security considerations — they explicitly care about this.</p>
          </div>
        </div>
      </div>
    </Card>
  ),
  serverless: (
    <Card>
      <CardHeader title="Design: Serverless Customer-Facing API Platform" tag="AWS Serverless" />
      <div className="highlight"><p><strong>Prompt:</strong> "Design a high-availability REST API platform for a customer-facing web app. 50K users, low latency reads, auto-scaling."</p></div>
      <div className="arch-diagram">{`Client (React/Next.js)
        |
   CloudFront (CDN, edge caching, WAF)
        |
   API Gateway (rate limiting, auth, CORS)
        |
   Lambda Functions (stateless, auto-scale)
     /         \\         \\
DynamoDB    ElastiCache   S3
(main DB)   (Redis cache)  (static assets)
        |
   EventBridge → SQS → Lambda (async jobs)
        |
   CloudWatch (logs, metrics, alarms)
   X-Ray (distributed tracing)`}</div>
      <h3>Key Design Decisions</h3>
      <ul>
        <li><strong>Why Lambda?</strong> Auto-scales to zero, no server management, pay per invocation</li>
        <li><strong>Why DynamoDB?</strong> Single-digit ms reads at any scale, serverless, multi-region</li>
        <li><strong>Why CloudFront?</strong> Edge caching reduces Lambda invocations and global latency</li>
        <li><strong>Security:</strong> Cognito for auth, WAF for OWASP, IAM least-privilege, KMS encryption at rest</li>
        <li><strong>Observability:</strong> CloudWatch metrics/alarms, X-Ray tracing, structured JSON logging</li>
      </ul>
      <div className="highlight orange">
        <p><strong>Tradeoff:</strong> Lambda cold starts (100-300ms) vs always-on ECS. Mitigation: provisioned concurrency for critical paths.</p>
      </div>
    </Card>
  ),
  microservices: (
    <Card>
      <CardHeader title="Design: Microservices Architecture" tag="Enterprise Scale" tagColor="green" />
      <div className="highlight"><p><strong>Prompt:</strong> "Break down a monolithic app into microservices. Ensure services are loosely coupled and independently deployable."</p></div>
      <h3>Service Decomposition (by business domain)</h3>
      <div className="grid-2">
        <ul>
          <li><strong>User Service</strong> — auth, profile, preferences</li>
          <li><strong>Product Service</strong> — catalog, search, inventory</li>
          <li><strong>Order Service</strong> — order lifecycle, state machine</li>
          <li><strong>Payment Service</strong> — PCI-DSS compliant, isolated</li>
        </ul>
        <ul>
          <li><strong>Notification Service</strong> — email, SMS, push</li>
          <li><strong>Analytics Service</strong> — event streaming, reporting</li>
          <li><strong>API Gateway</strong> — routing, auth, rate limiting</li>
          <li><strong>Service Mesh</strong> — Istio for inter-service security</li>
        </ul>
      </div>
      <h3>Communication Patterns</h3>
      <ul>
        <li><strong>Synchronous (REST/gRPC)</strong>: User → Order (needs immediate response)</li>
        <li><strong>Asynchronous (SQS/SNS)</strong>: Order → Notification (fire and forget)</li>
        <li><strong>Event Streaming (Kafka/Kinesis)</strong>: analytics, audit logs, replay</li>
      </ul>
      <div className="highlight purple">
        <p><strong>Patterns to mention:</strong> Saga (distributed transactions), Circuit Breaker (resilience), Outbox pattern (eventual consistency), Strangler Fig (migration from monolith).</p>
      </div>
    </Card>
  ),
  eventdriven: (
    <Card>
      <CardHeader title="Design: Event-Driven Architecture" tag="Modern Pattern" tagColor="purple" />
      <div className="arch-diagram">{`Producer Services
        |
   EventBridge (event bus + routing rules)
   /    |    \\
SQS   SQS   SQS  (per consumer — decoupled)
 |     |     |
Lambda Lambda Lambda  (consumers)
 |     |     |
DB    DB    External API`}</div>
      <h3>Core Concepts</h3>
      <ul>
        <li><strong>Events vs Commands:</strong> Events describe what happened ("OrderPlaced"). Commands tell something to do ("ProcessPayment").</li>
        <li><strong>Idempotency:</strong> Consumers must handle duplicate events. Use idempotency keys.</li>
        <li><strong>Dead Letter Queues (DLQ):</strong> For events that fail processing. Always configure with alerting.</li>
        <li><strong>Event schema registry:</strong> AWS Glue Schema Registry to track event shapes.</li>
        <li><strong>Ordering:</strong> SQS FIFO for strict ordering. Standard SQS for throughput.</li>
      </ul>
      <div className="highlight green">
        <p><strong>Benefits vs Drawbacks:</strong> Benefits: loose coupling, independent scaling, resilience. Drawbacks: eventual consistency, harder debugging (use correlation IDs + distributed tracing).</p>
      </div>
    </Card>
  ),
  microfrontend: (
    <Card>
      <CardHeader title="Design: Microfrontend Architecture" tag="INDG Lists This Explicitly" tagColor="orange" />
      <div className="highlight orange"><p><strong>INDG listed "Microfrontend" by name</strong> in the JD — know this well.</p></div>
      <h3>What Are Microfrontends?</h3>
      <p>Like microservices but for the UI. Each team independently owns and deploys their frontend slice. A shell/host app composes them at runtime.</p>
      <Accordion title="Implementation Approaches" defaultOpen>
        <ul>
          <li><strong>Module Federation (Webpack 5)</strong> — Most common. Host app loads remote modules at runtime. Teams deploy independently.</li>
          <li><strong>iframes</strong> — Hard isolation, but poor UX/performance.</li>
          <li><strong>Web Components</strong> — Framework-agnostic. Good for widgets.</li>
          <li><strong>Edge-side composition</strong> — CloudFront Functions compose fragments at CDN level.</li>
        </ul>
      </Accordion>
      <Accordion title="Challenges & Solutions">
        <div className="grid-2">
          <div><h3>Challenges</h3><ul><li>Shared state management</li><li>Consistent design system</li><li>Auth token sharing</li><li>Bundle duplication (React loaded twice)</li></ul></div>
          <div><h3>Solutions</h3><ul><li>Shared design system / component library</li><li>Event bus for cross-MFE communication</li><li>SharedDependencies in Module Federation</li><li>Single Sign-On via Cognito / OAuth</li></ul></div>
        </div>
      </Accordion>
    </Card>
  ),
  cicd: (
    <Card>
      <CardHeader title="CI/CD & DevSecOps Pipeline Design" tag="DevSecOps Core" tagColor="orange" />
      <div className="arch-diagram">{`Developer → git push
GitHub / CodeCommit
    |  trigger
CodePipeline / GitHub Actions
    |
    ├─ SAST (SonarQube, Checkmarx)
    ├─ Dependency Scan (Snyk, npm audit)
    ├─ Unit Tests + Coverage gate
    ├─ Docker Build + Image Scan (ECR/Trivy)
    ├─ Integration Tests
    ├─ DAST scan (OWASP ZAP)
    ├─ Infrastructure as Code (Terraform/CDK)
    └─ Deploy → Dev → Staging → Prod
              (canary / blue-green)`}</div>
      <h3>Security Gates (Shift-Left)</h3>
      <ul>
        <li><strong>Pre-commit:</strong> secret detection (detect-secrets), lint</li>
        <li><strong>PR:</strong> mandatory code review, SAST scan must pass</li>
        <li><strong>Build:</strong> dependency vulnerability scan, container image scan</li>
        <li><strong>Deploy:</strong> DAST, compliance checks</li>
        <li><strong>Runtime:</strong> WAF, GuardDuty, Security Hub, Config Rules</li>
      </ul>
      <div className="highlight green">
        <p><strong>IaC:</strong> Terraform or AWS CDK for reproducible, version-controlled infrastructure. No manual console changes in prod.</p>
      </div>
      <h3>Deployment Strategies</h3>
      <ul>
        <li><strong>Blue/Green:</strong> Two identical environments, instant rollback by flipping traffic</li>
        <li><strong>Canary:</strong> Roll out 5% → 20% → 100%. Monitor error rates. Auto-rollback.</li>
        <li><strong>Feature Flags:</strong> LaunchDarkly / AWS AppConfig — decouple deploy from release</li>
      </ul>
    </Card>
  ),
};

export default function SystemDesign({ onTopicDone, doneSections }) {
  const [active, setActive] = useState('framework');

  return (
    <SidebarLayout
      sidebar={
        <>
          <SidebarSection title="Scenarios">
            {TOPICS.map(t => (
              <SidebarItem key={t.id} label={t.label} active={active === t.id} done={doneSections.has(t.id)} onClick={() => setActive(t.id)} />
            ))}
          </SidebarSection>
          <SidebarSection title="AWS Quick Ref">
            {AWS_REF.map(([svc, desc]) => (
              <div key={svc} style={{ marginBottom: 6, fontSize: 12, color: 'var(--text-dim)' }}>
                <strong style={{ color: 'var(--accent)' }}>{svc}</strong> — {desc}
              </div>
            ))}
          </SidebarSection>
        </>
      }
    >
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4 }}>System Design Prep</div>
      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>Tailored for cloud-native, serverless, and event-driven at enterprise scale</div>
      {CONTENT[active]}
      {!doneSections.has(active) ? (
        <button className="btn btn-primary" onClick={() => onTopicDone(active)}>Mark as Reviewed ✓</button>
      ) : (
        <div style={{ color: 'var(--accent2)', fontSize: 13, marginTop: 4 }}>✓ Reviewed</div>
      )}
    </SidebarLayout>
  );
}
