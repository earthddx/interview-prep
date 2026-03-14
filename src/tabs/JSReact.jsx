import { useState } from 'react';
import Accordion from '../components/Accordion';
import { Card, CardHeader } from '../components/Card';
import { SidebarLayout, SidebarSection, SidebarItem } from '../components/SidebarLayout';
import Timer from '../components/Timer';

const TOPICS = [
  { id: 'eventloop',    label: 'Event Loop & Concurrency' },
  { id: 'closures',     label: 'Closures, Scope & Hoisting' },
  { id: 'prototypes',   label: 'Prototypes, this & Classes' },
  { id: 'es6',          label: 'ES6+ Must-Know Features' },
  { id: 'rendering',    label: 'React Rendering & Fiber' },
  { id: 'hooks',        label: 'React Hooks Deep Dive' },
  { id: 'state',        label: 'State Management Patterns' },
  { id: 'performance',  label: 'React Performance' },
  { id: 'patterns',     label: 'React Design Patterns' },
  { id: 'react18',      label: 'React 18/19 & Concurrent' },
  { id: 'nodejs',       label: 'Node.js Full-Stack Patterns' },
  { id: 'typescript',   label: 'TypeScript for Full-Stack' },
];

const CONTENT = {
  eventloop: (
    <Card>
      <CardHeader title="Event Loop & Concurrency Model" tag="JavaScript Core" tagColor="purple" />
      <div className="highlight">
        <p><strong>Key Insight:</strong> JavaScript is single-threaded but non-blocking. The event loop lets it handle I/O concurrently via callbacks, Promises (microtasks), and timers (macrotasks).</p>
      </div>
      <Accordion title="Call Stack, Task Queue & Microtask Queue" defaultOpen>
        <div className="arch-diagram">{`Call Stack        Microtask Queue       Macrotask Queue
(synchronous)     (Promises, queueMicrotask)  (setTimeout, setInterval, I/O)

  fn()          → Promise.then()       → setTimeout()
  ↓                ↓ (runs BEFORE       ↓ (runs AFTER
  returns          next macrotask)      microtasks drain)`}</div>
        <pre><code>{`console.log('1');          // sync → Call Stack

setTimeout(() => {
  console.log('4');        // macrotask → runs last
}, 0);

Promise.resolve()
  .then(() => console.log('3')); // microtask → runs before macrotask

console.log('2');          // sync
// Output: 1, 2, 3, 4`}</code></pre>
        <p><strong>Rule:</strong> All microtasks drain completely before the next macrotask picks up. This is why <code>Promise.then</code> always runs before <code>setTimeout(fn, 0)</code>.</p>
      </Accordion>
      <Accordion title="async/await under the hood">
        <p><code>async/await</code> is syntax sugar over Promises. Every <code>await</code> suspends the function and schedules resumption as a microtask.</p>
        <pre><code>{`async function run() {
  console.log('A');
  await Promise.resolve(); // suspends here → microtask
  console.log('C');        // resumes in microtask queue
}
run();
console.log('B');
// Output: A, B, C`}</code></pre>
      </Accordion>
      <Accordion title="Worker Threads & CPU-Bound Work">
        <p>Node.js has Worker Threads for CPU-intensive tasks (image processing, crypto). For I/O, always prefer async — don't block the event loop.</p>
        <pre><code>{`// BAD — blocks event loop for all other requests
const result = crypto.scryptSync(password, salt, 64);

// GOOD — async variant releases event loop
const result = await new Promise((res, rej) =>
  crypto.scrypt(password, salt, 64, (err, key) =>
    err ? rej(err) : res(key)
  )
);`}</code></pre>
      </Accordion>
    </Card>
  ),

  closures: (
    <Card>
      <CardHeader title="Closures, Scope & Hoisting" tag="JavaScript Core" tagColor="purple" />
      <div className="highlight">
        <p><strong>Closure:</strong> A function that retains access to its outer scope even after the outer function has returned. The foundation of modules, memoization, and private state in JS.</p>
      </div>
      <Accordion title="Closure in Practice" defaultOpen>
        <pre><code>{`// Module pattern — private state via closure
function createCounter(initial = 0) {
  let count = initial;           // private — not accessible outside
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}
const c = createCounter(10);
c.increment(); // 11
console.log(c.count); // undefined — truly private`}</code></pre>
      </Accordion>
      <Accordion title="Classic Closure Gotcha (var in loops)">
        <pre><code>{`// WRONG — all callbacks share the same 'i' via closure
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // logs 3, 3, 3
}

// FIX 1 — use let (block scope per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // logs 0, 1, 2
}

// FIX 2 — IIFE to capture value
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 0))(i);
}`}</code></pre>
      </Accordion>
      <Accordion title="Hoisting Rules">
        <ul>
          <li><code>var</code> — hoisted and initialized to <code>undefined</code></li>
          <li><code>let</code> / <code>const</code> — hoisted but in Temporal Dead Zone (TDZ) — accessing before declaration throws ReferenceError</li>
          <li><strong>Function declarations</strong> — fully hoisted (callable before definition)</li>
          <li><strong>Function expressions / arrow functions</strong> — not hoisted</li>
        </ul>
        <pre><code>{`console.log(foo()); // works — declaration hoisted
function foo() { return 42; }

console.log(bar); // undefined — var hoisted, not initialized
var bar = 10;

console.log(baz); // ReferenceError — TDZ
let baz = 10;`}</code></pre>
      </Accordion>
    </Card>
  ),

  prototypes: (
    <Card>
      <CardHeader title="Prototypes, `this` & Classes" tag="JavaScript Core" tagColor="purple" />
      <div className="highlight orange">
        <p><strong>Remember:</strong> <code>this</code> is determined by <em>how a function is called</em>, not where it's defined — except for arrow functions, which capture <code>this</code> lexically.</p>
      </div>
      <Accordion title="`this` Binding Rules" defaultOpen>
        <pre><code>{`// 1. Method call — this = the object before the dot
const obj = { name: 'INDG', greet() { return this.name; } };
obj.greet(); // 'INDG'

// 2. Regular function — this = undefined (strict) or global
function show() { console.log(this); } // window or undefined

// 3. Arrow function — inherits this from enclosing lexical scope
class Timer {
  constructor() { this.ticks = 0; }
  start() {
    setInterval(() => this.ticks++, 1000); // arrow: this = Timer instance
  }
}

// 4. Explicit binding
const greet = obj.greet;
greet.call({ name: 'Bob' }); // 'Bob'
greet.bind({ name: 'Alice' })(); // 'Alice'`}</code></pre>
      </Accordion>
      <Accordion title="Prototype Chain">
        <pre><code>{`// Every object has a [[Prototype]] link
const animal = { breathe() { return 'breathing'; } };
const dog = Object.create(animal); // dog.__proto__ === animal
dog.bark = () => 'woof';

dog.bark();    // own property
dog.breathe(); // found up prototype chain

// Class syntax is syntactic sugar over prototypes
class Animal { breathe() { return 'breathing'; } }
class Dog extends Animal { bark() { return 'woof'; } }
// Dog.prototype.__proto__ === Animal.prototype`}</code></pre>
      </Accordion>
      <Accordion title="Interview Gotcha: new keyword">
        <pre><code>{`// What 'new' does internally:
function MyClass(val) {
  // 1. Creates empty object with MyClass.prototype as __proto__
  // 2. Sets 'this' to that object
  this.val = val;
  // 3. Returns 'this' implicitly
}
// If constructor returns a non-primitive object, that object is returned instead`}</code></pre>
      </Accordion>
    </Card>
  ),

  es6: (
    <Card>
      <CardHeader title="ES6+ Must-Know Features" tag="Full-Stack JS" tagColor="green" />
      <Accordion title="Destructuring, Spread & Rest" defaultOpen>
        <pre><code>{`// Object destructuring with rename + default
const { name: userName = 'anonymous', role = 'user' } = user;

// Array destructuring
const [first, , third] = [1, 2, 3];

// Rest in function params
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }

// Spread to clone/merge without mutation
const newState = { ...state, count: state.count + 1 };
const combined = [...arr1, ...arr2];`}</code></pre>
      </Accordion>
      <Accordion title="Optional Chaining & Nullish Coalescing">
        <pre><code>{`// Optional chaining (?.) — short-circuits on null/undefined
const city = user?.address?.city;          // no TypeError
const fn = obj?.method?.();               // safe method call
const el = arr?.[0];                       // safe array access

// Nullish coalescing (??) — only falls back on null/undefined
const name = user.name ?? 'Anonymous';    // '' is NOT nullish
const port = process.env.PORT ?? 3000;

// vs logical OR (||) — falls back on ANY falsy
const port2 = process.env.PORT || 3000;  // 0 would use 3000!`}</code></pre>
      </Accordion>
      <Accordion title="Generators & Iterators">
        <pre><code>{`// Generator — function that yields values lazily
function* range(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
for (const n of range(1, 5)) console.log(n); // 1 2 3 4 5

// Useful for: infinite sequences, async coordination (sagas), pagination
function* paginate(fetchPage) {
  let cursor = null;
  do {
    const { items, nextCursor } = yield fetchPage(cursor);
    cursor = nextCursor;
  } while (cursor);
}`}</code></pre>
      </Accordion>
      <Accordion title="WeakMap & WeakRef — Memory-Aware Patterns">
        <pre><code>{`// WeakMap — keys are weakly referenced (GC can collect them)
const cache = new WeakMap();
function process(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = expensiveCalc(obj);
  cache.set(obj, result); // no memory leak — GC can collect obj
  return result;
}

// WeakRef — hold reference without preventing GC
const ref = new WeakRef(largeObject);
const obj = ref.deref(); // may be undefined if GC'd`}</code></pre>
      </Accordion>
    </Card>
  ),

  rendering: (
    <Card>
      <CardHeader title="React Rendering & Fiber Architecture" tag="React Core" tagColor="red" />
      <div className="highlight">
        <p><strong>Core Model:</strong> React builds a virtual DOM (plain JS objects), diffs it against the previous tree (reconciliation via Fiber), then commits only the minimal DOM changes.</p>
      </div>
      <Accordion title="Reconciliation & the Fiber Algorithm" defaultOpen>
        <div className="arch-diagram">{`Trigger (setState / props change)
    ↓
Render Phase (pure, interruptible in React 18)
  → Builds new Fiber tree (work-in-progress)
  → Diffs against current tree
  → Marks effects (placement, update, deletion)
    ↓
Commit Phase (synchronous, mutates real DOM)
  → BeforeMutation → Mutation → Layout
    (useLayoutEffect)    (useEffect async)`}</div>
        <ul>
          <li><strong>Keys:</strong> Help React identify which items changed in lists. Never use array index as key for dynamic lists — React uses keys to match old/new fiber nodes.</li>
          <li><strong>Bailout:</strong> React.memo, useMemo, and PureComponent tell React to skip re-render if props/deps are referentially equal.</li>
        </ul>
      </Accordion>
      <Accordion title="When Does a Component Re-render?">
        <ul>
          <li>Its own state changes (<code>setState</code>)</li>
          <li>A parent re-renders (unless memoized)</li>
          <li>Context value it consumes changes</li>
          <li>A hook it uses returns a new value</li>
        </ul>
        <pre><code>{`// useLayoutEffect vs useEffect
// useLayoutEffect fires synchronously AFTER DOM mutation but
// BEFORE browser paint — use for measuring DOM, avoiding flicker
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  setWidth(rect.width); // no flash of wrong value
}, []);

// useEffect fires asynchronously after paint — use for
// subscriptions, data fetching, timers`}</code></pre>
      </Accordion>
    </Card>
  ),

  hooks: (
    <Card>
      <CardHeader title="React Hooks Deep Dive" tag="React Core" tagColor="red" />
      <Accordion title="useState & useReducer — When to Use Each" defaultOpen>
        <pre><code>{`// useState — simple independent values
const [count, setCount] = useState(0);

// useReducer — complex state with multiple sub-values or
// next state depends on previous state in non-trivial ways
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + 1 };
    case 'reset': return { count: 0, error: null };
    default: throw new Error('Unknown action');
  }
};
const [state, dispatch] = useReducer(reducer, { count: 0, error: null });`}</code></pre>
      </Accordion>
      <Accordion title="useCallback & useMemo — Reference Stability">
        <pre><code>{`// useMemo — memoize EXPENSIVE computed value
const sortedList = useMemo(
  () => [...items].sort((a, b) => a.price - b.price),
  [items]
);

// useCallback — memoize FUNCTION REFERENCE
// Needed when passing callbacks to memoized children
const handleSubmit = useCallback((e) => {
  e.preventDefault();
  submit(formData);
}, [formData, submit]); // only recreated when deps change

// Without useCallback, every render creates a new function ref
// → breaks React.memo on child component`}</code></pre>
      </Accordion>
      <Accordion title="useRef — Beyond DOM Access">
        <pre><code>{`// 1. DOM access
const inputRef = useRef(null);
inputRef.current.focus();

// 2. Mutable value that does NOT trigger re-render
const intervalId = useRef(null);
useEffect(() => {
  intervalId.current = setInterval(tick, 1000);
  return () => clearInterval(intervalId.current);
}, []);

// 3. Store previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current; // returns value from LAST render
}`}</code></pre>
      </Accordion>
      <Accordion title="Custom Hooks — Reusable Stateful Logic">
        <pre><code>{`// Extract and share logic, not JSX
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; }; // cleanup — prevent state update on unmounted component
  }, [url]);

  return { data, loading, error };
}`}</code></pre>
      </Accordion>
    </Card>
  ),

  state: (
    <Card>
      <CardHeader title="State Management Patterns" tag="Architecture" tagColor="green" />
      <div className="highlight">
        <p><strong>Decision Guide:</strong> Context for low-frequency global data (theme, auth). Zustand/Redux for high-frequency or complex shared state. Server state (React Query / SWR) is a different problem — don't put API data in Redux.</p>
      </div>
      <Accordion title="Context API — Right vs Wrong Use" defaultOpen>
        <pre><code>{`// WRONG — Context re-renders ALL consumers on every value change
// Don't put frequently-changing state (cursor position) in context

// PATTERN — split context to minimize re-renders
const UserContext = createContext(null);      // changes rarely
const ThemeContext = createContext('dark');    // changes rarely

// For complex: separate data from dispatch
const StoreContext = createContext(null);
const DispatchContext = createContext(null);  // dispatch is stable

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StoreContext.Provider value={state}>
        {children}
      </StoreContext.Provider>
    </DispatchContext.Provider>
  );
}`}</code></pre>
      </Accordion>
      <Accordion title="Zustand — Lightweight Production State">
        <pre><code>{`import { create } from 'zustand';

const useStore = create((set, get) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
  // Async action — no thunk middleware needed
  fetchUser: async (id) => {
    const user = await api.getUser(id);
    set({ user });
  },
}));

// Subscribe to slice — only re-renders when count changes
function Counter() {
  const count = useStore(state => state.count);
  const increment = useStore(state => state.increment);
  return <button onClick={increment}>{count}</button>;
}`}</code></pre>
      </Accordion>
      <Accordion title="Server State — React Query">
        <pre><code>{`// Server state (fetched data) has different concerns:
// loading, caching, stale-while-revalidate, background refresh

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}

function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}`}</code></pre>
      </Accordion>
    </Card>
  ),

  performance: (
    <Card>
      <CardHeader title="React Performance Optimization" tag="Senior-Level" tagColor="orange" />
      <Accordion title="React.memo — Prevent Unnecessary Re-renders" defaultOpen>
        <pre><code>{`// React.memo — shallow prop comparison bailout
const UserCard = React.memo(function UserCard({ user, onDelete }) {
  // Only re-renders if user or onDelete reference changes
  return <div>{user.name} <button onClick={() => onDelete(user.id)}>X</button></div>;
});

// Problem: onDelete is a new function every render → memo useless
// Fix: useCallback in parent
const handleDelete = useCallback((id) => {
  setUsers(prev => prev.filter(u => u.id !== id));
}, []); // stable reference`}</code></pre>
      </Accordion>
      <Accordion title="Code Splitting & Lazy Loading">
        <pre><code>{`import { lazy, Suspense } from 'react';

// Lazy load heavy components — split into separate chunks
const Dashboard = lazy(() => import('./Dashboard'));
const ReportEditor = lazy(() => import('./ReportEditor'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'reports' && <ReportEditor />}
    </Suspense>
  );
}
// Dashboard.js is only downloaded when the tab is activated`}</code></pre>
      </Accordion>
      <Accordion title="Virtualization for Long Lists">
        <pre><code>{`// Rendering 10,000 DOM nodes is slow
// Virtualization renders only visible rows

import { FixedSizeList as List } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  );
  return (
    <List height={600} itemCount={items.length} itemSize={50} width="100%">
      {Row}
    </List>
  );
}
// Only ~12 DOM nodes rendered at any time regardless of list size`}</code></pre>
      </Accordion>
      <Accordion title="Bundle Optimization Checklist">
        <ul>
          <li>Analyze bundle: <code>source-map-explorer</code> or <code>vite-bundle-visualizer</code></li>
          <li>Tree-shake: use named imports (<code>import {'{ debounce }'} from 'lodash-es'</code>)</li>
          <li>Dynamic imports for route-level code splitting</li>
          <li>Defer non-critical 3rd party scripts</li>
          <li>Use <code>preconnect</code> for critical APIs</li>
          <li>Images: <code>loading="lazy"</code>, proper sizes, WebP format</li>
        </ul>
      </Accordion>
    </Card>
  ),

  patterns: (
    <Card>
      <CardHeader title="React Design Patterns" tag="Senior-Level" tagColor="orange" />
      <Accordion title="Compound Components — Flexible APIs" defaultOpen>
        <pre><code>{`// Flexible: let consumers compose internals
// Used by Radix UI, Headless UI, React Select

const TabContext = createContext(null);

function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabContext.Provider value={{ active, setActive }}>
      {children}
    </TabContext.Provider>
  );
}
Tabs.List = function TabList({ children }) { return <div role="tablist">{children}</div>; };
Tabs.Trigger = function TabTrigger({ value, children }) {
  const { active, setActive } = useContext(TabContext);
  return <button role="tab" aria-selected={active === value} onClick={() => setActive(value)}>{children}</button>;
};
Tabs.Content = function TabContent({ value, children }) {
  const { active } = useContext(TabContext);
  return active === value ? <div>{children}</div> : null;
};

// Usage — caller controls structure
<Tabs defaultValue="a">
  <Tabs.List>
    <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
    <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="a">Content A</Tabs.Content>
  <Tabs.Content value="b">Content B</Tabs.Content>
</Tabs>`}</code></pre>
      </Accordion>
      <Accordion title="Render Props & Higher-Order Components">
        <pre><code>{`// Render props — share stateful logic via JSX children
function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {children(pos)} {/* caller decides what to render */}
    </div>
  );
}

// HOC — wrap component to inject behavior
function withAuth(WrappedComponent) {
  return function AuthGuard(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <WrappedComponent {...props} user={user} />;
  };
}
// Modern preference: custom hooks > HOCs for logic reuse`}</code></pre>
      </Accordion>
      <Accordion title="Controlled vs Uncontrolled Components">
        <pre><code>{`// Controlled — React owns state, single source of truth
<input value={value} onChange={e => setValue(e.target.value)} />

// Uncontrolled — DOM owns state, read with ref
const inputRef = useRef();
<input defaultValue="initial" ref={inputRef} />
// inputRef.current.value on submit

// When to use uncontrolled: file inputs, performance-critical forms,
// integrating with non-React code`}</code></pre>
      </Accordion>
    </Card>
  ),

  react18: (
    <Card>
      <CardHeader title="React 18/19 & Concurrent Features" tag="Current" tagColor="purple" />
      <div className="highlight green">
        <p><strong>Concurrent React:</strong> Rendering is now interruptible. React can pause, resume, or abandon a render. This enables transitions, Suspense for data, and streaming SSR.</p>
      </div>
      <Accordion title="useTransition & useDeferredValue" defaultOpen>
        <pre><code>{`// useTransition — mark state update as non-urgent
// React keeps old UI interactive while preparing new UI
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(q) {
    setQuery(q);                          // urgent — update input immediately
    startTransition(() => {
      setResults(expensiveFilter(data, q)); // non-urgent — can be interrupted
    });
  }
  return (
    <>
      <input value={query} onChange={e => handleSearch(e.target.value)} />
      {isPending ? <Spinner /> : <ResultsList results={results} />}
    </>
  );
}

// useDeferredValue — defer a value, not a setter
function List({ query }) {
  const deferredQuery = useDeferredValue(query); // lags behind query
  const items = useMemo(() => filter(data, deferredQuery), [deferredQuery]);
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}`}</code></pre>
      </Accordion>
      <Accordion title="Suspense for Data Fetching">
        <pre><code>{`// React 18 — Suspense + data libraries (Relay, Next.js, React Query experimental)
// Component "suspends" by throwing a Promise
function UserProfile({ userId }) {
  // In React Query v5 with suspense: true
  const { data: user } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
  });
  return <div>{user.name}</div>; // guaranteed non-null
}

// Parent
<Suspense fallback={<ProfileSkeleton />}>
  <UserProfile userId={id} />
</Suspense>
<ErrorBoundary fallback={<ErrorState />}>
  <Suspense fallback={<Spinner />}>
    <UserProfile userId={id} />
  </Suspense>
</ErrorBoundary>`}</code></pre>
      </Accordion>
      <Accordion title="React 19 — New Hooks & Server Actions">
        <ul>
          <li><strong>use()</strong> — read resources (Promises, Context) inside render; can be called conditionally</li>
          <li><strong>useOptimistic()</strong> — optimistic UI updates with automatic rollback on error</li>
          <li><strong>useActionState()</strong> — manage form submission state (pending, data, error)</li>
          <li><strong>Server Components</strong> — render on server, zero client JS, direct DB access</li>
          <li><strong>Server Actions</strong> — <code>async function</code> with <code>"use server"</code> — called from client, runs on server</li>
        </ul>
        <pre><code>{`// useOptimistic — show success before server confirms
function LikeButton({ post }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    post.likes,
    (current, delta) => current + delta
  );

  async function handleLike() {
    addOptimisticLike(1);         // immediate UI update
    await likePost(post.id);      // actual server call
    // on error: React auto-reverts to post.likes
  }
  return <button onClick={handleLike}>♥ {optimisticLikes}</button>;
}`}</code></pre>
      </Accordion>
    </Card>
  ),

  nodejs: (
    <Card>
      <CardHeader title="Node.js Full-Stack Patterns" tag="Backend JS" tagColor="green" />
      <div className="highlight">
        <p><strong>Company context:</strong> This team uses JS for both frontend and backend. Node.js + Express/Fastify for APIs, potentially Lambda (Node runtime) for serverless. Know these cold.</p>
      </div>
      <Accordion title="Express Middleware Pattern" defaultOpen>
        <pre><code>{`// Middleware = (req, res, next) => void
// Chain builds up like onion layers

app.use(express.json());
app.use(requestLogger);
app.use(authenticate);  // attach user to req.user

// Error handling middleware — 4 params, must be last
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500).json({
    error: { code: err.code ?? 'INTERNAL_ERROR', message: err.message }
  });
});

// Async error handling — wrap or use express-async-errors
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await db.findUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) { next(err); } // pass to error middleware
});`}</code></pre>
      </Accordion>
      <Accordion title="Streams for Large Data">
        <pre><code>{`// DON'T load large files into memory
app.get('/export', async (req, res) => {
  // BAD
  const data = await db.getAllRecords(); // 1M rows → heap overflow
  res.json(data);

  // GOOD — pipe database cursor stream to response
  res.setHeader('Content-Type', 'application/json');
  const dbStream = db.getAllRecordsStream();
  dbStream.pipe(JSONStream.stringify()).pipe(res);
});`}</code></pre>
      </Accordion>
      <Accordion title="Cluster & PM2 for Multi-Core">
        <pre><code>{`// Node.js is single-threaded — one process per CPU core by default
// cluster module forks worker processes to use all cores

import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();
  cluster.on('exit', (worker) => cluster.fork()); // auto-restart
} else {
  startServer(); // each worker runs the same server
}

// In production: PM2 handles this automatically
// pm2 start server.js -i max  → one process per CPU core`}</code></pre>
      </Accordion>
      <Accordion title="Security Essentials (Node/Express)">
        <ul>
          <li><strong>Helmet.js</strong> — sets secure HTTP headers (X-XSS-Protection, CSP, HSTS)</li>
          <li><strong>Rate limiting</strong> — <code>express-rate-limit</code> per IP or user</li>
          <li><strong>Input validation</strong> — Zod or Joi before any DB/business logic</li>
          <li><strong>SQL/NoSQL injection</strong> — always use parameterized queries / ORM</li>
          <li><strong>CORS</strong> — explicit origin whitelist, not <code>*</code> for APIs with cookies</li>
          <li><strong>Dependency scanning</strong> — <code>npm audit</code> in CI, Snyk or Dependabot</li>
        </ul>
      </Accordion>
    </Card>
  ),

  typescript: (
    <Card>
      <CardHeader title="TypeScript for Full-Stack JS" tag="Production Essential" tagColor="blue" />
      <div className="highlight">
        <p><strong>Why it matters:</strong> Type-safe APIs between frontend and backend, better IDE support, catch errors at compile time. Share types across FE and BE in a monorepo.</p>
      </div>
      <Accordion title="Types You Must Know Cold" defaultOpen>
        <pre><code>{`// Union & intersection types
type Status = 'loading' | 'success' | 'error';
type AdminUser = User & { adminLevel: number };

// Generic functions
function first<T>(arr: T[]): T | undefined { return arr[0]; }

// Utility types
type PartialUser = Partial<User>;           // all optional
type RequiredUser = Required<User>;          // all required
type ReadonlyUser = Readonly<User>;          // immutable
type UserDTO = Pick<User, 'id' | 'name'>;  // subset
type PublicUser = Omit<User, 'password'>;   // exclude fields
type UserRecord = Record<string, User>;     // index signature

// Template literal types
type EventName = \`on\${Capitalize<string>}\`; // onSubmit, onChange...`}</code></pre>
      </Accordion>
      <Accordion title="Discriminated Unions — Type-Safe State">
        <pre><code>{`// Model all states explicitly — no undefined behavior
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function render(state: FetchState<User>) {
  if (state.status === 'success') {
    return state.data.name; // TypeScript knows data exists here
  }
  if (state.status === 'error') {
    return state.error.message; // TypeScript knows error exists
  }
  return null;
}`}</code></pre>
      </Accordion>
      <Accordion title="Sharing Types Between FE & BE">
        <pre><code>{`// In a monorepo (Turborepo/Nx):
// packages/shared-types/src/api.ts

export interface CreateUserRequest {
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Backend (Express)
app.post('/users', async (req: Request<{}, {}, CreateUserRequest>, res) => {
  const user = await userService.create(req.body); // typed body
  res.json(user satisfies UserResponse);
});

// Frontend
const user = await api.post<UserResponse>('/users', data);
// Same types — breaking API change caught at compile time`}</code></pre>
      </Accordion>
    </Card>
  ),
};

export default function JSReact({ onTopicDone, doneSections }) {
  const [active, setActive] = useState('eventloop');

  return (
    <SidebarLayout
      sidebar={
        <>
          <SidebarSection title="JavaScript">
            {TOPICS.slice(0, 4).map(t => (
              <SidebarItem key={t.id} label={t.label} active={active === t.id} done={doneSections.has(t.id)} onClick={() => setActive(t.id)} />
            ))}
          </SidebarSection>
          <SidebarSection title="React">
            {TOPICS.slice(4, 10).map(t => (
              <SidebarItem key={t.id} label={t.label} active={active === t.id} done={doneSections.has(t.id)} onClick={() => setActive(t.id)} />
            ))}
          </SidebarSection>
          <SidebarSection title="Full-Stack JS">
            {TOPICS.slice(10).map(t => (
              <SidebarItem key={t.id} label={t.label} active={active === t.id} done={doneSections.has(t.id)} onClick={() => setActive(t.id)} />
            ))}
          </SidebarSection>
          <SidebarSection title="Practice Timer">
            <Timer defaultMinutes={20} />
          </SidebarSection>
        </>
      }
    >
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4 }}>JavaScript & React Deep Dive</div>
      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>Your core proficiency — own this section confidently. JS runtime, React internals, full-stack patterns.</div>
      {CONTENT[active]}
      {!doneSections.has(active) && (
        <button className="btn btn-primary" onClick={() => onTopicDone(active)}>Mark as Reviewed ✓</button>
      )}
      {doneSections.has(active) && (
        <div style={{ color: 'var(--accent2)', fontSize: 13, marginTop: 4 }}>✓ Reviewed</div>
      )}
    </SidebarLayout>
  );
}
