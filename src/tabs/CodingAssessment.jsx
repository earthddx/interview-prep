import { useState } from 'react';
import Accordion from '../components/Accordion';
import { Card, CardHeader } from '../components/Card';
import { SidebarLayout, SidebarSection, SidebarItem } from '../components/SidebarLayout';
import Timer from '../components/Timer';
import CodeBlock from '../components/CodeBlock';

const TOPICS = [
  { id: 'arrays',     label: 'Arrays & Hashmaps' },
  { id: 'strings',    label: 'Strings' },
  { id: 'linkedlist', label: 'Linked Lists' },
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
        <CodeBlock>{`function twoSum(nums, target) {
  const map = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    } 
    map.set(nums[i], i);
  }
  return [];
}
// Time: O(n)  Space: O(n)`}</CodeBlock>
      </Accordion>
      <Accordion title="Sliding Window Pattern">
        <CodeBlock>{`// Longest substring without repeating chars
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
// Time: O(n)  Space: O(charset)`}</CodeBlock>
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
        <CodeBlock>{`// Valid palindrome
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
}`}</CodeBlock>
      </Accordion>
    </Card>
  ),
  linkedlist: (
    <Card>
      <CardHeader title="Linked Lists" tag="Medium Priority" tagColor="yellow" />
      <div className="highlight"><p><strong>Core Insight:</strong> Almost every linked list problem is solved with <strong>two pointers</strong> (fast/slow or left/right). Draw the pointer manipulation before coding — one wrong <code>.next</code> causes an infinite loop or null crash.</p></div>
      <Accordion title="Node structure & implementation" defaultOpen>
        <CodeBlock>{`class ListNode {
  constructor(val, next = null) {
    this.val  = val;
    this.next = next;
  }
}

// Build: 1 → 2 → 3 → null
const head = new ListNode(1, new ListNode(2, new ListNode(3)));`}</CodeBlock>
        <p>In interviews you're given the head node — you never construct from scratch.</p>
      </Accordion>
      <Accordion title="Fast & slow pointers (Floyd's cycle)">
        <p>Use when you need to find the <strong>middle</strong>, detect a <strong>cycle</strong>, or find the <strong>kth from end</strong>.</p>
        <CodeBlock>{`// Detect cycle — O(n) time, O(1) space
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// Find middle node
function findMiddle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow; // slow is at the middle
}`}</CodeBlock>
      </Accordion>
      <Accordion title="Reverse a linked list">
        <p>The most commonly asked linked list operation. Master both iterative and recursive.</p>
        <CodeBlock>{`// Iterative — O(n) time, O(1) space
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next; // save next
    curr.next = prev;       // reverse pointer
    prev = curr;            // advance prev
    curr = next;            // advance curr
  }
  return prev; // new head
}

// Recursive
function reverseListRec(head) {
  if (!head || !head.next) return head;
  const newHead = reverseListRec(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}`}</CodeBlock>
      </Accordion>
      <Accordion title="Merge two sorted lists">
        <CodeBlock>{`function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
    else                  { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 ?? l2; // attach remainder
  return dummy.next;
}
// Time: O(n + m)  Space: O(1)`}</CodeBlock>
        <p><strong>Dummy head trick:</strong> create a throwaway node at the start so you never handle the empty-list edge case separately.</p>
      </Accordion>
      <Accordion title="Remove Nth node from end">
        <p>Two pointers with an <strong>N-step gap</strong>. One pass, O(1) space.</p>
        <CodeBlock>{`function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy, slow = dummy;
  // advance fast n+1 steps so gap = n
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next; // skip the target node
  return dummy.next;
}`}</CodeBlock>
      </Accordion>
      <Accordion title="Complexity & trade-offs vs arrays">
        <CodeBlock>{`Operation        Linked List    Array
─────────────────────────────────────
Access by index  O(n)           O(1)
Insert at head   O(1)           O(n)
Insert at tail   O(n)*          O(1) amortized
Insert at middle O(n) traverse  O(n) shift
Delete at head   O(1)           O(n)
Search           O(n)           O(n)

* O(1) if you keep a tail pointer`}</CodeBlock>
        <p>Prefer linked lists when you need frequent <strong>insertions/deletions at the head</strong> and don't need random access.</p>
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
            <CodeBlock>{`function bfs(root) {
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    // process node
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}`}</CodeBlock>
          </div>
          <div>
            <h3>DFS (Recursion)</h3>
            <ul><li>Path existence</li><li>Tree height / depth</li><li>Topological sort</li></ul>
            <CodeBlock>{`function dfs(node, visited = new Set()) {
  if (!node || visited.has(node)) return;
  visited.add(node);
  for (const n of node.neighbors) dfs(n, visited);
}`}</CodeBlock>
          </div>
        </div>
      </Accordion>
      <Accordion title="BST Search — DFS (Recursive)" defaultOpen>
        <p>A Binary Search Tree is already sorted — at each node, go right if needle is larger, left if smaller. No need to visit both children.</p>
        <CodeBlock>{`// Uses DFS — exploits BST ordering property to prune half the tree each step
function binary_search(head, needle) {
  return search(head, needle);
}

function search(curr, needle) {
  if (!curr) return false;              // base case: fell off tree, not found

  if (curr.value === needle) return true; // found

  if (curr.value < needle) {
    return search(curr.right, needle);  // needle is larger — go right
  } else {
    return search(curr.left, needle);   // needle is smaller — go left
  }
}
// Time: O(h) — h = tree height; O(log n) balanced, O(n) worst (skewed)
// Space: O(h) — call stack depth`}</CodeBlock>
        <p><strong>Key distinction:</strong> This only works on a <strong>BST</strong> (ordered). The BFS search below works on <em>any</em> binary tree but is O(n) — it can't prune branches because there's no ordering guarantee.</p>
      </Accordion>
      <Accordion title="BFS Search">
        <p>Walk level by level using a queue. Returns <code>true</code> as soon as the target value is found.</p>
        <CodeBlock>{`function bfs_search(head, needle) {
  const q = [head];

  while (q.length) {
    const curr = q.shift();

    // search
    if (curr.value === needle) {
      return true;
    }

    if (curr.left)  q.push(curr.left);
    if (curr.right) q.push(curr.right);
  }

  return false;
}
// Time: O(n) — visits every node in worst case
// Space: O(w) — w = max width of tree (worst case O(n) for full tree)`}</CodeBlock>
        <p><strong>Key detail:</strong> <code>q.shift()</code> dequeues from the front (FIFO) — this is what makes it BFS. Swap to a stack (<code>q.pop()</code>) and it becomes DFS.</p>
      </Accordion>
      <Accordion title="Invert a Binary Tree">
        <p>Two approaches — recursive is cleaner; iterative (BFS) avoids call stack overflow on very deep trees.</p>
        <CodeBlock>{`class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null

  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0
    this.left = left ?? null
    this.right = right ?? null
  }
}

// RECURSIVE (DFS post-order)
// Invert children first, then swap at current node
function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null

  const left = invertTree(root.left)
  const right = invertTree(root.right)

  root.left = right
  root.right = left

  return root
}
// Time: O(n)  Space: O(h) — h = tree height (call stack)

// ITERATIVE (BFS)
// Swap left/right at each node as we traverse level by level
function invertTreeIterative(root: TreeNode | null): TreeNode | null {
  if (!root) return null

  const queue: TreeNode[] = [root]

  while (queue.length) {
    const node = queue.shift()!

    // swap
    const temp = node.left
    node.left = node.right
    node.right = temp

    if (node.left)  queue.push(node.left)
    if (node.right) queue.push(node.right)
  }

  return root
}
// Time: O(n)  Space: O(w) — w = max width of tree`}</CodeBlock>
        <p><strong>Interview tip:</strong> Both are O(n) time. The recursive approach uses O(h) stack space — O(log n) for balanced, O(n) worst case (skewed tree). The iterative BFS approach uses O(w) queue space — safer for very deep trees where recursion could stack overflow.</p>
      </Accordion>
      <Accordion title="Compare Binary Trees">
        <p>Three base cases handle all structural and value mismatches before recursing.</p>
        <CodeBlock>{`function compare_binary_trees(a, b) {
  // base case 1 — both null: same structure, nothing left to check
  if (a === null && b === null) {
    return true;
  }

  // base case 2 — one null, one not: structures differ
  if (a === null || b === null) {
    return false;
  }

  // base case 3 — same structure but values differ
  if (a.value !== b.value) {
    return false;
  }

  return compare_binary_trees(a.left, b.left)
      && compare_binary_trees(a.right, b.right);
}
// Time: O(n)  Space: O(h) — h = tree height (call stack)`}</CodeBlock>
        <p><strong>Interview tip:</strong> The order of base cases matters — check structural equality (both null) before value equality, otherwise you'd dereference null. Short-circuit <code>&&</code> means the right subtree is only checked if the left already matched.</p>
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
        <CodeBlock>{`// 1. Fibonacci (top-down memoization)
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
}`}</CodeBlock>
      </Accordion>
    </Card>
  ),
  async: (
    <Card>
      <CardHeader title="Async / Promises (JavaScript)" tag="Full-Stack Specific" tagColor="purple" />
      <Accordion title="Promise Patterns You Must Know" defaultOpen>
        <CodeBlock>{`// Sequential vs Parallel
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
}`}</CodeBlock>
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
        <CodeBlock>{`const binarySearch = (array, item) =>{
	let start = 0;
	let end = array.length;
	
	while( start < end) {
		
		const mid = Math.floor(start + (end - start)/2);
		const v = array[mid];
		
		if(v === item) {
			return true;
		} else if(v > item) {
			end = mid;
		} else {
			start = mid + 1;
		}	
	}
	return false
};
// Tip: binary search works on any monotonic function,
// not just sorted arrays — think "search space"!`}</CodeBlock>
      </Accordion>
      <Accordion title="Quicksort — In-Place (TypeScript)">
        <p><strong>Time:</strong> O(n log n) avg, O(n²) worst (sorted input) &nbsp;|&nbsp; <strong>Space:</strong> O(log n) call stack</p>
        <p>Partition picks a pivot (last element), moves all smaller elements left of it, then recurses on both halves.</p>
        <CodeBlock>{`function qs(arr: number[], lo: number, hi: number): void {
  if (lo >= hi) {
    return;
  }

  const pivotIdx = partition(arr, lo, hi);
  qs(arr, lo, pivotIdx - 1);
  qs(arr, pivotIdx + 1, hi);
}

function partition(arr: number[], lo: number, hi: number): number {
  const pivot = arr[hi];

  let idx = lo - 1;

  for (let i = lo; i < hi; ++i) {
    if (arr[i] <= pivot) {
      idx++;
      const tmp = arr[i];
      arr[i] = arr[idx];
      arr[idx] = tmp;
    }
  }

  idx++;
  arr[hi] = arr[idx];
  arr[idx] = pivot;

  return idx;
}

function quickSort(arr: number[]): void {
  qs(arr, 0, arr.length - 1);
}

// Usage
const nums = [3, 6, 8, 10, 1, 2, 1];
quickSort(nums);
// nums is now [1, 1, 2, 3, 6, 8, 10]`}</CodeBlock>
      </Accordion>
      <Accordion title="Quicksort — New Array (functional JS)">
        <p><strong>Time:</strong> O(n log n) avg &nbsp;|&nbsp; <strong>Space:</strong> O(n) — creates new arrays at each level</p>
        <p>Simpler to read and explain; good when you want to avoid mutation.</p>
        <CodeBlock>{`const quickSort = (arr) => {
  if (arr.length <= 1) return arr;
  const p = arr[arr.length - 1]; // pivot = last element
  const leftArr = [];
  const rightArr = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] <= p) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }
  }
  return [...quickSort(leftArr), p, ...quickSort(rightArr)];
};

// Usage
quickSort([3, 6, 8, 10, 1, 2, 1]);
// [1, 1, 2, 3, 6, 8, 10]`}</CodeBlock>
        <div className="highlight orange" style={{ marginTop: 12 }}>
          <p><strong>Interview tip:</strong> Mention the tradeoff — in-place is O(log n) space (better for large datasets); functional version is cleaner to explain but O(n) space due to array spreading. Native <code>Array.sort()</code> in V8 uses TimSort (merge + insertion) — O(n log n) guaranteed.</p>
        </div>
      </Accordion>
    </Card>
  ),
  api: (
    <Card>
      <CardHeader title="REST API Design" tag="Full-Stack Essential" tagColor="green" />
      <Accordion title="Nouns not verbs in URLs" defaultOpen>
        <p>Design URLs around <strong>resources</strong>, not actions. The HTTP method expresses the action.</p>
        <CodeBlock>{`// ✅ Good — resource-oriented
GET    /users          → list users
GET    /users/42       → get user 42
POST   /users          → create user
PATCH  /users/42       → partial update
DELETE /users/42       → delete user

// ❌ Bad — RPC-style
GET /getUser?id=42
POST /createUser
POST /deleteUser/42`}</CodeBlock>
        <p>Nest resources to express ownership: <code>/users/42/orders/7</code> — but keep nesting shallow (max 2 levels).</p>
      </Accordion>
      <Accordion title="HTTP methods & idempotency">
        <p>Choosing the right method signals intent and enables caching/retries.</p>
        <CodeBlock>{`GET    — safe, idempotent. Never mutate state.
POST   — not idempotent. Creates a new resource each call.
PUT    — idempotent. Replaces the entire resource.
PATCH  — not guaranteed idempotent. Partial update.
DELETE — idempotent. Deleting twice → same result (resource gone).`}</CodeBlock>
        <p><strong>Idempotent</strong> means calling it N times has the same effect as calling it once — safe to retry on network failure.</p>
      </Accordion>
      <Accordion title="Status codes">
        <CodeBlock>{`2xx — Success
  200 OK           → GET / PATCH / DELETE succeeded
  201 Created      → POST succeeded, include Location header
  204 No Content   → DELETE / action with no body to return

4xx — Client error (don't retry without fixing the request)
  400 Bad Request  → malformed JSON / missing required field
  401 Unauthorized → missing or invalid auth token
  403 Forbidden    → authenticated but lacks permission
  404 Not Found    → resource doesn't exist
  409 Conflict     → duplicate resource / optimistic lock failure
  422 Unprocessable→ valid JSON but failed business validation
  429 Too Many Req → rate limit hit

5xx — Server error (safe to retry with backoff)
  500 Internal     → unexpected server crash
  502 Bad Gateway  → upstream service failed
  503 Unavailable  → server overloaded / in maintenance`}</CodeBlock>
      </Accordion>
      <Accordion title="API versioning">
        <p>Version from day one — breaking changes are inevitable.</p>
        <CodeBlock>{`// URL versioning (most common, easiest to debug)
GET /api/v1/users
GET /api/v2/users

// Header versioning (cleaner URLs, harder to test in browser)
GET /api/users
Accept: application/vnd.myapp.v2+json

// Query param (avoid — caching unfriendly)
GET /api/users?version=2`}</CodeBlock>
        <p>Bump the version on any <strong>breaking change</strong>: removing a field, renaming a field, changing a type, altering behaviour. Additive changes (new optional fields) don't need a bump.</p>
      </Accordion>
      <Accordion title="Pagination">
        <p><strong>Cursor-based</strong> (preferred for production):</p>
        <CodeBlock>{`GET /posts?limit=20&cursor=eyJpZCI6MTAwfQ==

// Response
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6MTIwfQ==",
    "hasMore": true
  }
}`}</CodeBlock>
        <p><strong>Offset-based</strong> (simpler but fragile):</p>
        <CodeBlock>{`GET /posts?limit=20&offset=40
// Problem: if a row is inserted on page 1 while reading page 2,
// you skip or duplicate a record.`}</CodeBlock>
        <p>Use cursor-based when data changes frequently. Use offset for admin UIs where "jump to page N" matters.</p>
      </Accordion>
      <Accordion title="Consistent error format">
        <p>Every error response should have the same shape so clients can handle them generically.</p>
        <CodeBlock>{`// Response body for any 4xx / 5xx
{
  "error": {
    "code": "VALIDATION_FAILED",      // machine-readable
    "message": "Email is required",   // human-readable
    "details": [                      // optional field-level errors
      { "field": "email", "issue": "required" }
    ],
    "requestId": "req_abc123"         // for support/tracing
  }
}`}</CodeBlock>
        <p>Never expose raw stack traces or DB errors to clients in production.</p>
      </Accordion>
      <Accordion title="Rate limiting">
        <p>Always communicate limits through response headers:</p>
        <CodeBlock>{`X-RateLimit-Limit:     100   // max requests per window
X-RateLimit-Remaining: 42    // requests left this window
X-RateLimit-Reset:     1700000000  // Unix timestamp window resets
Retry-After:           30    // seconds to wait (on 429)`}</CodeBlock>
        <p><strong>Strategies:</strong></p>
        <ul>
          <li><strong>Fixed window</strong> — simple, but bursts at window boundary</li>
          <li><strong>Sliding window</strong> — smoother, higher memory cost</li>
          <li><strong>Token bucket</strong> — allows controlled bursts, used by most cloud gateways</li>
        </ul>
        <p>Key by: IP for anonymous, user ID for authenticated, API key for third-party.</p>
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
