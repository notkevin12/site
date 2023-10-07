---
title: Depth-First Search
---

# Depth-first search

Depth-first search is a graph traversal procedure which is useful for finding which vertices are reachable from a vertex in a graph. It is similar to the strategy for exploring a maze: use chalk to mark paths you have already explored, and leave a trail of string behind you so that you can backtrack whenever you reach a dead end. Each junction in the maze is like a vertex in the graph, and each outgoing edge is a possible path to take.

Let's take a look at the following pseudocode to get an idea of how this works:

```
def dfs(G):
    for v in G.vertices:
        visited[v] = false
    for v in G.vertices:
        if visited[v] == false:
            explore(v)

def explore(v):
    visited[v] = true
    for neighbor in edges[v]:
        if visited[neighbor] == false:
            explore(v)
```

In `explore`, the role of the chalk is fulfilled with a boolean array, where every vertex has a `visited` state that is initially false. The call stack plays the role of the string: once every neighbor of the current vertex has been visited, the call returns to an earlier vertex to try other paths.

Consider the following graph.

```dot
graph graphname {
    { rank=same; A; B; C; D; M; }
    { rank=same; E; F; G; H; N; }
    { rank=same; I; J; K; L; }
    A -- B;
    A -- E;
    B -- C;
    C -- D;
    C -- H;
    D -- H;
    E -- I;
    E -- J;
    F -- G;
    F -- J [ style=invis ];
    F -- K;
    G -- K;
    H -- K;
    H -- L;
    I -- J;
    K -- L;
    M -- N;
}
```

Assuming that vertices are processed in lexicographic order, the sequence in which the graph is traversed is represented with the following tree. Solid lines mark edges which are travelled across during DFS (called _tree edges_, because of their inclusion in the tree), while dashed lines mark edges which lead to vertices that have already been visited (called _back edges_).

```dot
graph graphname {
    A -- B;
    A -- E;
    B -- C;
    C -- D;
    C -- H [ style=dashed ];
    D -- H;
    E -- I;
    E -- J [ constraint=false, style=dashed ];
    F -- G;
    H -- K;
    H -- L [ style=dashed ];
    I -- J;
    K -- F;
    K -- G [ style=dashed ];
    K -- L;
    M -- N;

    node [ style=invis ];
    edge [ style=invis ];
    C -- J
    I -- D
    D -- J
    J -- H
    L -- d1
    F -- d1
    d1 -- d2
    G -- d2

    { rank=same; A; M; }
    { rank=same; B; E; N; }
    { rank=same; C; I; }
    { rank=same; D; J; }
    { rank=same; K; L; }
    { rank=same; F; d1; }
    { rank=same; G; d2; }
}
```

Our depth-first search algorithm takes $O(|V|+|E|)$ time, which linear in the size of the graph.

### Undirected connected components

For undirected graphs, our `dfs` method is already well-equipped to identify _connected components_, or maximal subgraphs in which every vertex has a path to every other vertex. Consider the following graph:

```dot
graph graphname {
    { rank=same; A; B; C; D; }
    { rank=same; E; F; G; H; }
    { rank=same; I; J; K; L; }
    A -- B;
    A -- E;
    B -- F [ style=invis ];
    C -- D;
    C -- G;
    C -- H;
    D -- H;
    E -- I;
    E -- J;
    I -- J;
    F -- J [ style=invis ];
    G -- H;
    G -- K;
    H -- K;
    H -- L;
}
```

This graph has 3 connected components: $\{A, B, E, I , J\}$, $\{F\}$, and $\{C, D, G, H, K, L\}$. It turns out that `explore(v)` explores every vertex in the same connected component as $v$. Why? If a vertex $u$ is explored from a call of `explore(v)`, then there exists a path from $v$ and $u$. Since the graph is undirected, a path from $v$ to $u$ is the same as a path from $u$ to $v$. As such, a slight modification to our `dfs` algorithm allows us to identify which vertices are in the same connected component for an undirected graph.

```
def dfs(G):
    ccnum = 0
    for v in G.vertices:
        visited[v] = false
    for v in G.vertices:
        if visited[v] == false:
            explore(v, ccnum)
            ccnum += 1

def explore(v, ccnum):
    visited[v] = true
    cc[v] = ccnum
    for neighbor in edges[v]:
        if visited[neighbor] == false:
            explore(v, ccnum)
```

The only difference between this code and the one from above is the addition of a global `ccnum` counter which is incremented once for every call of `explore`. All nodes which are visited from this call are part of the same connected component, so they are assigned the same value of `ccnum` to identify which component they are in. With this change, our modified `dfs` includes an assignment of vertices to numbered connected components in its output.

### Directed acyclic graphs and topological sort

Our `dfs` method can be easily applied to directed graphs by respecting the direction of edges during `explore`. But what about connectivity in undirected graphs? Before we address that question, we need to modify our algorithm to record more state during traversal.

```
def dfs(G):
    timer = 0
    for v in G.vertices:
        visited[v] = false
    for v in G.vertices:
        if visited[v] == false:
            explore(v, timer)

def explore(v, timer):
    visited[v] = true
    previsit(v, timer)
    for neighbor in edges[v]:
        if visited[neighbor] == false:
            explore(v)
    postvisit(v, timer)

def previsit(v, timer):
    pre[v] = timer
    timer += 1

def postvisit(v, timer):
    post[v] = timer
    timer += 1
```

A global counter `timer` is initialized to 0 at the beginning of `dfs` and incremented throughout the various `explore` calls. We add two new methods, `previsit` and `postvisit`. The idea is that `previsit` records the time when we first visit a vertex and `postvisit` records when we finish processing all the neighbors of the current vertex. All `previsit` and `postvisit` do is record the current value of `timer`, then increment it by 1.

Consider the following graph:

```dot
digraph graphname {
    { rank=same; A; B; C; }
    { rank=same; D; E; F; }
    { rank=same; G; H; }
    B -> D;
    A -> B [ constraint=false ];
    A -> C;
    A -> E;
    C -> F;
    D -> E;
    D -> I [ style=invis ];
    D -> G;
    D -> H;
    E -> B [ constraint=false ];
    E -> G;
    F -> A [ constraint=false ];
    F -> H;
    I [ style=invis ];
    H -> G [ constraint=false ];
}
```

After running `dfs` on this directed graph (again, considering vertices in lexicographic order), we produce the following traversal tree. Each vertex is labeled with `(pre, post)` pairs.

```dot
digraph graphname {
    nodesep=0.5;
    node [ fixedsize=true ];
    { rank=min; A; }
    { rank=same; B; C; }
    { rank=same; D; F; }
    { rank=same; E; H; }
    A [ label=<A<BR/>1, 16> ];
    B [ label=<B<BR/>2, 11> ];
    C [ label=<C<BR/>12, 15> ];
    D [ label=<D<BR/>3, 10> ];
    E [ label=<E<BR/>4, 7> ];
    F [ label=<F<BR/>13, 14> ];
    G [ label=<G<BR/>5, 6> ];
    H [ label=<H<BR/>8, 9> ];
    A -> B;
    A -> C;
    A -> E [ style=dashed, constriant=false ];
    A -> H [ style=invis ];
    B -> C [ style=invis ];
    B -> D;
    C -> F;
    D -> E;
    D -> G [ style=dashed ];
    D -> H;
    E -> B [ style=dashed ];
    E -> G;
    F -> A [ style=dashed, constraint=false ];
    F -> H;
    H -> G [ style=dashed, constraint=false ];
}
```

Having established the means to collect previsit and postvisit times, we can now describe the 4 types of edges that are encountered during the depth-first traversal of a directed graph:

- Tree edges are included in the DFS tree.
- Back edges lead from a vertex to an ancestor of that vertex in the same tree.
- Forward edges lead from a vertex to nonchild descendant of that vertex in the same tree.
- Cross edges lead from a vertex to another vertex that is neither its ancestor nor its descendant in the same tree.

```dot
digraph graphname {
    { rank=same; C; D; }
    A -> B;
    A -> C [ dir=back, style=dashed, xlabel=back ];
    A -> D [ style=dashed, xlabel=forward ];
    B -> C [ label=tree ];
    B -> D;
    D -> C [ style=dashed, constraint=false, xlabel=cross ];
}
```

The ancestor/descendant relationship is easily read from `pre` and `post` numbers. A node $u$ is the ancestor of $v$ in the traversal tree if and only if $u$ was visited first, and $v$ was visited during the process of `explore(u)`. For `pre` and `post` numbers, this means that:

$$\text{pre}(u)<\text{pre}(v)<\text{post}(v)<\text{post}(u)$$

With this in mind, we can restate the classification of our directed DFS edges in terms of `pre` and `post`, as shown below. All edges are given as $(u, v)$.

$$
\begin{align*}
\text{tree \& forward} && \text{pre}(u)<\text{pre}(v)<\text{post}(v)<\text{post}(u)\\
\text{back} && \text{pre}(v)<\text{pre}(u)<\text{post}(u)<\text{post}(v)\\
\text{cross} && \text{pre}(v)<\text{post}(v)<\text{pre}(u)<\text{post}(u)
\end{align*}
$$

With this description in mind, we can move on to the useful and interesting properties of depth-first search on directed graphs.

**Property:** _A directed graph has a cycle if and only if its depth-first search reveals a back edge._

- First we show that, if a directed graph has a cycle, then its depth-first search reveals a back edge. Let's assume we start DFS from an vertex in the cycle, and we'll call it $v_0$. For a cycle consisting of $n$ edges, the edges in the cycle would resemble the following:
  $$
  v_0 \to v_1, v_1 \to v_2, \ldots, v_{n - 1} \to v_0
  $$
  Nodes $v_1$ through $v_{n - 1}$ are included in the traversal tree, and therefore share $v_0$ as their common ancestor. As such, $(v_{n - 1}, v_0)$ is an edge from a vertex to its ancestor, which is a back edge by definition.
- The other direction is easier. If our depth-first search starting from $u$ reveals a back edge $(v, u)$, then the path in the DFS traversal from $u$ to $v$ forms a cycle with the inclusion of $(v, u)$.

In the absence of any back edges, we can refer to a directed graph as a _directed acyclic graph_, or DAG. DAGs are useful for representing causality, dependencies, or any information of the form "x comes before y". In such cases, it would be useful for create a total ordering of all vertices such that no "x comes before y" relationship is violated.
