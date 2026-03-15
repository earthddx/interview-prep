import { useState } from 'react';
import Accordion from '../components/Accordion';
import { Card, CardHeader } from '../components/Card';
import { SidebarLayout, SidebarSection, SidebarItem } from '../components/SidebarLayout';
import CodeBlock from '../components/CodeBlock';

const TOPICS = [
  { id: 'framework',     label: 'Design Framework' },
  { id: 'nextjs',        label: 'React/Next.js App Architecture' },
  { id: 'reactnative',   label: 'React Native App Architecture' },
  { id: 'statemanage',   label: 'State Management at Scale' },
  { id: 'socialfeed',    label: 'Design a Social Feed' },
  { id: 'microfrontend', label: 'Microfrontend' },
  { id: 'cicd',          label: 'CI/CD & DevSecOps Pipeline' },
  { id: 'nextrag',       label: 'RAG App (next-rag)' },
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
        <CodeBlock>{`// Next.js 14 — granular cache control per fetch
const data = await fetch('/api/products', {
  next: {
    revalidate: 300,          // ISR — regenerate after 5 min
    tags: ['products'],       // cache tag for on-demand invalidation
  }
});

// On-demand revalidation (e.g. after CMS publish webhook)
import { revalidateTag } from 'next/cache';
revalidateTag('products'); // purges all fetches tagged 'products'`}</CodeBlock>
      </Accordion>
      <Accordion title="Authentication Architecture">
        <CodeBlock>{`// NextAuth.js (Auth.js v5) — most common pattern
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
export const config = { matcher: ['/dashboard/:path*'] };`}</CodeBlock>
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
        <CodeBlock>{`// next.config.js — security headers
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
};`}</CodeBlock>
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
          <p><strong>Tip:</strong> Position your Next.js experience alongside ECS/Lambda deployment, CloudFront CDN, and Cognito auth. Mention you've shipped or designed full-stack Next.js apps and understand the infra behind them, not just the framework.</p>
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
            <p><strong>Tip:</strong> Always weave in AWS services and DevSecOps security considerations — interviewers at cloud-native companies explicitly care about this.</p>
          </div>
        </div>
      </div>
    </Card>
  ),
  reactnative: (
    <Card>
      <CardHeader title="Design: React Native App Architecture" tag="Your Stack" tagColor="green" />
      <div className="highlight green"><p><strong>Play to your strength.</strong> Drive toward navigation architecture, offline-first patterns, performance, and OTA updates — areas where deep RN/Expo knowledge stands out.</p></div>
      <Accordion title="High-Level Architecture" defaultOpen>
        <div className="arch-diagram">{`┌─────────────────────────────────┐
│         React Native App        │
│  ┌──────────────────────────┐   │
│  │  Expo Router / Navigation│   │  ← screen stack, tabs, modals
│  ├──────────────────────────┤   │
│  │  UI Layer (components)   │   │  ← NativeWind / StyleSheet
│  ├──────────────────────────┤   │
│  │  State Layer             │   │  ← Zustand (global) + React Query (server)
│  ├──────────────────────────┤   │
│  │  Data / Cache Layer      │   │  ← MMKV (fast local) + AsyncStorage
│  └──────────────────────────┘   │
└──────────────┬──────────────────┘
               │ REST / GraphQL
        ┌──────┴──────┐
        │  Next.js /  │   ← API routes as BFF
        │  Node API   │
        └─────────────┘`}</div>
      </Accordion>
      <Accordion title="Navigation Architecture (Expo Router)">
        <p>Expo Router uses file-based routing — same mental model as Next.js App Router.</p>
        <CodeBlock>{`app/
  _layout.tsx          ← root layout, auth guard here
  (auth)/
    login.tsx
    register.tsx
  (tabs)/
    _layout.tsx        ← tab bar definition
    index.tsx          ← Home tab
    profile.tsx        ← Profile tab
  post/
    [id].tsx           ← dynamic route

// Auth guard in root layout
export default function RootLayout() {
  const { session } = useAuth();
  return (
    <Stack>
      {session ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
    </Stack>
  );
}`}</CodeBlock>
      </Accordion>
      <Accordion title="State Management Strategy">
        <div className="grid-2">
          <div>
            <h3>Server State → React Query</h3>
            <ul>
              <li>Remote data, loading/error states</li>
              <li>Background refetch, stale-while-revalidate</li>
              <li>Optimistic updates for likes/follows</li>
              <li>Infinite queries for feeds</li>
            </ul>
          </div>
          <div>
            <h3>Client State → Zustand</h3>
            <ul>
              <li>Auth session, user preferences</li>
              <li>UI state (modals, selected tab)</li>
              <li>Lightweight — no boilerplate</li>
              <li>Persist to MMKV for offline</li>
            </ul>
          </div>
        </div>
        <CodeBlock>{`// React Query — infinite feed
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  getNextPageParam: (last) => last.nextCursor,
});

// Optimistic like
const mutation = useMutation({
  mutationFn: likePost,
  onMutate: async (postId) => {
    await queryClient.cancelQueries({ queryKey: ['feed'] });
    const prev = queryClient.getQueryData(['feed']);
    queryClient.setQueryData(['feed'], (old) => toggleLike(old, postId));
    return { prev };
  },
  onError: (_, __, ctx) => queryClient.setQueryData(['feed'], ctx.prev),
});`}</CodeBlock>
      </Accordion>
      <Accordion title="Performance Patterns">
        <ul>
          <li><strong>FlashList over FlatList:</strong> Recycling-based renderer — dramatically better on large lists (Instagram uses this)</li>
          <li><strong>Image caching:</strong> <code>expo-image</code> with built-in memory + disk cache, blurhash placeholders</li>
          <li><strong>Memo boundaries:</strong> <code>React.memo</code> on list item components — prevents full list re-renders on parent state change</li>
          <li><strong>Avoid inline functions in JSX:</strong> New reference every render → breaks memo. Extract or use <code>useCallback</code>.</li>
          <li><strong>Reanimated for animations:</strong> Runs on the UI thread — no JS bridge jank. Use for gestures, transitions.</li>
          <li><strong>OTA updates:</strong> Expo Updates for JS bundle patches without App Store review. Keep native changes behind a store release.</li>
        </ul>
        <CodeBlock>{`// FlashList — drop-in FlatList replacement
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={posts}
  renderItem={({ item }) => <PostCard post={item} />}
  estimatedItemSize={200}    // key for perf — estimate your item height
  onEndReached={fetchNextPage}
  onEndReachedThreshold={0.5}
/>`}</CodeBlock>
      </Accordion>
      <Accordion title="Offline-First Strategy">
        <p>Mobile users lose connectivity. Design around it, not against it.</p>
        <ul>
          <li><strong>MMKV:</strong> 10x faster than AsyncStorage. Use for auth tokens, user prefs, draft posts.</li>
          <li><strong>React Query persistence:</strong> Persist the query cache to MMKV — stale data shown instantly on launch, then refetched in background.</li>
          <li><strong>Optimistic updates:</strong> Apply changes to local cache immediately; reconcile on reconnect.</li>
          <li><strong>NetInfo:</strong> <code>@react-native-community/netinfo</code> — detect connectivity and queue writes for when online.</li>
        </ul>
      </Accordion>
    </Card>
  ),
  statemanage: (
    <Card>
      <CardHeader title="Design: State Management at Scale" tag="React / Next.js" tagColor="orange" />
      <div className="highlight"><p><strong>Core Rule:</strong> Split state by <em>who owns it</em>. Server state (remote data) and client state (UI) have completely different lifecycles — mixing them is where complexity explodes.</p></div>
      <Accordion title="State Classification" defaultOpen>
        <div className="arch-diagram">{`State Type      Source          Tool                  Example
──────────────────────────────────────────────────────────────
Server state    Remote API      React Query / SWR     posts, user profile
Global UI       In-app          Zustand / Redux        auth, theme, cart
Local UI        Component       useState / useReducer  modal open, form input
URL state       Browser URL     useSearchParams        filters, pagination
Form state      User input      React Hook Form        checkout form`}</div>
        <p><strong>Biggest mistake:</strong> putting server data into Redux/Zustand and manually managing loading/error/stale states. React Query handles all of that for free.</p>
      </Accordion>
      <Accordion title="Decision Tree — Which Tool?">
        <div className="arch-diagram">{`Is it data fetched from an API?
└── YES → React Query (TanStack Query)
    Handles: caching, deduplication, background refresh,
             pagination, optimistic updates, error retry

Is it shared across many components (not server data)?
├── YES, complex (many slices, devtools needed) → Redux Toolkit
└── YES, simple                                 → Zustand

Is it only used within one component or its children?
└── YES → useState / useReducer / Context

Is it reflected in the URL (shareable, back-button aware)?
└── YES → useSearchParams (Next.js) / URL state`}</div>
      </Accordion>
      <Accordion title="React Query — Patterns to Know">
        <CodeBlock>{`// Basic query
const { data, isLoading, error } = useQuery({
  queryKey: ['user', userId],   // cache key — array for namespacing
  queryFn: () => fetchUser(userId),
  staleTime: 1000 * 60 * 5,    // data fresh for 5 min
});

// Dependent query (wait for userId before fetching)
const { data: posts } = useQuery({
  queryKey: ['posts', userId],
  queryFn: () => fetchPosts(userId),
  enabled: !!userId,            // don't run until userId exists
});

// Mutation with cache invalidation
const mutation = useMutation({
  mutationFn: updateProfile,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['user', userId] });
    // ↑ marks cache stale → triggers background refetch
  },
});

// Prefetch on hover (instant navigation feel)
const queryClient = useQueryClient();
<Link
  onMouseEnter={() =>
    queryClient.prefetchQuery({ queryKey: ['post', id], queryFn: () => fetchPost(id) })
  }
/>`}</CodeBlock>
      </Accordion>
      <Accordion title="Zustand — Lightweight Global State">
        <CodeBlock>{`import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth store — persisted to localStorage / MMKV
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }  // storage key
  )
);

// Usage
const { user, login, logout } = useAuthStore();`}</CodeBlock>
        <p><strong>Why Zustand over Context?</strong> Context re-renders every consumer on any state change. Zustand uses selectors — components only re-render when the slice they subscribe to changes.</p>
        <CodeBlock>{`// Context — ALL consumers re-render when ANY value changes
const { user, theme, cart } = useContext(AppContext); // bad at scale

// Zustand — only re-renders when 'user' changes
const user = useAuthStore((state) => state.user); // efficient`}</CodeBlock>
      </Accordion>
      <Accordion title="Context API — When It's Fine">
        <p>Context isn't bad — it's just misused. It's great for:</p>
        <ul>
          <li><strong>Static or rarely-changing values</strong> — theme, locale, feature flags</li>
          <li><strong>Dependency injection</strong> — passing a service/config down a subtree</li>
          <li><strong>Compound components</strong> — sharing state between a parent and its direct children</li>
        </ul>
        <p><strong>Avoid Context for:</strong> frequently updating state (form input, mouse position, real-time data) — every update re-renders all consumers.</p>
      </Accordion>
    </Card>
  ),
  socialfeed: (
    <Card>
      <CardHeader title="Design: Social Feed (Instagram-like)" tag="Relevant to Your Projects" tagColor="green" />
      <div className="highlight green"><p><strong>Prompt:</strong> "Design the feed screen for a photo-sharing app. Users can post images, follow others, like posts, and scroll an infinite feed."</p></div>
      <Accordion title="High-Level Architecture" defaultOpen>
        <div className="arch-diagram">{`React Native App (Expo)
  │
  ├── Feed Screen
  │     ├── FlashList (virtualized, infinite scroll)
  │     ├── React Query useInfiniteQuery (cursor pagination)
  │     └── Optimistic likes (local cache update before server confirms)
  │
  ├── Post Upload
  │     ├── expo-image-picker → compress client-side
  │     ├── Presigned S3 URL → upload direct from device (no server proxy)
  │     └── POST /api/posts (metadata: caption, location, S3 key)
  │
  └── Real-time (likes/comments count)
        └── Polling every 30s OR WebSocket for live updates

Next.js API (BFF)
  ├── GET  /api/feed?cursor=...   → paginated posts
  ├── POST /api/posts             → create post (metadata to DB)
  ├── POST /api/posts/:id/like    → toggle like
  └── GET  /api/upload-url        → issue presigned S3 URL

Data:
  ├── PostgreSQL — users, posts, follows, likes (relational)
  └── S3 + CloudFront CDN — image storage & delivery`}</div>
      </Accordion>
      <Accordion title="Feed Pagination — Cursor vs Offset">
        <CodeBlock>{`// Cursor-based (use this for feeds — stable even as new posts arrive)
GET /api/feed?limit=20&cursor=eyJpZCI6MTAwfQ==

// Response
{
  "posts": [...],
  "nextCursor": "eyJpZCI6ODB9",
  "hasMore": true
}

// React Query infinite scroll
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam }) =>
    fetch(\`/api/feed?cursor=\${pageParam}&limit=20\`).then(r => r.json()),
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  initialPageParam: undefined,
});

// Trigger on scroll — FlashList onEndReached
<FlashList
  data={data?.pages.flatMap(p => p.posts)}
  onEndReached={() => hasNextPage && fetchNextPage()}
  onEndReachedThreshold={0.5}
/>`}</CodeBlock>
        <p><strong>Why cursor over offset?</strong> If someone posts while a user is scrolling, offset shifts — duplicates or skips items. Cursor anchors to a specific row ID.</p>
      </Accordion>
      <Accordion title="Image Upload — Presigned URL Pattern">
        <div className="arch-diagram">{`Device                  Next.js API           S3
  │                          │                  │
  │  GET /api/upload-url     │                  │
  │ ────────────────────────>│                  │
  │                          │  generatePresignedUrl()
  │                          │ ──────────────────>│
  │   { url, key }           │                  │
  │ <────────────────────────│                  │
  │                          │                  │
  │  PUT image directly to S3 (presigned URL)   │
  │ ────────────────────────────────────────────>│
  │                          │                  │
  │  POST /api/posts { key, caption }            │
  │ ────────────────────────>│                  │
  │                          │  save metadata to DB`}</div>
        <p><strong>Why presigned URLs?</strong> The image never passes through your server — saves bandwidth cost, reduces server load, and S3 handles large file uploads natively.</p>
        <CodeBlock>{`// Client — compress before upload
import * as ImageManipulator from 'expo-image-manipulator';

const compressed = await ImageManipulator.manipulateAsync(
  uri,
  [{ resize: { width: 1080 } }],
  { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
);

// 1. Get presigned URL
const { url, key } = await fetch('/api/upload-url').then(r => r.json());

// 2. Upload direct to S3
await fetch(url, { method: 'PUT', body: await fetch(compressed.uri).then(r => r.blob()) });

// 3. Save post metadata
await fetch('/api/posts', {
  method: 'POST',
  body: JSON.stringify({ key, caption }),
});`}</CodeBlock>
      </Accordion>
      <Accordion title="Optimistic Likes">
        <p>Update the UI instantly — don't wait for the server. Roll back on error.</p>
        <CodeBlock>{`const likeMutation = useMutation({
  mutationFn: (postId) => fetch(\`/api/posts/\${postId}/like\`, { method: 'POST' }),
  onMutate: async (postId) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['feed'] });
    // Snapshot previous value for rollback
    const prev = queryClient.getQueryData(['feed']);
    // Optimistically toggle like in cache
    queryClient.setQueryData(['feed'], (old) =>
      old.pages.map(page => ({
        ...page,
        posts: page.posts.map(p =>
          p.id === postId
            ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 }
            : p
        )
      }))
    );
    return { prev };
  },
  onError: (_, __, ctx) => queryClient.setQueryData(['feed'], ctx.prev),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
});`}</CodeBlock>
      </Accordion>
      <Accordion title="Real-Time Updates — Polling vs WebSocket vs SSE">
        <div className="grid-2">
          <div>
            <h3>Polling (simplest)</h3>
            <ul>
              <li>React Query <code>refetchInterval: 30000</code></li>
              <li>Good for: like counts, comment counts</li>
              <li>Trade-off: 30s delay, wasted requests</li>
            </ul>
            <h3 style={{ marginTop: 12 }}>SSE (Server-Sent Events)</h3>
            <ul>
              <li>Server pushes updates over HTTP</li>
              <li>One-directional — good for notifications</li>
              <li>Works through proxies/firewalls</li>
            </ul>
          </div>
          <div>
            <h3>WebSocket (real-time)</h3>
            <ul>
              <li>Bi-directional, persistent connection</li>
              <li>Good for: live comments, DMs, presence</li>
              <li>Trade-off: stateful — harder to scale horizontally (need sticky sessions or Redis pub/sub)</li>
            </ul>
          </div>
        </div>
        <div className="highlight orange" style={{ marginTop: 12 }}>
          <p><strong>Interview tip:</strong> For a feed, polling every 30s is usually enough — users don't expect instant like count sync. Reserve WebSockets for DMs or live comment threads where real-time is the core feature.</p>
        </div>
      </Accordion>
    </Card>
  ),
  microfrontend: (
    <Card>
      <CardHeader title="Design: Microfrontend Architecture" tag="High Value Topic" tagColor="orange" />
      <div className="highlight orange"><p><strong>Microfrontend</strong> appears explicitly in many JDs — know this well.</p></div>
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
  nextrag: (
    <Card>
      <CardHeader title="Design: RAG Application (next-rag)" tag="My Project" tagColor="blue" />
      <div className="highlight green">
        <p><strong>I built this.</strong> Use it as a concrete example of applying RAG architecture in a production Next.js app — walk the interviewer through any layer with confidence.</p>
      </div>
      <Accordion title="What It Does & Why RAG" defaultOpen>
        <p>A document Q&amp;A app: upload a file, ask questions in natural language, get AI answers grounded in the document's content. RAG (Retrieval-Augmented Generation) prevents hallucinations by giving the LLM only relevant retrieved context rather than relying on its training data alone.</p>
        <div className="arch-diagram">{`Without RAG: User Query → LLM → Answer (may hallucinate)
With RAG:    User Query → Vector Search → Top-K Chunks
                                          + Query → LLM → Grounded Answer`}</div>
      </Accordion>
      <Accordion title="Full Architecture Diagram">
        <div className="arch-diagram">{`Browser (Next.js 16 App Router, React 19, Tailwind, shadcn/ui)
  |
  ├── Upload flow
  │     ├── File sent to Next.js API Route
  │     ├── Stored in Vercel Blob (CDN-backed object storage)
  │     ├── Text extracted (pdf2json / mammoth / officeparser)
  │     ├── Text chunked into segments
  │     ├── Embedding generated per chunk (OpenAI / Anthropic)
  │     └── Vectors + metadata saved → PostgreSQL + pgvector
  │
  └── Chat flow
        ├── User query → embed query (same model)
        ├── pgvector similarity search → Top-K relevant chunks
        ├── Chunks + query → LLM prompt (Vercel AI SDK)
        ├── Streamed response → UI
        └── Conversation saved to PostgreSQL

Auth: NextAuth.js + OAuth (per-user document isolation)
DB:   PostgreSQL (Prisma ORM) + pgvector extension`}</div>
      </Accordion>
      <Accordion title="Key Design Decisions & Tradeoffs">
        <ul>
          <li><strong>Why pgvector over a dedicated vector DB?</strong> Keeps the stack simple — one DB handles relational data (users, documents, chat history) and vector search. Pinecone/Weaviate add operational overhead; pgvector is good enough for most scales.</li>
          <li><strong>Why chunk text?</strong> LLMs have context limits. Chunking lets you retrieve only the relevant 3-5 paragraphs, keeping prompts lean and cost-effective.</li>
          <li><strong>Why Vercel Blob?</strong> Avoids S3 setup complexity. Serverless, globally distributed, CDN-backed. Tradeoff: vendor lock-in.</li>
          <li><strong>Why Vercel AI SDK?</strong> Provider-agnostic — swap OpenAI for Anthropic with one line. Handles streaming out of the box.</li>
          <li><strong>Multi-user isolation:</strong> Each document is scoped to an authenticated user via NextAuth. Queries only search that user's vectors — enforced at the DB query layer.</li>
        </ul>
        <div className="highlight orange">
          <p><strong>Tradeoff to mention:</strong> Chunk size is a tunable parameter. Large chunks = more context but noisier retrieval. Small chunks = precise retrieval but may lack context. Overlap between chunks helps with boundary cases.</p>
        </div>
      </Accordion>
      <Accordion title="RAG Pipeline Code">
        <CodeBlock>{`// 1. Generate embedding for a text chunk
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: chunk,
});

// 2. Store in PostgreSQL with pgvector
await prisma.$executeRaw\`
  INSERT INTO embeddings (document_id, content, embedding)
  VALUES (\${docId}, \${chunk}, \${embedding.data[0].embedding}::vector)
\`;

// 3. At query time — find top-K similar chunks
const results = await prisma.$queryRaw\`
  SELECT content, 1 - (embedding <=> \${queryEmbedding}::vector) AS similarity
  FROM embeddings
  WHERE document_id = \${docId}
  ORDER BY embedding <=> \${queryEmbedding}::vector
  LIMIT 5
\`;

// 4. Build prompt with retrieved context
const context = results.map(r => r.content).join('\\n\\n');
const prompt = \`Answer using only the context below:\\n\${context}\\n\\nQuestion: \${userQuery}\`;`}</CodeBlock>
      </Accordion>
      <Accordion title="Scaling Considerations">
        <div className="grid-2">
          <div>
            <h3>Current (Single-user scale)</h3>
            <ul>
              <li>PostgreSQL + pgvector on single instance</li>
              <li>Vercel serverless functions for API routes</li>
              <li>Synchronous embedding on upload</li>
              <li>Good for: demos, small teams, MVPs</li>
            </ul>
          </div>
          <div>
            <h3>Production Scale-Up</h3>
            <ul>
              <li>Async embedding via SQS + Lambda worker</li>
              <li>pgvector index (IVFFlat/HNSW) for large datasets</li>
              <li>Dedicated vector DB (Pinecone) at 100M+ vectors</li>
              <li>Redis cache for frequent query embeddings</li>
            </ul>
          </div>
        </div>
      </Accordion>
      <Accordion title="Security & Auth Design">
        <ul>
          <li><strong>NextAuth.js + OAuth:</strong> No password storage. Session tokens in httpOnly cookies.</li>
          <li><strong>Row-level isolation:</strong> All DB queries filter by <code>userId</code> — a user can never retrieve another user's vectors.</li>
          <li><strong>File validation:</strong> MIME type + size limit (10MB) enforced server-side before processing.</li>
          <li><strong>Secrets:</strong> OpenAI/Anthropic API keys in env vars, never in client bundle.</li>
          <li><strong>Prompt injection risk:</strong> A document could contain instructions to manipulate the LLM. Mitigation: system prompt instructs model to only answer from context; user content treated as data, not instructions.</li>
        </ul>
      </Accordion>
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
      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>Tailored for React, React Native, and Next.js engineers</div>
      {CONTENT[active]}
      {!doneSections.has(active) ? (
        <button className="btn btn-primary" onClick={() => onTopicDone(active)}>Mark as Reviewed ✓</button>
      ) : (
        <div style={{ color: 'var(--accent2)', fontSize: 13, marginTop: 4 }}>✓ Reviewed</div>
      )}
    </SidebarLayout>
  );
}
