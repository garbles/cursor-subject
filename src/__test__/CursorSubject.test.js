import {CursorSubject} from '../CursorSubject'

import 'rxjs/add/operator/take'

const rand = ::Math.random

function assertValue (subject, expected, done) {
  let wasChecked = false

  subject.take(1).subscribe(val => {
    assert.deepEqual(val, expected)
    wasChecked = true
    if (done) {
      done()
    }
  })

  if (!wasChecked) {
    throw new Error(`Cursor did not return sync value. Could not check.`)
  }
}

describe(`Cursor`, () => {
  it(`is a subject`, done => {
    const initial = {a: rand()}
    const next = {a: rand()}
    const cursor = CursorSubject.create(initial)

    assertValue(cursor, initial)

    cursor.next(next)

    assertValue(cursor, next, done)
  })

  it(`can refine itself to get a nested value`, done => {
    const initial = {a: {b: rand()}}
    const next = {a: {b: rand()}}
    const cursor = CursorSubject.create(initial)
    const refined = cursor.refine(`a`)

    assertValue(refined, initial.a)

    cursor.next(next)

    assertValue(refined, next.a, done)
  })

  it(`can push new values on to the refined value and update the parent`, () => {
    const initial = {a: {b: rand()}}
    const next = {a: {b: rand()}}
    const last = {a: {b: rand()}}
    const fin = {a: {b: rand()}}
    const cursor = CursorSubject.create(initial)
    const refined = cursor.refine(`a`)
    const doubleRefined = refined.refine(`b`)

    assertValue(cursor, initial)
    assertValue(refined, initial.a)
    assertValue(doubleRefined, initial.a.b)

    refined.next(next.a)

    assertValue(cursor, next)
    assertValue(refined, next.a)
    assertValue(doubleRefined, next.a.b)

    refined.next(last.a)

    assertValue(cursor, last)
    assertValue(refined, last.a)
    assertValue(doubleRefined, last.a.b)

    doubleRefined.next(fin.a.b)

    assertValue(cursor, fin)
    assertValue(refined, fin.a)
    assertValue(doubleRefined, fin.a.b)
  })

  it(`refines using a collection`, () => {
    const initial = {a: [{b: rand()}, {b: rand()}]}
    const cursor = CursorSubject.create(initial)
    const refined = cursor.refine(`a[0]`)
    const otherRefined = cursor.refine(`a[1]`)
    const doubleRefined = refined.refine(`b`)

    assertValue(refined, initial.a[0])
    assertValue(doubleRefined, initial.a[0].b)

    const next = rand()

    doubleRefined.next(next)

    assertValue(refined, {b: next})
    assertValue(doubleRefined, next)
    assertValue(otherRefined, initial.a[1])
  })

  it(`refines over a collection`, done => {
    const initial = {a: [{b: rand()}, {b: rand()}]}
    const cursor = CursorSubject.create(initial)
    const refined = cursor.refine(`a`)
    let checkedInnerCursors = 0

    const refinedCol = refined.refineCollection((cur, i) => {
      assertValue(cur, initial.a[i], () => checkedInnerCursors++)
      return cur
    })

    assertValue(refinedCol, initial.a, () => {
      assert.equal(checkedInnerCursors, initial.a.length)
      done()
    })
  })
})
