import { useState } from 'react';
import Accordion from '../components/Accordion';
import { Card, CardHeader } from '../components/Card';
import { SidebarLayout, SidebarSection, SidebarItem } from '../components/SidebarLayout';

const TOPICS = [
  { id: 'framework',     label: 'Design Framework' },
  { id: 'nextjs',        label: 'React/Next.js App Architecture' },
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
  nextjs: (
    <Card>
      <CardHeader title="Design: Production React/Next.js Application" tag="Your Strongest Area" tagColor="green" />
      <div className="highlight green"><p><strong>Play to your strength here.</strong> Drive the conversation toward rendering strategy, caching, performance, and security — areas where deep React/Next.js knowledge shines.</p></div>
      <Accordion title="Rendering Strategy Decision Tree" defaultOpen>
        <div className="arch-diagram">{`Does the page need user-specific data?
├── YES → Is real-time data required?
│         ├── YES → CSR (client-side fetch after hydration)
│         └── NO  → SSR (getServerSideProps / Server Component)
└── NO  → Does content change often?
          ├── YES (minutes/hours) → ISR (revalidate: 60)
          └── NO  (rarely)       → SSG (build time, fastest TTFB)`}</div>
        <ul>
          <li><strong>SSG</strong> — built at deploy time, served from CDN. Best TTFB. Marketing pages, docs.</li>
          <li><strong>ISR</strong> — regenerates pages in background after revalidate seconds. Product pages, news.</li>
          <li><strong>SSR</strong> — rendered per request on server. Auth-gated pages, personalized dashboards.</li>
          <li><strong>CSR</strong> — shell from server, data fetched client-side. Real-time feeds, user-specific widgets.</li>
        </ul>
        <div className="highlight">
          <p><strong>App Router (Next.js 13+):</strong> Server Components are the default — zero JS sent to client. Add <code>'use client'</code> only at the leaf that needs interactivity. This alone can eliminate 60-80% of client bundle size.</p>
        </div>
      </Accordion>
      <Accordion title="High-Level Architecture Diagram">
        <div className="arch-diagram">{`Browser
  |
CloudFront (CDN)
  ├── /static/* → S3 (CSS, JS chunks, images)
  └── /* → Next.js on Lambda@Edge / Vercel / ECS
              |
              ├── Server Components → direct DB/API calls (no round trip)
              ├── API Routes (/api/*) → BFF layer
              │     ├── Auth check (NextAuth / Cognito)
              │     ├── Rate limiting (upstash/redis)
              │     └── Downstream microservices / Lambda
              └── Middleware (Edge) → auth redirect, A/B, geo

Data Layer:
  ├── Redis (ElastiCache) — session, API response cache
  ├── DynamoDB / RDS — application data
  └── CDN cache — static + ISR pages (edge)`}</div>
      </Accordion>
      <Accordion title="Caching Strategy (layered)">
        <ul>
          <li><strong>CDN (CloudFront):</strong> Cache-Control headers on SSG/ISR pages — served globally with no compute</li>
          <li><strong>Next.js Data Cache:</strong> <code>fetch(url, {'{ next: { revalidate: 60 } }'})</code> in Server Components — persisted across requests</li>
          <li><strong>React Query / SWR:</strong> Client-side stale-while-revalidate — instant UI + background refresh</li>
          <li><strong>Redis (ElastiCache):</strong> Cache expensive DB queries or 3rd party API responses in API routes</li>
        </ul>
        <pre><code>{`// Next.js 14 — granular cache control per fetch
const data = await fetch('/api/products', {
  next: {
    revalidate: 300,          // ISR — regenerate after 5 min
    tags: ['products'],       // cache tag for on-demand invalidation
  }
});

// On-demand revalidation (e.g. after CMS publish webhook)
import { revalidateTag } from 'next/cache';
revalidateTag('products'); // purges all fetches tagged 'products'`}</code></pre>
      </Accordion>
      <Accordion title="Authentication Architecture">
        <pre><code>{`// NextAuth.js (Auth.js v5) — most common pattern
// auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CognitoProvider({ clientId, clientSecret, issuer }),
  ],
  callbacks: {
    jwt({ token, account }) {
      if (account) token.accessToken = account.access_token;
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

// Middleware — protect routes at the Edge (before page renders)
// middleware.ts
export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});
export const config = { matcher: ['/dashboard/:path*'] };`}</code></pre>
        <p><strong>Security note:</strong> Validate session on the server for every sensitive API route — never trust client-side auth state alone.</p>
      </Accordion>
      <Accordion title="Performance Wins to Mention">
        <div className="grid-2">
          <div>
            <h3>Bundle Size</h3>
            <ul>
              <li>Server Components = zero client JS by default</li>
              <li><code>next/dynamic</code> for heavy client components (rich text editors, charts)</li>
              <li>Tree-shake icon libs: import <code>{'{ IconName }'}</code> not entire pack</li>
              <li>Analyze with <code>@next/bundle-analyzer</code></li>
            </ul>
          </div>
          <div>
            <h3>Core Web Vitals</h3>
            <ul>
              <li><strong>LCP:</strong> <code>next/image</code> with <code>priority</code> on hero, preconnect fonts</li>
              <li><strong>CLS:</strong> Reserve space for images (<code>width</code>/<code>height</code>), avoid dynamic content above fold</li>
              <li><strong>INP:</strong> Offload heavy work to Web Workers, use <code>useTransition</code> for non-urgent updates</li>
              <li><strong>TTFB:</strong> ISR/SSG over SSR where possible, edge runtime</li>
            </ul>
          </div>
        </div>
      </Accordion>
      <Accordion title="Security Checklist">
        <ul>
          <li><strong>CSP headers:</strong> Set via <code>next.config.js</code> headers or middleware — prevent XSS</li>
          <li><strong>CSRF:</strong> API routes use <code>SameSite=Strict</code> cookies + origin checks</li>
          <li><strong>Input validation:</strong> Zod on both client (form) and server (API route) — never trust client</li>
          <li><strong>Secrets:</strong> Never in client bundle — only <code>NEXT_PUBLIC_</code> vars reach the browser</li>
          <li><strong>Rate limiting:</strong> Upstash Redis rate limiter in middleware or API routes</li>
          <li><strong>Dependency scanning:</strong> <code>npm audit</code> + Snyk in CI — <code>next</code> updates frequently</li>
        </ul>
        <pre><code>{`// next.config.js — security headers
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Content-Security-Policy', value: "default-src 'self';" },
];
module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};`}</code></pre>
      </Accordion>
      <Accordion title="Deployment Options & Tradeoffs">
        <div className="grid-2">
          <div>
            <h3>Vercel (simplest)</h3>
            <ul><li>Zero-config, auto ISR, Edge Runtime</li><li>Preview deployments per PR</li><li>Best DX, but vendor lock-in</li><li>Use when: fast shipping, startup/team</li></ul>
          </div>
          <div>
            <h3>AWS (enterprise)</h3>
            <ul><li>ECS Fargate (containerized Next.js server)</li><li>Lambda@Edge for SSR at CDN edge</li><li>OpenNext adapter for serverless deploy</li><li>Use when: existing AWS infra, compliance</li></ul>
          </div>
        </div>
        <div className="highlight orange" style={{ marginTop: 12 }}>
          <p><strong>INDG context:</strong> They use AWS — position your Next.js experience alongside ECS/Lambda deployment, CloudFront CDN, and Cognito auth. Mention you've shipped or designed full-stack Next.js apps and understand the infra behind them, not just the framework.</p>
        </div>
      </Accordion>
    </Card>
  ),
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
