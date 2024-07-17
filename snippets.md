---
layout: default
katex: true
---

# Snippets

This page features snippets of code implementing common algorithms, design patterns, and whatnot for my own reference.

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

- Returns an index into $$A$$ if `target` is found, or $$-1$$ otherwise.
- Implementing the midpoint computation with $$l+(r-l)/2$$ avoids integer overflow.
- The right pointer `r` is an exclusive upper bound, so the range of elements being considered for each loop of the search is $$[A_l, A_{r-1}]$$.
