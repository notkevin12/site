---
title: Union Find
---

# Union find overview

For further reading, see DPV 5.1.4 (page 138 for the copy I have)

### Find operation

Finds the root node of some target node

```
def find(target):
  # Assume we use a self-loop to determine when
  # we've reached the root note
  while target.parent != target:
    target = target.parent
  return target
```

### Union operation

Joins two nodes together, incrementing rank by 1 when the nodes are of the same rank. In this implementation, when two nodes of the same rank are joined, the parent defaults to the first node specified.

```
def union(node1, node2):
  root1 = find(node1)
  root2 = find(node2)
  if root1 == root2:
    # No need to perform union operation
    return
  if root1.rank < root2.rank:
    root1.parent = root2
  else
    root2.parent = root1
    if root1.rank == root2.rank:
      root1.rank += 1
```

### Analysis of time complexity

- Property 2.1: For a root node of rank $k$, its tree must contain at least $2^k$ nodes. We show this by induction:
  - Base case: a root node of rank $k=1$ must have at least $2^k=2$ nodes
    ```
       root                               root
       /        (minimal case)            /  \        (only other case)
    child                              child child
    ```
  - Inductive step: assume that, for a root node of rank $i$, its tree must contain at least $2^i$ nodes. To create a root node of rank $i+1$, we must have at least two such tree nodes of rank $i$, each with $2^i$ nodes at minimum. This yields a lower bound of $2^i+2^i=2(2^i)=2^{i+1}$ nodes for the new tree of rank $i+1$. The proof is done.
- Property 2.2: Any two trees must consist of disjoint sets of nodes, since any node can only have one parent.
- Property 3: Given $n$ nodes, there can be at most $n/2^k$ trees of rank $k$. Why? From Property 2.1, a root node with rank $k$ must have at least $2^k$ nodes in its tree. Assuming that all the trees of rank $k$ have the minimal number of nodes, and knowing that the trees cannot share nodes (from Property 2.2), that means there can only be $n/2^k$ such trees produced from $n$ nodes.
  - Why is this nice? This means that, for $n$ nodes, $k$ can be at most $\log n$. Thus, for any find operation, the most amount of nodes that can be traversed is also $\log n$. Therefore, the complexity for calling find and union is $O(\log n)$ and, since we call union for every edge, the total complexity of union-find is $O(m\log n)$ for $m$ edges.
