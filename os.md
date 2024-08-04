---
layout: default
katex: true
---

# Operating Systems

- [Concurrency](#concurrency)

---

## Concurrency

__Concurrency__ refers to how independent sets of instructions may be executing at the same time in a machine

A __process__ is, abstractly, a set of sequential instructions acting on a set of variables

- A process owns one or more __threads__, each of which...
  1. independently executes a set of instructions,
  2. owns a set of local variables that no other thread may access, and
  3. shares access to the process's global variables
- Processes do not access each other's memory spaces directly (unless the OS maps their pages to the same frame of physical memory)

__Synchronization__ means to ensure that program state is consistent among across multiple concurrent events

A __race condition__ occurs when different interleavings of parallel instructions from concurrent program threads can produce different behavior

- A __critical section__ in a multithreaded program must be executed atomically in order for its behavior to be correct
- __Atomic execution__ means that a thread's instructions are executed without interleaving other threads' instructions

A __mutex__ (short for "mutual exclusion") is a synchronization primitive that enables atomic execution

- When a thread locks an unlocked mutex, no other thread may lock the mutex
- When a thread attempts to lock a locked mutex, it will be blocked until the mutex is unlocked

__Condition variables__ are useful for implementing "test under lock" synchronization

- A thread acquires a mutex, tests some condition, then calls `wait` on a condition variable if it must wait for the condition to change before proceeding
- By calling `wait`, the thread relinquishes its lock and goes to sleep until a signal wakes it up
- When a thread calls `signal` on a condition variable, at least one thread blocked on the condition variable is signaled to wake up
- After the thread wakes up, it should recheck the condition it is waiting for, since another thread may preempt its reacquisition of the mutex

__Semaphores__ also implement synchronization, but their functionality revolves around a signed integer value

- Semaphores are initialized with some non-negative value, but this value can only be modified with the `P` and `V` methods
- Calling `P` (for proberen, "to try") on a semaphore decrements its value and blocks the thread if the resulting value is negative
- Calling `V` (for verhogen, "increment") on a semaphore increments its value and signals some sleeping thread to wake up, if any
- If a semaphore has value $$n$$, then `P` can be called $$n$$ times without blocking (assuming `V` is never called in between)
- If a semaphore has value $$-n$$, then $$n$$ threads are blocked

__Deadlock__ occurs when multiple threads are blocked and each thread can only become unblocked by the actions of the other blocked threads, requires...

1. Mutually exclusive access to the resource that dictates the conditions for making progress
2. Hold-and-wait: a thread will lock some resource, then wait for access to another resource
3. No preemption: a thread waiting for some resource will only unblock once the resource is available
4. Circular dependency of wait conditions, e.g. A waits for B, B waits for A

---

## References

- Professor Rich Wolski's Operating Systems [lectures](https://sites.cs.ucsb.edu/~rich/class/cs170/)
