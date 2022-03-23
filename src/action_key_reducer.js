/**
 * Allows you to create a reducer-object where the keys are the action.types
 * Much faster and safer than if/else or switchblocks
 * @param inReducerMap
 * @param payloadOnly
 * @returns {(function(*=, *=): (*))|*}
 */
export const actionKeyReducer = (inReducerMap, payloadOnly=false) => {
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