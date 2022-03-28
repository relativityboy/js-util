import { getStatePath } from "./get_state_path";

describe('getStatePath', () => {
  let state = null
  beforeEach(()=> {
    state = {
      f:'g',
      l: {
        m: 'n',
        o: {
          p: 'q'
        }
      }
    }
  })
  it('returns passed in state if no path, or empty path, is provided', () => {
    const resp = getStatePath(state)
    expect(resp === state).toBeTruthy()
    const resp2 = getStatePath(state, '')
    expect(resp2 === state).toBeTruthy()
  })
  it('returns single item path', () => {
    const resp = getStatePath(state, 'f')
    expect(resp).toEqual('g')
  })
  it('returns item at dot path', () => {
    const resp = getStatePath(state, 'l.o.p')
    expect(resp).toEqual('q')
  })
  it(`returns 'undefined' if item in path is not present`, () => {
    const resp = getStatePath(state, 'a.b.c')
    expect(typeof resp).toEqual('undefined')
  })
})