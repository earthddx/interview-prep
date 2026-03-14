export const quizQuestions = [
  {
    q: "INDG's JD mentions 'Microfrontend' as a required proficiency. Which tool is most commonly used to implement microfrontends in modern React apps?",
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
];
