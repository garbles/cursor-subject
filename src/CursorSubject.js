import {Subject} from 'rxjs/Subject'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject'
import get from 'lodash/get'
import baseToPath from 'lodash/internal/baseToPath'
import {createRootSwapFn} from './createRootSwapFn'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/combineLatest-static'

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
    return this._refine(baseToPath(paths))
  }

  refineCollection (fn) {
    return this.destination.switchMap(arr => {
      const len = arr.length
      const newArr = Array(len)
      let i = -1

      while (++i < len) {
        newArr[i] = fn.call(null, this._refine(i), i, this)
      }

      return Observable.combineLatest(newArr)
    })
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
