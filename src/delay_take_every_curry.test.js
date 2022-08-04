import { delayTakeEveryCurry } from './delay_take_every_curry'

describe('delayTakeEveryCurry', () => {
  let takeLatest, delay, fn
  beforeEach(() => {
    takeLatest = jest.fn()
    delay = jest.fn(()=>1)
    fn = jest.fn(()=>2)
  })

  it('returns a curried fn', () => {
    const curriedFn = delayTakeEveryCurry(takeLatest, delay)
    expect(typeof curriedFn).toEqual('function')
  })
  describe('curried fn', () => {
    it('calls takeLatest with action & generator function', () => {
      let action = {some:'object'}
      let actn = null
      let watchIFn = null
      const takeLatestFn = (a, watchI) => {
        actn = a
        watchIFn = watchI
      }
      const curriedFn = delayTakeEveryCurry(takeLatestFn, delay)
      curriedFn(action, fn)
      expect(action === actn).toBeTruthy()
      expect(watchIFn.constructor.name).toEqual('GeneratorFunction')
    })
    it('generator function calls delay & fn with correct props', () => {
      const actionName = 'ACTN_SOME_ACTION'
      const payload = {the:'payload'}
      const takeLatest = jest.fn((action, watchInput) => watchInput)
      const watchInput = delayTakeEveryCurry(takeLatest, delay)(actionName, fn, 500)

      const gen = watchInput(payload)
      gen.next()
      gen.next()
      expect(delay).toHaveBeenCalledTimes(1)
      expect(delay).toHaveBeenCalledWith(500)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(payload)
    })
  })
})