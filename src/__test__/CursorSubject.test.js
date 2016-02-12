import {CursorSubject} from '../CursorSubject'

import 'rxjs/add/operator/take'

describe(`Cursor`, () => {
  it(`is a subject`, done => {
    const initial = {a: 1}
    const next = {a: 2}
    const cursor = CursorSubject.create(initial)

    cursor.take(1).subscribe(val => {
      assert.deepEqual(val, initial)
    })

    cursor.next({a: 2})

    cursor.take(1).subscribe(val => {
      assert.deepEqual(val, next)
      done()
    })
  })

  it(`can refine itself to get a nested value`, done => {
    const initial = {a: {b: 1}}
    const next = {a: {b: 2}}
    const cursor = CursorSubject.create(initial)
    const refined = cursor.refine(`a`)

    refined.take(1).subscribe(val => {
      assert.deepEqual(val, initial.a)
    })

    cursor.next(next)

    refined.take(1).subscribe(val => {
      assert.deepEqual(val, next.a)
      done()
    })
  })

  it(`can push new values on to the refined value and update the parent`, () => {
    const initial = {a: {b: 1}}
    const next = {a: {b: 2}}
    const last = {a: {b: 3}}
    const cursor = CursorSubject.create(initial)
    const refined = cursor.refine(`a`)
    const doubleRefined = refined.refine(`b`)

    cursor.take(1).subscribe(val => {
      assert.deepEqual(val, initial)
    })

    refined.take(1).subscribe(val => {
      assert.deepEqual(val, initial.a)
    })

    doubleRefined.take(1).subscribe(val => {
      assert.deepEqual(val, 1)
    })

    refined.next(next.a)

    cursor.take(1).subscribe(val => {
      assert.deepEqual(val, next)
    })

    refined.take(1).subscribe(val => {
      assert.deepEqual(val, next.a)
    })

    doubleRefined.take(1).subscribe(val => {
      assert.deepEqual(val, 2)
    })

    refined.next(last.a)

    cursor.take(1).subscribe(val => {
      assert.deepEqual(val, last)
    })

    refined.take(1).subscribe(val => {
      assert.deepEqual(val, last.a)
    })

    doubleRefined.take(1).subscribe(val => {
      assert.deepEqual(val, 3)
    })

    doubleRefined.next(4)

    cursor.take(1).subscribe(val => {
      assert.deepEqual(val, {a: {b: 4}})
    })

    refined.take(1).subscribe(val => {
      assert.deepEqual(val, {b: 4})
    })

    doubleRefined.take(1).subscribe(val => {
      assert.deepEqual(val, 4)
    })
  })
})
