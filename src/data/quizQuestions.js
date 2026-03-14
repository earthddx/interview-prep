export const quizQuestions = [
  {
    q: "'Microfrontend' is a common required proficiency in full-stack JDs. Which tool is most commonly used to implement microfrontends in modern React apps?",
    options: ["React Context API", "Webpack Module Federation", "CSS Modules", "Server-Side Rendering"],
    correct: 1,
    explanation: "Webpack 5's Module Federation is the standard approach for microfrontends, allowing independently deployed apps to share components at runtime.",
  },
  {
    q: "An event-driven system's SQS consumer crashes mid-processing. What should you have configured to handle the failed message?",
    options: ["Retry the Lambda immediately", "Use a Dead Letter Queue (DLQ)", "Increase Lambda timeout", "Switch to synchronous processing"],
    correct: 1,
    explanation: "A DLQ captures messages that fail after max retries. Without it, failed messages are silently dropped. Configure alerts on DLQ depth to detect processing failures.",
  },
  {
    q: "Which deployment strategy gives you the FASTEST rollback capability?",
    options: ["Rolling update", "Canary deployment", "Blue/Green deployment", "Feature flags"],
    correct: 2,
    explanation: "Blue/Green: two environments exist simultaneously. Rollback = flip traffic back instantly (seconds). Canary requires gradually reducing new traffic.",
  },
  {
    q: "You need to run a SAST scan in CI/CD. Which tool is most appropriate?",
    options: ["Postman", "SonarQube", "Jest", "Terraform"],
    correct: 1,
    explanation: "SonarQube (or alternatives like Checkmarx, Semgrep) performs Static Application Security Testing — analyzing source code for vulnerabilities without executing it.",
  },
  {
    q: "Your microservice needs to maintain data consistency across a distributed transaction spanning 3 services. What pattern should you use?",
    options: ["Two-Phase Commit (2PC)", "Saga Pattern", "Event Sourcing", "CQRS"],
    correct: 1,
    explanation: "The Saga pattern chains local transactions across services with compensating transactions on failure. 2PC creates distributed locking (poor availability). Saga is the cloud-native approach.",
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
