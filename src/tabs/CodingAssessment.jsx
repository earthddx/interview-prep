import { useState } from 'react';
import Accordion from '../components/Accordion';
import { Card, CardHeader } from '../components/Card';
import { SidebarLayout, SidebarSection, SidebarItem } from '../components/SidebarLayout';
import Timer from '../components/Timer';

const TOPICS = [
  { id: 'arrays',     label: 'Arrays & Hashmaps' },
  { id: 'strings',    label: 'Strings' },
  { id: 'trees',      label: 'Trees & Graphs' },
  { id: 'dp',         label: 'Dynamic Programming' },
  { id: 'async',      label: 'Async / Promises' },
  { id: 'oop',        label: 'OOP & Design Patterns' },
  { id: 'complexity', label: 'Complexity Analysis' },
  { id: 'sorting',    label: 'Sorting & Searching' },
  { id: 'api',        label: 'REST API Design' },
  { id: 'testing',    label: 'Testing Strategies' },
];

const CONTENT = {
  arrays: (
    <Card>
      <CardHeader title="Arrays & Hashmaps" tag="High Priority" tagColor="red" />
      <div className="highlight"><p><strong>Core Insight:</strong> Most interview problems reduce to "use a hashmap to trade space for time." When you see O(n²) brute force, think hashmap → O(n).</p></div>
      <Accordion title="Two Sum Pattern (most common)" defaultOpen>
        <p>Store complement in a map as you iterate. Classic O(n) solution:</p>
        <pre><code>{`function twoSum(nums, target) {
  const map = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}
// Time: O(n)  Space: O(n)`}</code></pre>
      </Accordion>
      <Accordion title="Sliding Window Pattern">
        <pre><code>{`// Longest substring without repeating chars
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right]) >= left) {
      left = seen.get(s[right]) + 1;
    }
    seen.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
// Time: O(n)  Space: O(charset)`}</code></pre>
      </Accordion>
      <Accordion title="What to Say When You Get a Problem">
        <ol>
          <li><strong>Repeat the problem</strong> in your own words</li>
          <li><strong>Ask about constraints</strong> — input size? negatives? duplicates?</li>
          <li><strong>Walk through an example</strong></li>
          <li><strong>State brute force</strong> — "naive approach is O(n²)"</li>
          <li><strong>Optimize</strong> — "we can do better with a hashmap → O(n)"</li>
          <li><strong>Code it</strong>, narrating as you go</li>
          <li><strong>Test</strong> with examples including edge cases</li>
          <li><strong>State complexity</strong> at the end</li>
        </ol>
      </Accordion>
    </Card>
  ),
  strings: (
    <Card>
      <CardHeader title="String Manipulation" tag="Medium Priority" />
      <Accordion title="Key Patterns" defaultOpen>
        <ul>
          <li><strong>Palindrome:</strong> two pointers from both ends</li>
          <li><strong>Anagram:</strong> sort both OR frequency count</li>
          <li><strong>Reversal:</strong> split, reverse, join — or two-pointer</li>
        </ul>
        <pre><code>{`// Valid palindrome
function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}

// Anagram check
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`}</code></pre>
      </Accordion>
    </Card>
  ),
  trees: (
    <Card>
      <CardHeader title="Trees & Graphs" tag="High Priority" tagColor="red" />
      <Accordion title="BFS vs DFS — When to Use Each" defaultOpen>
        <div className="grid-2">
          <div>
            <h3>BFS (Queue)</h3>
            <ul><li>Shortest path in unweighted graph</li><li>Level-order traversal</li><li>Finding nearest neighbor</li></ul>
            <pre><code>{`function bfs(root) {
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    // process node
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}`}</code></pre>
          </div>
          <div>
            <h3>DFS (Recursion)</h3>
            <ul><li>Path existence</li><li>Tree height / depth</li><li>Topological sort</li></ul>
            <pre><code>{`function dfs(node, visited = new Set()) {
  if (!node || visited.has(node)) return;
  visited.add(node);
  for (const n of node.neighbors) dfs(n, visited);
}`}</code></pre>
          </div>
        </div>
      </Accordion>
      <Accordion title="Common Tree Problems">
        <ul>
          <li><strong>Max depth</strong> — <code>1 + max(depth(left), depth(right))</code></li>
          <li><strong>Invert tree</strong> — swap left/right at each node</li>
          <li><strong>LCA</strong> — when both targets are in different subtrees</li>
          <li><strong>Is BST valid</strong> — pass min/max bounds recursively</li>
        </ul>
      </Accordion>
    </Card>
  ),
  dp: (
    <Card>
      <CardHeader title="Dynamic Programming" tag="High Priority" tagColor="red" />
      <div className="highlight orange"><p><strong>DP Framework:</strong> (1) Define subproblem. (2) Find recurrence. (3) Identify base cases. (4) Choose memoization or tabulation.</p></div>
      <Accordion title="Core Patterns to Know" defaultOpen>
        <pre><code>{`// 1. Fibonacci (top-down memoization)
function fib(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  return memo[n] = fib(n-1, memo) + fib(n-2, memo);
}

// 2. Coin Change (bottom-up tabulation)
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 3. Longest Common Subsequence
function lcs(s1, s2) {
  const dp = Array(s1.length+1).fill(null)
    .map(() => Array(s2.length+1).fill(0));
  for (let i = 1; i <= s1.length; i++)
    for (let j = 1; j <= s2.length; j++)
      dp[i][j] = s1[i-1] === s2[j-1]
        ? dp[i-1][j-1] + 1
        : Math.max(dp[i-1][j], dp[i][j-1]);
  return dp[s1.length][s2.length];
}`}</code></pre>
      </Accordion>
    </Card>
  ),
  async: (
    <Card>
      <CardHeader title="Async / Promises (JavaScript)" tag="Full-Stack Specific" tagColor="purple" />
      <Accordion title="Promise Patterns You Must Know" defaultOpen>
        <pre><code>{`// Sequential vs Parallel
const a = await fetchA();         // sequential (slow)
const [a, b] = await Promise.all([fetchA(), fetchB()]); // parallel

// Promise.allSettled — don't fail on one error
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === 'fulfilled') use(r.value);
  else handleError(r.reason);
});

// Retry with exponential backoff
async function retry(fn, retries = 3, delay = 1000) {
  try { return await fn(); }
  catch (err) {
    if (retries === 0) throw err;
    await new Promise(r => setTimeout(r, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}`}</code></pre>
      </Accordion>
    </Card>
  ),
  oop: (
    <Card>
      <CardHeader title="OOP & Design Patterns" tag="Architecture Focus" tagColor="green" />
      <Accordion title="SOLID Principles (know these cold)" defaultOpen>
        <ul>
          <li><strong>S — Single Responsibility:</strong> One reason to change</li>
          <li><strong>O — Open/Closed:</strong> Open for extension, closed for modification</li>
          <li><strong>L — Liskov Substitution:</strong> Subtypes usable in place of parent</li>
          <li><strong>I — Interface Segregation:</strong> Don't force unused methods</li>
          <li><strong>D — Dependency Inversion:</strong> Depend on abstractions</li>
        </ul>
      </Accordion>
      <Accordion title="Design Patterns to Mention">
        <div className="grid-2">
          <div><h3>Creational</h3><ul><li><strong>Singleton</strong> — one instance (DB connection)</li><li><strong>Factory</strong> — create without exposing logic</li><li><strong>Builder</strong> — complex object construction</li></ul></div>
          <div><h3>Behavioral</h3><ul><li><strong>Observer</strong> — pub/sub, event emitters</li><li><strong>Strategy</strong> — swap algorithms at runtime</li><li><strong>Repository</strong> — data access abstraction</li></ul></div>
        </div>
      </Accordion>
    </Card>
  ),
  complexity: (
    <Card>
      <CardHeader title="Big O Complexity Reference" tag="Must Memorize" tagColor="orange" />
      <table>
        <thead><tr><th>Operation</th><th>Data Structure</th><th>Time</th><th>Space</th></tr></thead>
        <tbody>
          {[
            ['Access','Array','O(1)','—'],
            ['Search','Array','O(n)','—'],
            ['Insert/Delete (end)','Array','O(1)','—'],
            ['Insert/Delete (middle)','Array','O(n)','—'],
            ['Get/Set','HashMap','O(1) avg','O(n)'],
            ['Search','BST','O(log n)','—'],
            ['Push/Pop','Stack/Queue','O(1)','—'],
            ['Binary Search','Sorted Array','O(log n)','O(1)'],
            ['DFS/BFS','Graph','O(V+E)','O(V)'],
            ['Sort','Array','O(n log n)','O(log n)'],
          ].map(([op,ds,t,s]) => <tr key={op+ds}><td>{op}</td><td>{ds}</td><td>{t}</td><td>{s}</td></tr>)}
        </tbody>
      </table>
    </Card>
  ),
  sorting: (
    <Card>
      <CardHeader title="Sorting & Searching" tag="Medium Priority" />
      <Accordion title="Binary Search (versatile)" defaultOpen>
        <pre><code>{`function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
// Tip: binary search works on any monotonic function,
// not just sorted arrays — think "search space"!`}</code></pre>
      </Accordion>
    </Card>
  ),
  api: (
    <Card>
      <CardHeader title="REST API Design" tag="Full-Stack Essential" tagColor="green" />
      <Accordion title="Best Practices" defaultOpen>
        <ul>
          <li>Use <strong>nouns not verbs</strong> in URLs: <code>/users/&#123;id&#125;</code> not <code>/getUser</code></li>
          <li>Proper <strong>HTTP methods</strong>: GET (read), POST (create), PUT (replace), PATCH (update), DELETE</li>
          <li>Correct <strong>status codes</strong>: 200, 201, 204, 400, 401, 403, 404, 422, 500</li>
          <li>Version your API: <code>/api/v1/</code></li>
          <li>Use <strong>pagination</strong> for lists: cursor-based preferred over offset</li>
          <li>Consistent error format: <code>{"{ error: { code, message, details } }"}</code></li>
          <li>Rate limiting with headers: <code>X-RateLimit-Remaining</code></li>
        </ul>
      </Accordion>
    </Card>
  ),
  testing: (
    <Card>
      <CardHeader title="Testing Strategies" tag="DevSecOps Focus" tagColor="purple" />
      <Accordion title="Testing Pyramid" defaultOpen>
        <div className="arch-diagram">{`     ▲  E2E Tests (Selenium, Cypress)
    ▲▲▲  Integration Tests (API, DB)
  ▲▲▲▲▲  Unit Tests (Jest, Mocha)
Many fast cheap ←————→ Few slow expensive`}</div>
        <ul>
          <li><strong>Unit tests</strong>: Test single functions in isolation. Mock dependencies.</li>
          <li><strong>Integration tests</strong>: Test service-to-service interactions, DB queries</li>
          <li><strong>E2E tests</strong>: Test full user flows in a real browser</li>
          <li><strong>Contract tests</strong>: Pact.js for microservice API contracts</li>
          <li><strong>Security tests</strong>: SAST (SonarQube), DAST (OWASP ZAP), dependency scanning</li>
        </ul>
      </Accordion>
    </Card>
  ),
};

export default function CodingAssessment({ onTopicDone, doneSections }) {
  const [active, setActive] = useState('arrays');

  return (
    <SidebarLayout
      sidebar={
        <>
          <SidebarSection title="Topics">
            {TOPICS.map(t => (
              <SidebarItem key={t.id} label={t.label} active={active === t.id} done={doneSections.has(t.id)} onClick={() => setActive(t.id)} />
            ))}
          </SidebarSection>
          <SidebarSection title="Practice Timer">
            <Timer defaultMinutes={30} />
          </SidebarSection>
        </>
      }
    >
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4 }}>Coding Assessment Prep</div>
      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>Focus: data structures, algorithms, and clean code communication</div>
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
