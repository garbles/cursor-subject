# RxJS Cursor Subject

## Le what?

Create a Subject which also behaves like a [Cursor](https://github.com/omcljs/om/wiki/Cursors).
Allows the consumer to repeatedly refine (map) a subject to a subtree of the original data while
being able to push new values on to that subtree, still updating the original, unrefined subject.

## Example

```js
import {CursorSubject} from 'cursor-subject'

const cursor = CursorSubject.create({a: {b: {c: {d: 42}}}})

const refined = cursor.refine(`a.b`)
const doubleRefined = refined.refine(`c.d`)

doubleRefined.next(55)

cursor.take(1).subscribe(::console.log) // prints {a: {b: {c: {d: 55}}}}
refined.take(1).subscribe(::console.log) // prints {c: {d: 55}}

cursor.next({a: {b: {c: {d: 100}}}})

doubleRefined.take(1).subscribe(::console.log) // prints 100
```
