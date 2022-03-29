import { delayTakeEveryCurry } from './delay_take_every_curry'

describe('delayTakeEveryCurry', () => {
  let takeLatest, delay, fn
  beforeEach(() => {
    takeLatest = jest.fn()
    delay = jest.fn()
    fn = jest.fn()
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
      let action = {some:'object'}

      const curriedFn = delayTakeEveryCurry(takeLatest, delay, 500)
      curriedFn(action, fn)
      expect(delay).toHaveBeenCalledTimes(1)
      expect(delay).toHaveBeenCalledWith(500)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(action)
    })
  })
})