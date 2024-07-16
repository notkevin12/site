---
layout: default
katex: true
---

# Snippets

This page features snippets of code implmenting common algorithms, design patterns, and whatnot for my own reference.

### Binary Search

```cpp
int bin_search(vector<int> A, int target)
{
    int l = 0, r = A.size();
    while (l < r) {
        int m = l + (r - l) / 2;
        if (A[m] == target) {
            return m;
        } else if (A[m] < target) {
            r = m;
        } else {
            l = m + 1;
        }
    }
    return -1;
}
```

- Implementing the midpoint computation with `l + (r - l) / 2` avoids integer overflow.
- The right pointer `r` is an exclusive upper bound, so the range of elements being considered for each loop of the search is $$[A_l, A_r)$$.
