---
layout: default
---

# C加加

My personal C++ reference, guaranteed to be much worse than any comparable resource that can be found online.

---

## `public`, `private`, `protected`

The fields (variables) and methods (functions) of a class are collectively referred to as the _members_ of that class.

Members of a class that are `public` are accessible from anywhere.

Members of a class that are `private` are only accessible from methods of the same object (so different objects of the same class are still denied access!)

`struct` members are public by default, whereas `class` members are private by default.

```cpp
class Foo
{
// implicit private
    int bar;
    void boo() { ++bar; }
public:
    void far() { boo(); }
};

int main()
{
    Foo f1, f2;
    f1.bar = f2.bar; // error: bar is private
    f1.boo();        // error: boo is private
    f1.far();        // ok!
}
```

Members of a class marked as `protected` are accessible from methods of derived (child) classes.

Remember: `private` members are never, ever inherited! The ways in which the different kinds of inheritance change member access specification are shown below.

```cpp
class Foo
{
public:
    int pub;
private:
    int priv;
protected:
    int prot;
};

class PubFoo : public Foo
{
// public:
//     int pub;
// protected:
//     int prot;
};

class ProtFoo : protected Foo
{
// protected:
//     int pub;
//     int prot;
};

class PrivFoo : private Foo
{
// private:
//     int pub;
//     int prot;
};
```

---

## References

- [learncpp.com](https://www.learncpp.com)

