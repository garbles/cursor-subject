import {Subject} from 'rxjs/Subject'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import get from 'lodash/get'

import {createRootSwapFn} from './createRootSwapFn'
import {toArray} from './toArray'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/distinctUntilChanged'

export class CursorSubject extends Subject {
  constructor (destination, rootSwap, paths = []) {
    super()

    this.destination = destination

    this.source = Observable.create(obs => {
      const sub = destination.subscribe(obs)
      return () => sub.unsubscribe()
    })

    this._paths = paths
    this._rootSwap = rootSwap
  }

  refine (paths) {
    return this._refine(toArray(paths))
  }

  _refine (paths) {
    const newDestination = this.destination.map(val => get(val, paths)).distinctUntilChanged()
    const newPaths = this._paths.concat(paths)
    return new CursorSubject(newDestination, this._rootSwap, newPaths)
  }

  _next (value) {
    this._rootSwap(this._paths, value)
  }
}

CursorSubject.create = (initial) => {
  const source = new BehaviorSubject(initial)
  const rootSwap = createRootSwapFn(initial, source)

  return new CursorSubject(source, rootSwap)
}
