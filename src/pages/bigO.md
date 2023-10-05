---
title: Big-O
---

# Big-O Notation

Notes based on Section 0.3 of [Algorithms][1] by Dasgupta, Papadimitriou, and Vazirani.

### Basic unit of run time

To faciliate discussion of algorithms, we need a way to describe the run time of an algorithm as a function of the size of its input. Consider the following snippet of Python-like pseudocode.

```
1   nums = [ 1, 2, ..., n ]
2   for i in nums:
3       for j in nums:
4           k = i + j
```

In the analysis of this code, we cannot effectively describe the run time of the addition and assignment operations from `k = i + j` in a manner that generalizes across most scenarios. The run time of these operation are dependent on factors outside of the control of the code, including the underlying processor and operating system. To avoid this issue, we employ the abstract unit of a "computer step" for basic operations.

Returning to the analysis, let's treat the array `nums` with $n$ elements as the input to our algorithm. We see that the first for loop repeats $n$ times, and the second for loop repeats $n$ times. Then, we simplify line 4 to two computer steps: one for addition, and one for assignment. Hence, we find that our algorithm takes $n \cdot n \cdot 2 = 2n^2$ steps overall given an input of size $n$.

### What is Big-O?

Let's say that an algorithm takes $4n^3+5n^2+6$ steps. For comparisons of run time between algorithms, it is useful to omit terms that are relatively insignificant to the overall run time. As $n$ increases, $5n^2$ and $6$ don't grow as fast as $4n^3$, allowing us to ignore the smaller terms and just focus on $4n^3$. Furthermore, we can drop the constant $4$ from $4n^3$, making the big-$O$ run time $O(n^3)$. The reason for this simplification becomes more apparent with the precise definition of big-$O$ ("big oh") notation:

> Given functions $f(n)$ and $g(n)$ which take positive integer inputs and produce positive real outputs, $f(n)=O(g(n))$ if there exists a constant $k$ such that $f(n) \leq k\cdot g(n)$.

In speech, one would say that "$g$ is big oh of $f$" to convey that $g$ grows at least as fast as $f$ as the size of the input increases. Now we see why we could drop the constant from $4n^3$ to yield $O(n^3)$, since the presence of a specific constant coefficient has no effect on the big-$O$ relationship of two algorithms. There just has to exist **some** constant $k$ satisfying $f(n)\leq k \cdot g(n)$ for the relation to exist.

### Notation in practice

How does this notation help capture the difference in complexity between two algorithms? Consider the following example:

Let $f(n) = n^2$ and let $g(n)=n + 100$. For $0\leq n \leq 10$, an algorithm with complexity $f$ will take fewer steps than $g$ does. However, for all $n > 10$, having complexity $f$ will necessitate more computer steps than $g$. We can see that $g=O(f)$, since we can establish the following inequality.

$$
\frac{g(n)}{f(n)}=\frac{n+100}{n^2}\leq 101
$$

Attempting to fit $f=O(g)$ into our definition for big-$O$ will not work. As $n$ increases,

$$
\frac{f(n)}{g(n)}=\frac{n^2}{n+100}=\infty
$$

indicating that the ratio cannot be upper-bounded with a constant term.

Note that $f(n)=O(g(n))$ does not strictly mean that $g$ grows faster than $f$, as both $f(n)=O(g(n))$ and $g(n)=O(f(n))$ can be true. Let $f(n)=n+10$ and let $g(n)=2n+5$. We can perform the test from above to show that $f(n)=O(g(n))$ and $g(n)=O(f(n))$:

$$
\frac{f(n)}{g(n)}=\frac{n+10}{2n+5}\leq 2
$$

$$
\frac{g(n)}{f(n)}=\frac{2n+5}{n+10}< 2
$$

We use big-$\Theta$ ("big theta") notation to capture this case where $f(n)$ and $g(n)$ are big-$O$ of each other.

> Given functions $f(n)$ and $g(n)$, $f(n)=\Theta(g(n))$ if $f(n)=O(g(n))$ and $g(n)=O(f(n))$.

Lastly, big-$\Omega$ ("big omega") is also used to capture the big-$O$ relation in the opposite direction.

> Given functions $f(n)$ and $g(n)$, $f(n)=\Omega(g(n))$ if $g(n)=O(f(n))$.

This notation maps roughly to the comparison symbols for greater-than-or-equal-to ($\geq$), less-than-or-equal-to ($\leq$), and equality ($=$).

| Symbol | Big-         |
| ------ | ------------ |
| $\leq$ | Big-$O$      |
| $\geq$ | Big-$\Omega$ |
| $=$    | Big-$\Theta$ |

### You may want to commit this to memory

Precision and formality is necessary for comprehension, but it can be too laborious for the purpose of glancing at a pair of algorithms and determining which one is more efficient. So it is worth remembering a few general principles for doing big-$O$ comparison.

1. Multiplicative constants can be dropped.  
   Ex: $9n^2$ is the same as $n^2$, opt for the simpler second term.
2. Bigger exponents dominate, so $n^a = O(n^b)$ if $a < b$.  
   Ex: $n^2=O(n^3)$.
3. Any exponential dominates any polynomial.  
   Ex: $n^2=O(2^n)$.
4. For exponentials, bigger bases dominate, so $a^n = O(b^n)$ if $a < b$.  
   Ex: $2^n=O(3^n)$.
5. Any polynomial dominates any logarithm.  
   Ex: $\log n = O(n)$.
6. For logarithms, the base _doesn't matter_. From the logarithm [change-of-base formula][2], any logarithm differs from any logarithm of a different base by just a constant factor.  
   Ex: $\log_{10} n$ is the same as $\log n$.

[1]: https://www.amazon.com/Algorithms-Sanjoy-Dasgupta/dp/0073523402
[2]: https://proofwiki.org/wiki/Change_of_Base_of_Logarithm
