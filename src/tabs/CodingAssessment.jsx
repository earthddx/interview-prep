import { useState } from 'react';
import Accordion from '../components/Accordion';
import { Card, CardHeader } from '../components/Card';
import { SidebarLayout, SidebarSection, SidebarItem } from '../components/SidebarLayout';
import CodeBlock from '../components/CodeBlock';

const TOPICS = [
  { id: 'arrays',     label: 'Arrays & Hashmaps' },
  { id: 'strings',    label: 'Strings' },
  { id: 'linkedlist', label: 'Linked Lists' },
  { id: 'trees',      label: 'Trees & Graphs' },
  { id: 'trie',       label: 'Trie' },
  { id: 'dp',         label: 'Dynamic Programming' },
  { id: 'async',      label: 'Async / Promises' },
  { id: 'oop',        label: 'OOP & Design Patterns' },
  { id: 'complexity', label: 'Complexity Analysis' },
  { id: 'stackqueue', label: 'Stack & Queue' },
  { id: 'heap',       label: 'Heap / Priority Queue' },
  { id: 'lru',        label: 'LRU Cache' },
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
      <Accordion title="What is a Linked List?" defaultOpen>
        <p>A <strong>linked list</strong> is a linear data structure where each element (node) stores a value and a pointer to the next node. Unlike arrays, nodes are not stored contiguously in memory — each node lives wherever the allocator puts it, connected only by pointers.</p>
        <p><strong>Singly linked:</strong> each node has <code>next</code>. <strong>Doubly linked:</strong> each node has <code>next</code> and <code>prev</code> (enables O(1) removal without traversal).</p>
        <CodeBlock>{`// Singly: HEAD → [1|next] → [2|next] → [3|null]
// Doubly: HEAD ↔ [1] ↔ [2] ↔ [3] ↔ TAIL`}</CodeBlock>
        <p><strong>Why use it over an array?</strong> Inserting or deleting at the head/tail is O(1) — no shifting. Trade-off: no random access (must traverse from head), and extra memory per node for the pointer(s).</p>
      </Accordion>
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
      <Accordion title="What are Trees & Graphs?" defaultOpen>
        <p>A <strong>graph</strong> is a collection of <strong>nodes (vertices)</strong> connected by <strong>edges</strong>. It's the most general data structure for representing relationships — networks, maps, dependencies, social connections.</p>
        <p>A <strong>tree</strong> is a restricted graph: connected, acyclic (no cycles), with one root node. Every tree is a graph, but not every graph is a tree.</p>
        <CodeBlock>{`// Graph types:
// Directed   — edges have direction (A → B, but not B → A)
// Undirected — edges go both ways (A ↔ B)
// Weighted   — edges have a cost/distance
// Cyclic     — contains a cycle (can revisit a node)
// DAG        — Directed Acyclic Graph (no cycles, used for dependencies)

// Tree vocabulary:
// Root    — top node, no parent
// Leaf    — bottom node, no children
// Height  — longest path from root to a leaf
// BST     — Binary Search Tree: left < node < right at every node`}</CodeBlock>
        <p><strong>Key difference from trees:</strong> graphs can have cycles, multiple paths between nodes, and disconnected components — so traversals always need a <code>visited</code> set.</p>
      </Accordion>
      <Accordion title="BFS vs DFS — When to Use Each">
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
      <Accordion title="Tree Traversal Orders (Pre / In / Post)">
        <p>All three use the same <code>walk</code> skeleton — the only difference is <strong>where you push the value</strong> relative to the recursive calls.</p>
        <CodeBlock>{`// PRE-ORDER: node → left → right
// Use for: copying a tree, serialization, prefix expressions
function pre_order_search(head) {
  function walk(curr, path) {
    if (!curr) return path;
    path.push(curr.value);   // visit BEFORE recursing
    walk(curr.left, path);
    walk(curr.right, path);
    return path;
  }
  return walk(head, []);
}

// IN-ORDER: left → node → right
// Use for: BST → returns values in sorted (ascending) order
function in_order_search(head) {
  function walk(curr, path) {
    if (!curr) return path;
    walk(curr.left, path);
    path.push(curr.value);   // visit BETWEEN left and right
    walk(curr.right, path);
    return path;
  }
  return walk(head, []);
}

// POST-ORDER: left → right → node
// Use for: deleting a tree, evaluating expression trees (children before parent)
function post_order_search(head) {
  function walk(curr, path) {
    if (!curr) return path;
    walk(curr.left, path);
    walk(curr.right, path);
    path.push(curr.value);   // visit AFTER both children
    return path;
  }
  return walk(head, []);
}

// Given tree:    4
//               / \\
//              2   6
//             / \\ / \\
//            1  3 5  7
//
// Pre-order:  [4, 2, 1, 3, 6, 5, 7]  ← root always first
// In-order:   [1, 2, 3, 4, 5, 6, 7]  ← sorted! (BST only)
// Post-order: [1, 3, 2, 5, 7, 6, 4]  ← root always last
//
// Time: O(n)  Space: O(h) call stack — h = tree height`}</CodeBlock>
        <p><strong>Memory trick:</strong> the prefix describes when the <em>current node</em> is visited — <strong>pre</strong> = before children, <strong>in</strong> = between children, <strong>post</strong> = after children.</p>
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
      <Accordion title="Graph Representation — Adjacency List">
        <p>Most interview graphs are given as an edge list or adjacency list. Build the list first, then traverse.</p>
        <CodeBlock>{`// Build adjacency list from edge list
// edges = [[0,1],[0,2],[1,3]]  →  undirected graph
function buildGraph(n, edges) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    graph[a].push(b);
    graph[b].push(a); // omit this line for directed graph
  }
  return graph;
}

// Adjacency matrix — O(1) edge lookup, O(V²) space
// Only use when V is small (< 1000) or graph is dense
const matrix = Array.from({ length: n }, () => Array(n).fill(0));
matrix[a][b] = 1;
matrix[b][a] = 1;`}</CodeBlock>
        <p><strong>Rule of thumb:</strong> adjacency list = sparse graph (most interview problems). Matrix = dense graph or when you need fast "is there an edge from A to B?" lookups.</p>
      </Accordion>
      <Accordion title="DFS on a Graph (with cycle detection)">
        <p>Unlike trees, graphs can have cycles — always track a <code>visited</code> set.</p>
        <CodeBlock>{`// DFS — iterative with a stack (avoids call-stack overflow on large graphs)
function dfs(graph, start) {
  const visited = new Set();
  const stack = [start];

  while (stack.length) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);

    // process node here
    console.log(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) stack.push(neighbor);
    }
  }
}

// DFS — recursive (cleaner, but O(V) call stack depth)
function dfsRecursive(graph, node, visited = new Set()) {
  if (visited.has(node)) return;
  visited.add(node);
  // process node
  for (const neighbor of graph[node]) {
    dfsRecursive(graph, neighbor, visited);
  }
}
// Time: O(V + E)  Space: O(V)`}</CodeBlock>
      </Accordion>
      <Accordion title="BFS on a Graph (shortest path)">
        <p>BFS on an unweighted graph gives the shortest path in terms of number of edges.</p>
        <CodeBlock>{`// Returns shortest distance from start to every reachable node
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const dist = { [start]: 0 };

  while (queue.length) {
    const node = queue.shift();

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        dist[neighbor] = dist[node] + 1;
        queue.push(neighbor);
      }
    }
  }
  return dist;
}

// Has path from src to dst?
function hasPath(graph, src, dst) {
  const visited = new Set();
  const queue = [src];
  while (queue.length) {
    const node = queue.shift();
    if (node === dst) return true;
    if (visited.has(node)) continue;
    visited.add(node);
    for (const n of graph[node]) queue.push(n);
  }
  return false;
}
// Time: O(V + E)  Space: O(V)`}</CodeBlock>
      </Accordion>
      <Accordion title="Classic Graph Problems">
        <p><strong>Number of Islands</strong> — flood-fill DFS on a grid (2D graph):</p>
        <CodeBlock>{`function numIslands(grid) {
  let count = 0;
  const rows = grid.length, cols = grid[0].length;

  function sink(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0'; // mark visited by sinking
    sink(r+1,c); sink(r-1,c); sink(r,c+1); sink(r,c-1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { count++; sink(r, c); }
    }
  }
  return count;
}
// Time: O(m×n)  Space: O(m×n) call stack worst case`}</CodeBlock>
        <p><strong>Connected Components</strong> — count groups in an undirected graph:</p>
        <CodeBlock>{`function countComponents(n, edges) {
  const graph = buildGraph(n, edges); // see adjacency list above
  const visited = new Set();
  let components = 0;

  function dfs(node) {
    if (visited.has(node)) return;
    visited.add(node);
    for (const neighbor of graph[node]) dfs(neighbor);
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) { dfs(i); components++; }
  }
  return components;
}`}</CodeBlock>
        <ul style={{ marginTop: 12 }}>
          <li><strong>Topological sort</strong> — DFS post-order on a DAG (course schedule)</li>
          <li><strong>Cycle detection</strong> — track a "in-progress" set alongside visited; if you hit an in-progress node, there's a cycle</li>
          <li><strong>Dijkstra</strong> — shortest path on a <em>weighted</em> graph; use a min-heap</li>
        </ul>
      </Accordion>
      <Accordion title="Maze Solver — Recursive DFS with Backtracking">
        <p>A 2D grid is just a graph where each cell has up to 4 neighbors. The key addition here is <strong>backtracking</strong> — <code>path.pop()</code> in the post step undoes a dead-end so only the successful path remains.</p>
        <CodeBlock>{`const dir = [
  [-1, 0], // up
  [ 1, 0], // down
  [ 0,-1], // left
  [ 0, 1], // right
];

function walk(maze, wall, curr, end, seen, path) {
  // Base cases — return false to trigger backtrack
  if (curr.x < 0 || curr.x >= maze[0].length ||
      curr.y < 0 || curr.y >= maze.length) {
    return false; // off the map
  }
  if (maze[curr.y][curr.x] === wall) return false; // hit a wall
  if (seen[curr.y][curr.x])          return false; // already visited

  // Found the exit
  if (curr.x === end.x && curr.y === end.y) {
    path.push(end);
    return true;
  }

  // Pre: mark visited and add to candidate path
  seen[curr.y][curr.x] = true;
  path.push(curr);

  // Recurse in all 4 directions
  for (const [x, y] of dir) {
    if (walk(maze, wall, { x: curr.x + x, y: curr.y + y }, end, seen, path)) {
      return true; // found — propagate success up the call stack
    }
  }

  // Post: dead end — remove this cell from the path (backtrack)
  path.pop();
  return false;
}

function mazeSolve(maze, wall, start, end) {
  const seen = maze.map(row => new Array(row.length).fill(false));
  const path = [];
  walk(maze, wall, start, end, seen, path);
  return path; // empty array if no solution
}

// Usage
const maze = [
  "########",
  "#S     #",
  "# #### #",
  "#    # #",
  "#### # #",
  "#      E",  // E = end position
  "########",
];
mazeSolve(maze, "#", { x:1, y:1 }, { x:7, y:5 });
// Time: O(V+E) = O(rows × cols)  Space: O(rows × cols) for seen + call stack`}</CodeBlock>
        <p><strong>Why <code>path.pop()</code> works:</strong> DFS explores one direction fully before trying the next. If it bottoms out without reaching the end, the post step removes the dead-end cells — so by the time the recursion unwinds to the correct branch, <code>path</code> only contains cells on the winning route.</p>
        <p><strong>vs Number of Islands:</strong> Islands uses flood-fill (mark and never undo) — it just <em>counts</em> regions. Maze solver needs the actual path, so it <em>backtracks</em> on failure.</p>
      </Accordion>
    </Card>
  ),
  trie: (
    <Card>
      <CardHeader title="Trie (Prefix Tree)" tag="Medium Priority" tagColor="yellow" />
      <Accordion title="What is a Trie?" defaultOpen>
        <p>A <strong>Trie</strong> (pronounced "try", from re<em>trie</em>val) is a tree where each node represents a <strong>single character</strong>. A path from root to a marked node spells out a word. It's optimised for prefix-based operations — things an array or hashmap can't do efficiently.</p>
        <CodeBlock>{`// Visualising the words: "cat", "car", "card", "care", "dog"
//
//          root
//         /    \\
//        c      d
//        |      |
//        a      o
//        |      |
//        t*     g*
//        |
//        r
//       / \\
//      d*  e*
//
// * = isEndOfWord = true
// Each node stores: children (map of char → node), isEndOfWord flag`}</CodeBlock>
        <p><strong>When to reach for a Trie:</strong></p>
        <ul>
          <li>Autocomplete / search suggestions</li>
          <li>Spell checker</li>
          <li>"Does any word start with this prefix?" queries</li>
          <li>Word games (Boggle, Wordle solvers)</li>
        </ul>
      </Accordion>
      <Accordion title="Implementation">
        <CodeBlock>{`class TrieNode {
  constructor() {
    this.children = {};   // char → TrieNode
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Insert a word — O(m) where m = word length
  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  // Search for an exact word — O(m)
  search(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return node.isEndOfWord;  // path exists AND it's a complete word
  }

  // Does any inserted word start with this prefix? — O(m)
  startsWith(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return true;  // path exists — at least one word has this prefix
  }
}

// Usage
const trie = new Trie();
trie.insert("cat");
trie.insert("car");
trie.insert("card");

trie.search("car");       // true
trie.search("ca");        // false — path exists but not a word end
trie.startsWith("ca");    // true
trie.startsWith("dog");   // false`}</CodeBlock>
      </Accordion>
      <Accordion title="search() vs startsWith() — The Key Distinction">
        <CodeBlock>{`// After inserting "car" and "card":
//
//  root → c → a → r* → d*
//                 ↑        ↑
//           isEndOfWord  isEndOfWord
//
// search("car")     → true  (node.isEndOfWord = true)
// search("ca")      → false (node.isEndOfWord = false — path exists but no word ends here)
// search("cart")    → false (no 't' child under 'r')
// startsWith("car") → true  (path exists — don't care about isEndOfWord)
// startsWith("ca")  → true  (path exists)
// startsWith("cat") → false (no 't' child under 'a' in this example)`}</CodeBlock>
        <p><strong>Rule:</strong> <code>search</code> needs the path to exist AND end with <code>isEndOfWord = true</code>. <code>startsWith</code> only needs the path to exist.</p>
      </Accordion>
      <Accordion title="Get All Words with a Prefix (Autocomplete)">
        <CodeBlock>{`// Return all words that start with the given prefix
getWordsWithPrefix(prefix) {
  let node = this.root;
  // Walk to the end of the prefix
  for (const char of prefix) {
    if (!node.children[char]) return [];
    node = node.children[char];
  }
  // DFS from that node to collect all complete words
  const results = [];
  this._dfs(node, prefix, results);
  return results;
}

_dfs(node, current, results) {
  if (node.isEndOfWord) results.push(current);
  for (const [char, child] of Object.entries(node.children)) {
    this._dfs(child, current + char, results);
  }
}

// Usage
trie.insert("cat"); trie.insert("car"); trie.insert("card"); trie.insert("care");
trie.getWordsWithPrefix("car"); // ["car", "card", "care"]`}</CodeBlock>
      </Accordion>
      <Accordion title="Problem: Autocomplete System">
        <p><strong>Prompt:</strong> <em>"Given a list of words and a search prefix, return all words from the list that start with that prefix, sorted alphabetically."</em></p>
        <CodeBlock>{`// Example:
// words  = ["cat", "car", "card", "care", "dog", "door"]
// prefix = "car"
// output = ["car", "card", "care"]

class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class AutoComplete {
  constructor(words) {
    this.root = new TrieNode();
    // Build the trie upfront — O(n × m) total
    for (const word of words) this.insert(word);
  }

  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  // 1. Walk to the end of the prefix — O(p)
  // 2. DFS from that node to collect all words — O(w)
  // Total: O(p + w)  where p = prefix length, w = chars in matching words
  search(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) return []; // prefix not in trie
      node = node.children[char];
    }
    // DFS to collect all words under this node
    const results = [];
    this._dfs(node, prefix, results);
    return results.sort(); // sort alphabetically
  }

  _dfs(node, current, results) {
    if (node.isEndOfWord) results.push(current);
    // Visit children in insertion order — sort() at end handles ordering
    for (const [char, child] of Object.entries(node.children)) {
      this._dfs(child, current + char, results);
    }
  }
}

// Usage
const ac = new AutoComplete(["cat", "car", "card", "care", "dog", "door"]);
ac.search("car");   // ["car", "card", "care"]
ac.search("do");    // ["dog", "door"]
ac.search("ca");    // ["car", "card", "care", "cat"]
ac.search("xyz");   // []

// Time:  O(n×m) to build, O(p + w) per search query
// Space: O(n×m) for the trie`}</CodeBlock>
        <div className="highlight orange">
          <p><strong>Follow-up questions to expect:</strong></p>
          <ul>
            <li><strong>"What if the word list is huge?"</strong> — Build the trie once at startup, not per query. Cache popular prefix results in a hashmap.</li>
            <li><strong>"What if you want the top 3 most searched results?"</strong> — Store a frequency count on each <code>isEndOfWord</code> node, return results sorted by count descending.</li>
            <li><strong>"What if input can have uppercase?"</strong> — Normalise to lowercase on insert and search: <code>word.toLowerCase()</code>.</li>
          </ul>
        </div>
      </Accordion>
      <Accordion title="Complexity">
        <CodeBlock>{`Operation         Time      Space
──────────────────────────────────────────
insert(word)      O(m)      O(m) new nodes worst case
search(word)      O(m)      O(1)
startsWith(pre)   O(m)      O(1)
getWordsWithPre   O(m + k)  O(k) result list

m = length of word/prefix
k = number of words returned

Space for the whole trie: O(n × m) — n words of avg length m
Each node stores up to 26 children (for lowercase English)`}</CodeBlock>
        <p><strong>vs HashMap:</strong> A HashMap can tell you if a word exists in O(1), but can't answer "does anything start with 'ca'?" without scanning all keys. A Trie answers prefix queries in O(m) — the length of the prefix, regardless of how many words are stored.</p>
      </Accordion>
    </Card>
  ),
  dp: (
    <Card>
      <CardHeader title="Dynamic Programming" tag="High Priority" tagColor="red" />
      <Accordion title="What is Dynamic Programming?" defaultOpen>
        <p><strong>Dynamic Programming</strong> is an optimization technique for problems that have <strong>overlapping subproblems</strong> and <strong>optimal substructure</strong> — meaning the problem can be broken into smaller subproblems whose solutions combine to give the overall answer, and those subproblems repeat.</p>
        <p>The key idea: <strong>cache results so you never compute the same subproblem twice.</strong></p>
        <CodeBlock>{`// Without DP — fib(5) recomputes fib(3) twice, fib(2) three times...
// Time: O(2^n) — exponential

// With DP (memoization) — each subproblem computed once, result stored
// Time: O(n)  Space: O(n)

// Two approaches:
// Top-down (memoization) — recursive + cache. Natural to write, starts from the big problem.
// Bottom-up (tabulation)  — iterative + array. Fills smallest subproblems first, no call stack.`}</CodeBlock>
        <p><strong>How to spot a DP problem:</strong> the problem asks for a count, min, max, or boolean over all possibilities, and brute force would explore exponential combinations (e.g. "how many ways...", "minimum cost to...", "can you reach...").</p>
      </Accordion>
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
  heap: (
    <Card>
      <CardHeader title="Heap / Priority Queue" tag="High Priority" tagColor="red" />
      <Accordion title="What is a Min Heap?" defaultOpen>
        <p>A <strong>heap</strong> is a complete binary tree that satisfies the <strong>heap property</strong>: in a min-heap, every parent node is <em>smaller than or equal to</em> its children. This guarantees the minimum element is always at the root.</p>
        <p>It is <em>not</em> a sorted structure — siblings have no defined order relative to each other. The only guarantee is parent ≤ children at every level.</p>
        <p><strong>Why use it?</strong> When you repeatedly need to access the smallest (or largest) element efficiently — like a priority queue, scheduling system, or Dijkstra's algorithm. Inserting and removing are both O(log n), and reading the min is O(1).</p>
        <CodeBlock>{`// Min-heap property:
//        1          ← always the minimum
//       / \\
//      3   2        ← smaller than their children
//     / \\ / \\
//    7  6 5  4     ← order between siblings doesn't matter`}</CodeBlock>
      </Accordion>
      <div className="highlight"><p><strong>Core Insight:</strong> A heap is a <strong>complete binary tree stored in an array</strong>. No node pointers needed — parent/child positions are derived from the index. A min-heap guarantees the <em>smallest</em> element is always at index 0.</p></div>
      <Accordion title="Array Index Formulas" defaultOpen>
        <CodeBlock>{`// For a node at index i:
parent(i)      = Math.floor((i - 1) / 2)
leftChild(i)   = i * 2 + 1
rightChild(i)  = i * 2 + 2

// Example — array: [1, 3, 2, 7, 6, 5, 4]
//                        1          ← index 0
//                      /   \\
//                     3     2       ← index 1, 2
//                    / \\   / \\
//                   7   6 5   4    ← index 3, 4, 5, 6`}</CodeBlock>
      </Accordion>
      <Accordion title="MinHeap Implementation">
        <CodeBlock>{`class MinHeap {
  public length: number;
  private data: number[];

  constructor() {
    this.data = [];
    this.length = 0;
  }

  // O(log n) — insert at end, bubble up
  insert(value: number): void {
    this.data[this.length] = value;
    this.heapifyUp(this.length);
    this.length++;
  }

  // O(log n) — remove root (min), replace with last element, sink down
  // also called poll() or pop()
  delete(): number | undefined {
    if (this.length === 0) return undefined;

    const out = this.data[0];
    this.length--;

    if (this.length === 0) {
      this.data = [];
      return out;
    }

    this.data[0] = this.data[this.length]; // move last → root
    this.heapifyDown(0);
    return out;
  }

  // Sink down: swap with the SMALLER child until heap property restored
  private heapifyDown(idx: number): void {
    const lIdx = idx * 2 + 1;
    const rIdx = idx * 2 + 2;

    if (lIdx >= this.length) return; // no children — done

    const lV = this.data[lIdx];
    const rV = this.data[rIdx];
    const v  = this.data[idx];

    if (lV > rV && v > rV) {
      // right child is smallest — swap right
      this.data[idx]  = rV;
      this.data[rIdx] = v;
      this.heapifyDown(rIdx);
    } else if (rV > lV && v > lV) {
      // left child is smallest — swap left
      this.data[idx]  = lV;
      this.data[lIdx] = v;
      this.heapifyDown(lIdx);
    }
    // if v is already smallest, stop
  }

  // Bubble up: swap with parent until parent is smaller (or we're at root)
  private heapifyUp(idx: number): void {
    if (idx === 0) return;

    const p       = Math.floor((idx - 1) / 2);
    const parentV = this.data[p];
    const v       = this.data[idx];

    if (parentV > v) {
      this.data[idx] = parentV;
      this.data[p]   = v;
      this.heapifyUp(p);
    }
  }
}

// Usage
const heap = new MinHeap();
heap.insert(5); heap.insert(3); heap.insert(8); heap.insert(1);
heap.delete(); // → 1  (always the minimum)
heap.delete(); // → 3`}</CodeBlock>
      </Accordion>
      <Accordion title="heapifyUp vs heapifyDown">
        <CodeBlock>{`insert → heapifyUp
  New element placed at the END (bottom of tree)
  Bubbles UP by swapping with parent while parent > child
  Stops when parent ≤ child, or reaches root

delete → heapifyDown
  Root (minimum) is removed and returned
  Last element moved to ROOT to fill the gap
  Sinks DOWN by swapping with the SMALLER child while child < parent
  Stops when both children are larger, or no children remain`}</CodeBlock>
        <p><strong>Why smaller child?</strong> If you swap with the larger child, that larger value becomes the new parent — violating the heap property for the other subtree. Always swap with the child that will maintain the min-heap invariant.</p>
      </Accordion>
      <Accordion title="When to reach for a Heap">
        <ul>
          <li><strong>Top-K elements</strong> — keep a max-heap of size K; O(n log k)</li>
          <li><strong>K closest points</strong> — same pattern, compare by distance</li>
          <li><strong>Merge K sorted lists</strong> — min-heap of (value, listIndex)</li>
          <li><strong>Dijkstra</strong> — min-heap on (distance, node)</li>
          <li><strong>Median of data stream</strong> — two heaps: max-heap (left half) + min-heap (right half)</li>
        </ul>
        <CodeBlock>{`// Complexity summary
insert   O(log n)
delete   O(log n)  ← always removes the min (or max for max-heap)
peek     O(1)      ← just read index 0
build    O(n)      ← heapify all elements at once (not n × insert)`}</CodeBlock>
      </Accordion>
    </Card>
  ),
  lru: (
    <Card>
      <CardHeader title="LRU Cache" tag="High Priority" tagColor="red" />
      <Accordion title="What is an LRU Cache?" defaultOpen>
        <p>An <strong>LRU (Least Recently Used) Cache</strong> is a fixed-capacity data structure that evicts the least recently accessed item when it becomes full. It answers the question: <em>"Of the items I'm holding, which one hasn't been used in the longest time — and should be dropped first?"</em></p>
        <p><strong>Real-world uses:</strong> browser page cache, CPU memory cache, database query cache, CDN edge caches.</p>
        <p><strong>The contract:</strong></p>
        <ul>
          <li><code>get(key)</code> — return the value if it exists, and mark it as most recently used</li>
          <li><code>update(key, value)</code> — insert or update a value; if over capacity, evict the least recently used item first</li>
        </ul>
        <p><strong>Why this data structure?</strong> You need O(1) lookup (HashMap) <em>and</em> O(1) reordering when something is accessed (Doubly Linked List). Neither structure alone can do both — combining them gives you all operations in O(1).</p>
      </Accordion>
      <div className="highlight"><p><strong>Core Insight:</strong> Combine a <strong>HashMap</strong> (O(1) lookup) with a <strong>Doubly Linked List</strong> (O(1) insert/remove). Most-recently-used items live at the <code>head</code>; the eviction candidate is always at the <code>tail</code>. Two maps let you go node→key and key→node in O(1).</p></div>
      <Accordion title="Data Structure Design" defaultOpen>
        <CodeBlock>{`// Why doubly linked list?
// Singly linked: to remove a node you need its predecessor → O(n)
// Doubly linked: node.prev gives the predecessor directly → O(1)

// Why two Maps?
// lookup:        key   → node   (for get / update)
// reverseLookup: node  → key    (for eviction — trimCache needs the key to clean up both maps)

//  HEAD ←→ [most recent] ←→ ... ←→ [least recent] ←→ TAIL
//  ↑                                                    ↑
//  next access moves here                        evicted from here`}</CodeBlock>
      </Accordion>
      <Accordion title="Full Implementation (TypeScript)">
        <CodeBlock>{`type Node<T> = {
  value: T,
  next?: Node<T>,
  prev?: Node<T>,
}

function createNode<V>(value: V): Node<V> {
  return { value };
}

export default class LRU<K, V> {
  private length: number;
  private head?: Node<V>;
  private tail?: Node<V>;
  private lookup: Map<K, Node<V>>;
  private reverseLookup: Map<Node<V>, K>;

  constructor(private capacity: number = 10) {
    this.length = 0;
    this.head = this.tail = undefined;
    this.lookup = new Map<K, Node<V>>();
    this.reverseLookup = new Map<Node<V>, K>();
  }

  update(key: K, value: V): void {
    let node = this.lookup.get(key);
    if (!node) {
      // Key doesn't exist — create, prepend, then evict if over capacity
      node = createNode(value);
      this.length++;
      this.prepend(node);
      this.trimCache();
      this.lookup.set(key, node);
      this.reverseLookup.set(node, key);
    } else {
      // Key exists — move to front (most recent) and update value
      this.detach(node);
      this.prepend(node);
      node.value = value;
    }
  }

  get(key: K): V | undefined {
    const node = this.lookup.get(key);
    if (!node) return undefined;
    // Accessing counts as "recently used" — move to front
    this.detach(node);
    this.prepend(node);
    return node.value;
  }

  // Remove a node from its current position in the list
  private detach(node: Node<V>): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;

    if (this.head === node) this.head = this.head.next;
    if (this.tail === node) this.tail = this.tail.prev;
    if (this.length === 1)  this.tail = this.head = undefined;

    node.next = undefined;
    node.prev = undefined;
  }

  // Insert a node at the front (most recently used position)
  private prepend(node: Node<V>): void {
    if (!this.head) {
      this.head = this.tail = node;
      return;
    }
    node.next = this.head;
    this.head.prev = node;
    this.head = node;
  }

  // Evict the least recently used item (tail) if over capacity
  private trimCache(): void {
    if (this.length <= this.capacity) return;
    const tail = this.tail as Node<V>;
    this.detach(tail);
    const key = this.reverseLookup.get(tail) as K;
    this.lookup.delete(key);
    this.reverseLookup.delete(tail);
    this.length--;
  }
}`}</CodeBlock>
      </Accordion>
      <Accordion title="Operation Walkthrough">
        <CodeBlock>{`// capacity = 3
// update(A,1) → HEAD [A] TAIL
// update(B,2) → HEAD [B] ↔ [A] TAIL
// update(C,3) → HEAD [C] ↔ [B] ↔ [A] TAIL
// get(A)      → HEAD [A] ↔ [C] ↔ [B] TAIL   ← A moved to front
// update(D,4) → HEAD [D] ↔ [A] ↔ [C] TAIL   ← B evicted (was tail)`}</CodeBlock>
        <p><strong>detach then prepend</strong> is the core move — used in both <code>get</code> and <code>update</code>. It's what makes any access "most recent".</p>
      </Accordion>
      <Accordion title="Complexity">
        <CodeBlock>{`Operation   Time    Why
─────────────────────────────────────────────
get         O(1)    HashMap lookup + O(1) list ops
update      O(1)    Same — detach + prepend + map set
eviction    O(1)    Tail is always the LRU candidate
Space       O(n)    n = capacity (both maps + list)`}</CodeBlock>
        <p><strong>Interview tip:</strong> If asked "why not just use an array?", arrays are O(n) to remove from the middle. The doubly linked list makes detach O(1) because each node knows its own neighbors.</p>
      </Accordion>
    </Card>
  ),
  stackqueue: (
    <Card>
      <CardHeader title="Stack & Queue" tag="Medium Priority" tagColor="yellow" />
      <Accordion title="What are Stacks & Queues?" defaultOpen>
        <p>Both are <strong>linear, ordered collections</strong> that restrict where you can insert and remove — the difference is which end.</p>
        <p>A <strong>Stack</strong> is <strong>LIFO</strong> — Last In, First Out. Think of a stack of plates: you add and remove from the top only. The last item pushed is the first item popped.</p>
        <p>A <strong>Queue</strong> is <strong>FIFO</strong> — First In, First Out. Think of a queue at a register: new items join at the back, items leave from the front. The first item enqueued is the first item dequeued.</p>
        <CodeBlock>{`// Stack — last in, first out
push(1) push(2) push(3)
pop() → 3   pop() → 2   pop() → 1

// Queue — first in, first out
enqueue(1) enqueue(2) enqueue(3)
dequeue() → 1   dequeue() → 2   dequeue() → 3`}</CodeBlock>
        <p><strong>When to use each:</strong> Stack → DFS, undo/redo, call stack simulation, balanced brackets. Queue → BFS, task scheduling, anything that must be processed in arrival order.</p>
      </Accordion>
      <div className="highlight"><p><strong>Core Insight:</strong> Both are implemented as a singly-linked list — a Stack uses <strong>LIFO</strong> (insert/remove at the head) and a Queue uses <strong>FIFO</strong> (insert at tail, remove from head). No array shifting = O(1) for every operation.</p></div>
      <Accordion title="Stack — LIFO (TypeScript)" defaultOpen>
        <p>Push and pop both operate on <code>head</code>. Each node points <strong>back</strong> via <code>prev</code>.</p>
        <CodeBlock>{`type Node<T> = {
  value: T,
  prev?: Node<T>,
}

export default class Stack<T> {
  public length: number;
  private head?: Node<T>;

  constructor() {
    this.head = undefined;
    this.length = 0;
  }

  push(item: T): void {
    const node = { value: item } as Node<T>;
    this.length++;
    if (!this.head) {
      this.head = node;
      return;
    }
    node.prev = this.head; // new node points back to old head
    this.head = node;      // new node becomes head
  }

  pop(): T | undefined {
    this.length = Math.max(0, this.length - 1);
    if (this.length === 0) {
      const head = this.head;
      this.head = undefined;
      return head?.value;
    }
    const head = this.head as Node<T>;
    this.head = head.prev; // walk back one node
    return head.value;
  }

  peek(): T | undefined {
    return this.head?.value;
  }
}
// push / pop / peek — all O(1)  Space: O(n)`}</CodeBlock>
        <p><strong>Use for:</strong> undo/redo, call stack simulation, balanced parentheses, DFS iterative, monotonic stack problems.</p>
      </Accordion>
      <Accordion title="Queue — FIFO (TypeScript)">
        <p>Enqueue at <code>tail</code>, dequeue from <code>head</code>. Nodes point <strong>forward</strong> via <code>next</code>.</p>
        <CodeBlock>{`type Node<T> = {
  value: T,
  next?: Node<T>,
}

export default class Queue<T> {
  public length: number;
  private head: Node<T> | undefined;
  private tail?: Node<T>;

  constructor() {
    this.head = this.tail = undefined;
    this.length = 0;
  }

  enqueue(item: T): void {
    const node = { value: item } as Node<T>;
    this.length++;
    if (!this.tail) {
      this.tail = this.head = node; // first item — head and tail are the same
      return;
    }
    this.tail.next = node; // link old tail forward to new node
    this.tail = node;      // advance tail
  }

  dequeue(): T | undefined {
    if (!this.head) return undefined;

    this.length--;
    const head = this.head;
    this.head = this.head.next; // advance head
    head.next = undefined;      // free the reference (GC friendly)

    if (this.length === 0) {
      this.tail = undefined; // both head and tail are gone
    }
    return head.value;
  }

  peek(): T | undefined {
    return this.head?.value;
  }
}
// enqueue / dequeue / peek — all O(1)  Space: O(n)`}</CodeBlock>
        <p><strong>Use for:</strong> BFS, task scheduling, sliding window problems, rate limiting.</p>
      </Accordion>
      <Accordion title="Stack vs Queue — Key Differences">
        <CodeBlock>{`Operation     Stack (LIFO)         Queue (FIFO)
──────────────────────────────────────────────
Insert        push → head          enqueue → tail
Remove        pop  ← head          dequeue ← head
Peek          head                 head
Pointer dir   node.prev            node.next
Mental model  stack of plates      line at a register

Stack traversal order:  last in, first out  → DFS
Queue traversal order:  first in, first out → BFS`}</CodeBlock>
      </Accordion>
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
      <Accordion title="Pagination — Offset vs Cursor">
        <p><strong>Offset</strong> tells the DB: "skip the first N rows, return the next 20." Simple, but fragile when data changes between page loads.</p>
        <CodeBlock>{`GET /posts?limit=20&offset=0   → rows 1–20
GET /posts?limit=20&offset=20  → rows 21–40

// DB query: SELECT * FROM posts ORDER BY id DESC LIMIT 20 OFFSET 20

// THE BUG — data shifts while you paginate:
// User loads page 1  → [Post A, Post B ... Post T]
// Someone posts Post X → pushes everything down by 1
// User loads page 2  → offset=20 → [Post T, Post U ...]
//                                      ↑ Post T was already on page 1!
// Result: duplicate items (or skipped items on delete)`}</CodeBlock>

        <p><strong>Cursor</strong> tells the DB: "give me 20 rows that come <em>after</em> this specific item." The cursor is usually a base64-encoded ID or timestamp of the last item received — it anchors to a stable row regardless of inserts.</p>
        <CodeBlock>{`GET /posts?limit=20                       → first 20, server returns cursor
GET /posts?limit=20&cursor=eyJpZCI6MTAwfQ==  → next 20 after post id=100

// DB query: SELECT * FROM posts WHERE id < :cursorId ORDER BY id DESC LIMIT 20
//           ↑ index seek — fast at any scale, no full table scan

// Response shape
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6ODB9",  // base64({ id: 80 })
    "hasMore": true
  }
}`}</CodeBlock>

        <p>New posts arriving never shift the cursor's position — page 2 always starts exactly after the last item you saw on page 1.</p>

        <table>
          <thead><tr><th></th><th>Offset</th><th>Cursor</th></tr></thead>
          <tbody>
            <tr><td>Data shifts during scroll</td><td>Duplicates / skips</td><td>Stable</td></tr>
            <tr><td>Jump to page 47</td><td>✅</td><td>❌ (walk forward only)</td></tr>
            <tr><td>DB performance (large table)</td><td>Slow — scans N rows</td><td>Fast — indexed seek</td></tr>
            <tr><td>Implementation complexity</td><td>Simple</td><td>Slightly more work</td></tr>
            <tr><td>Use for</td><td>Admin tables, search</td><td>Feeds, timelines, chats</td></tr>
          </tbody>
        </table>

        <div className="highlight orange" style={{ marginTop: 12 }}>
          <p><strong>Interview tip:</strong> Always lead with cursor for any feed or timeline. Mention offset's page-jump advantage so the interviewer knows you understand the tradeoff — then explain why feeds don't need page jumping so cursor wins there.</p>
        </div>
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
