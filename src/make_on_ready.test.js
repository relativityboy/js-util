import { makeOnReady } from './make_on_ready'

describe('makeOnReady', () => {
  let ready1 = null
  let ready2 = null
  let ready3 = null
  beforeEach(() => {
    ready1 = jest.fn()
    ready2 = jest.fn()
    ready3 = jest.fn()
  })

  it('returns a function', () => {
    expect(typeof makeOnReady()).toBe('function')
  })
  it('returns a function with a .isReady setter', () => {
    expect(typeof makeOnReady().isReady).toBe('function')
  })
  it('does not call functions before ready', () => {
    const onReady = makeOnReady()
    onReady(ready1)
    onReady(ready2)
    expect(ready1).toHaveBeenCalledTimes(0)
    expect(ready2).toHaveBeenCalledTimes(0)
  })
  it('calls functions only after ready is called', () => {
    const onReady = makeOnReady()
    onReady(ready1)
    onReady(ready2)
    expect(ready1).toHaveBeenCalledTimes(0)
    expect(ready2).toHaveBeenCalledTimes(0)
    onReady.isReady()
    expect(ready1).toHaveBeenCalledTimes(1)
    expect(ready2).toHaveBeenCalledTimes(1)
  })
  it('calls specific functions instantly after ready (variant - already passed in)', () => {
    const onReady = makeOnReady()
    onReady(ready1)
    onReady(ready2)
    expect(ready1).toHaveBeenCalledTimes(0)
    expect(ready2).toHaveBeenCalledTimes(0)
    onReady.isReady()
    expect(ready1).toHaveBeenCalledTimes(1)
    expect(ready2).toHaveBeenCalledTimes(1)
    onReady(ready1)
    expect(ready1).toHaveBeenCalledTimes(2)
    expect(ready2).toHaveBeenCalledTimes(1)
    onReady(ready2)
    expect(ready1).toHaveBeenCalledTimes(2)
    expect(ready2).toHaveBeenCalledTimes(2)
  })
  it('calls specific functions instantly after ready (variant - passed in only after)', () => {
    const onReady = makeOnReady()
    onReady(ready1)
    onReady(ready2)
    expect(ready1).toHaveBeenCalledTimes(0)
    expect(ready2).toHaveBeenCalledTimes(0)
    expect(ready3).toHaveBeenCalledTimes(0)
    onReady.isReady()
    expect(ready1).toHaveBeenCalledTimes(1)
    expect(ready2).toHaveBeenCalledTimes(1)
    expect(ready3).toHaveBeenCalledTimes(0)
    onReady(ready3)
    expect(ready1).toHaveBeenCalledTimes(1)
    expect(ready2).toHaveBeenCalledTimes(1)
    expect(ready3).toHaveBeenCalledTimes(1)
  })
  it('calls functions with isReady data', () => {
    const onReady = makeOnReady()
    const someData = {data:'somedata'}
    onReady(ready1)
    onReady(ready2)
    expect(ready1).toHaveBeenCalledTimes(0)
    expect(ready2).toHaveBeenCalledTimes(0)
    onReady.isReady(someData)
    expect(ready1).toHaveBeenCalledTimes(1)
    expect(ready1).toHaveBeenCalledWith(someData)
    expect(ready2).toHaveBeenCalledTimes(1)
    expect(ready2).toHaveBeenCalledWith(someData)
    onReady(ready3)
    expect(ready3).toHaveBeenCalledTimes(1)
    expect(ready3).toHaveBeenCalledWith(someData)
  })
})