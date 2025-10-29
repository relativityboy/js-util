/**
 * Use makeOnReady to call a set of functions automatically after a 'ready' event has happened (ex some data becomes available).
 * Multiple instances supported.
 * Useful for asynchronous coding, particularly when you do not know if the desired application state has been reached yet or not.
 *
 * Example -
 * import { makeOnReady } from '@relativityboy/js-util'
 *
 * const onReady = makeOnReady() //initialize - you should probably pick a name that makes sense to you.
 *
 * const yourFunction = (data) => doSomethingCoolWith(data)
 * onReady(yourFunction) ///nothing happens
 *
 * const yourFunction2 = (data) => doSomethingCoolWith(data)
 * onReady(yourFunction2) ///still nothing happens
 *
 * .... //some time later, somewhere else maybe
 *
 * onReady.isReady(someData) // yourFunction is called with someData, and then yourFunction2 is called with someData
 *
 * .... //additional milliseconds later
 *
 * onReady(yourFunction2) ///called instantly
 *
 * @returns {function}
 */
export const makeOnReady = () => {
  const readyQueue = []
  let ready = false
  let props = null

  const isReady = (readyProps = null) => {
    props = readyProps
    ready = true
    while(readyQueue.length > 0) {
      readyQueue.shift()(props)
    }
  }

  const onReady = (fn) => {
    if(ready) {
      fn(props)
    } else {
      readyQueue.push(fn)
    }
  }

  onReady.isReady = isReady

  return onReady
}
