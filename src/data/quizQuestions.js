export const quizQuestions = [
  {
    q: "In Next.js App Router, you have a page that shows a personalised dashboard. Which rendering strategy is most appropriate?",
    options: ["SSG — build at deploy time", "ISR — revalidate every 60s", "SSR — render per request on the server", "CSR — fetch everything client-side after hydration"],
    correct: 2,
    explanation: "Personalised pages need server-side rendering (SSR) so the server can read the auth session and return user-specific data. SSG/ISR produce the same HTML for everyone. CSR would expose a flash of unauthenticated content.",
  },
  {
    q: "A React component is re-rendering too often. You wrap it with React.memo but the re-renders continue. Most likely cause?",
    options: [
      "React.memo doesn't work with function components",
      "A prop is an object or function created inline in the parent — new reference every render",
      "The component uses useState — React.memo can't help",
      "React.memo requires a custom comparison function to work",
    ],
    correct: 1,
    explanation: "React.memo uses shallow comparison. Inline objects {} and functions () => {} get a new reference on every parent render — so React.memo sees them as changed. Fix: wrap the object in useMemo and the function in useCallback in the parent.",
  },
  {
    q: "Which deployment strategy gives you the FASTEST rollback capability?",
    options: ["Rolling update", "Canary deployment", "Blue/Green deployment", "Feature flags"],
    correct: 2,
    explanation: "Blue/Green: two environments exist simultaneously. Rollback = flip traffic back instantly (seconds). Canary requires gradually reducing new traffic.",
  },
  {
    q: "In Next.js App Router, where should you put the 'use client' directive to minimise client-side JavaScript?",
    options: [
      "At the top of every component file",
      "Only in the root layout",
      "As high up the tree as possible",
      "As far down the tree as possible — only on the leaf components that need interactivity",
    ],
    correct: 3,
    explanation: "Pushing 'use client' to leaf components keeps parent components as Server Components — their code never ships to the browser. A page can be 90% Server Components with only a small interactive island marked 'use client', dramatically reducing bundle size.",
  },
  {
    q: "You're fetching data in a React component and the user clicks quickly — two requests fire. The slower one resolves last and overwrites the correct result. What pattern fixes this?",
    options: [
      "Debounce the fetch function",
      "Use useLayoutEffect instead of useEffect",
      "Use an AbortController to cancel the previous request, or an ignore flag to discard stale results",
      "Increase the fetch timeout",
    ],
    correct: 2,
    explanation: "This is a race condition. The fix: use an AbortController (fetch supports it natively) to cancel the in-flight request when a new one starts, or set an ignore flag in the useEffect cleanup so stale responses are discarded. React Query handles this automatically.",
  },
  {
    q: "You see this output: 1, 2, 3, 3, 3. Which code produced it?",
    options: [
      "for (let i=0;i<3;i++) setTimeout(()=>console.log(i),0)",
      "for (var i=0;i<3;i++) setTimeout(()=>console.log(i),0)",
      "for (const i=0;i<3;i++) setTimeout(()=>console.log(i),0)",
      "for (let i=0;i<3;i++) console.log(i)",
    ],
    correct: 1,
    explanation: "var is function-scoped and shared across all loop iterations. By the time the timeouts fire, i=3 for all callbacks. let creates a new binding per iteration — each closure captures its own i.",
  },
  {
    q: "What is the correct order of output? console.log('A'); setTimeout(()=>console.log('B'),0); Promise.resolve().then(()=>console.log('C')); console.log('D');",
    options: ["A, B, C, D", "A, D, B, C", "A, D, C, B", "A, C, D, B"],
    correct: 2,
    explanation: "Sync runs first (A, D). Then microtasks (Promise.then → C). Then macrotasks (setTimeout → B). Microtasks always drain before macrotasks.",
  },
  {
    q: "In React, what is the correct way to update state based on the previous value?",
    options: [
      "setCount(count + 1)",
      "setCount(prev => prev + 1)",
      "count++; setCount(count)",
      "setCount(count++)",
    ],
    correct: 1,
    explanation: "The functional updater form setCount(prev => prev + 1) is always correct. setCount(count + 1) can lose updates if multiple state updates batch — it captures stale closure value. React guarantees prev is the latest state in the functional form.",
  },
  {
    q: "Which hook should you use to run code AFTER the DOM has been painted (not before)?",
    options: ["useLayoutEffect", "useEffect", "useRef", "useMemo"],
    correct: 1,
    explanation: "useEffect fires asynchronously after the browser has painted — great for subscriptions, data fetching, timers. useLayoutEffect fires synchronously AFTER DOM mutation but BEFORE paint — use only for DOM measurements to avoid flicker.",
  },
  {
    q: "What does React.memo prevent?",
    options: [
      "All re-renders unconditionally",
      "Re-renders caused by context changes",
      "Re-renders caused by parent re-renders when props haven't changed",
      "Re-renders caused by the component's own state changes",
    ],
    correct: 2,
    explanation: "React.memo only prevents re-renders triggered by a parent re-render, using shallow prop comparison. It does NOT prevent re-renders from the component's own useState/useReducer or from context changes.",
  },
  {
    q: "A TypeScript utility type that creates a new type with all properties of T set to optional is:",
    options: ["Readonly<T>", "Required<T>", "Partial<T>", "Pick<T, K>"],
    correct: 2,
    explanation: "Partial<T> makes all properties optional (adds ?). Required<T> makes all required. Readonly<T> prevents mutation. Pick<T,K> creates a subset of T with only keys K.",
  },
  {
    q: "What is the useTransition hook used for in React 18?",
    options: [
      "CSS transition animations between components",
      "Marking a state update as non-urgent so React can keep the UI interactive",
      "Transitioning between pages in React Router",
      "Deferring useEffect execution",
    ],
    correct: 1,
    explanation: "useTransition marks state updates as non-urgent. React renders the old UI while preparing the new render in the background — keeping inputs and buttons responsive. The isPending flag lets you show a loading indicator during the transition.",
  },
];
