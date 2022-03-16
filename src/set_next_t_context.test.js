import { setNextTContext } from './set_next_t_context'

describe('setNextTContext', () => {
  let t = null
  beforeEach(() => {
    t = jest.fn(fullPath => fullPath)
  })
  it('Errors on falsy rootPath', () => {
    expect(() => {
      setNextTContext(t, '')
    }).toThrow('setNextTContext - rootPath must be a non-empty string')
    expect(() => {
      setNextTContext(t)
    }).toThrow('setNextTContext - rootPath must be a non-empty string')
  })
  it('returns a function tt', () => {
    const tt = setNextTContext(t, 'rootPath')
    expect(typeof tt).toEqual('function')
  })
  it(`tt prepends '<rootPath>.'`, () => {
    const tt = setNextTContext(t, 'rootPath')
    expect(tt('childPath')).toEqual('rootPath.childPath')
  })
  it(`tt passes additional arguments on to t`, () => {
    const tt = setNextTContext(t, 'rootPath')
    const fullPath = tt('childPath', '1', 2, 'bc')
    expect(fullPath).toEqual('rootPath.childPath')
    expect(t).toHaveBeenCalledWith('rootPath.childPath', '1', 2, 'bc')
  })
})
