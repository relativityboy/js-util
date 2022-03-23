import { actionKeyReducer } from "./action_key_reducer"

describe('actionKeyReducer', () => {
  const ACTN_1 = 'ACTN_1'
  const ACTN_2 = 'ACTN_2'
  const ACTN_3 = 'ACTN_3'
  let reduce1, reduce2, reduce3 = null
  let reducerMap = null

  beforeEach(() => {
    reduce1 = jest.fn(()=>({actn:1}))
    reduce2 = jest.fn(()=>({actn:2}))
    reduce3 = jest.fn(()=>({actn:3}))
    reducerMap = {
      [ACTN_1]: reduce1,
      [ACTN_2]: reduce2,
      [ACTN_3]: reduce3
    }
  })

  it('produces a reducer function when called', () => {
    const reducer = actionKeyReducer({})
    expect(typeof reducer).toEqual('function')
  })
  describe('reducer', () => {
    it('calls only the correct action.type reducer & returns its output', () => {
      const reducer = actionKeyReducer(reducerMap)
      const action = {type:ACTN_2, payload:'bunny'}
      const state = {fuzz:'ball'}

      const newState = reducer(state, action)

      expect(reduce1).toHaveBeenCalledTimes(0)
      expect(reduce2).toHaveBeenCalledTimes(1)
      expect(reduce3).toHaveBeenCalledTimes(0)

      expect(reduce2).toHaveBeenLastCalledWith(state, action)

      expect(newState).toEqual({actn:2})
    })

    it('passes only the payload if payloadOnly=true', () => {
      const reducer = actionKeyReducer(reducerMap, true)
      const action = {type:ACTN_2, payload:'bunny'}
      const state = {fuzz:'ball'}

      const newState = reducer(state, action)

      expect(reduce1).toHaveBeenCalledTimes(0)
      expect(reduce2).toHaveBeenCalledTimes(1)
      expect(reduce3).toHaveBeenCalledTimes(0)

      expect(reduce2).toHaveBeenLastCalledWith(state, action.payload)

      expect(newState).toEqual({actn:2})
    })

    it('calls no reducers and returns state if action.type is not matched', () => {
      const reducer = actionKeyReducer(reducerMap)
      const action = {type:'no-action', payload:'bunny'}
      const state = {fuzz:'ball'}

      const newState = reducer(state, action)

      expect(reduce1).toHaveBeenCalledTimes(0)
      expect(reduce2).toHaveBeenCalledTimes(0)
      expect(reduce3).toHaveBeenCalledTimes(0)

      expect(newState === state).toEqual(true) //should be *same* object.
    })

    it('maintains reducer action relationships even if reducer map is modified after initialization', () => {
      const reducer = actionKeyReducer(reducerMap, true)
      delete reducerMap[ACTN_2]
      const action = {type:ACTN_2, payload:'bunny'}
      const state = {fuzz:'ball'}

      expect(reducerMap).toStrictEqual({
        [ACTN_1]: reduce1,
        [ACTN_3]: reduce3
      })

      const newState = reducer(state, action)

      expect(reduce1).toHaveBeenCalledTimes(0)
      expect(reduce2).toHaveBeenCalledTimes(1)
      expect(reduce3).toHaveBeenCalledTimes(0)

      expect(reduce2).toHaveBeenLastCalledWith(state, action.payload)

      expect(newState).toEqual({actn:2})
    })
  })

})
/**
 * Allows you to create a reducer-object where the keys are the action.types
 * Much faster and safer than if/else or switchblocks
 * @param inReducerMap
 * @param payloadOnly
 * @returns {(function(*=, *=): (*))|*}
 */
export const actionKeyReducerk = (inReducerMap, payloadOnly=false) => {
  const {...reducerMap} = inReducerMap

  return (state, action) => {
    if(reducerMap.hasOwnProperty(action.type)) {
      if(payloadOnly) {
        return reducerMap[action.type](state, action.payload)
      }
      return reducerMap[action.type](state, action)
    }
    return state
  }
}