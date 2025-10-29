import {action} from './action'

/**
 * Allows you to create a reducer-object (inReducerMap) where the keys are the action.types
 * Much faster and safer than if/else or switch blocks
 *
 * returns the reducer
 *
 * @param inReducerMap
 * @param payloadOnly
 * @returns {(function(*=, *=): (*))|*}
 */
export const actionKeyReducer = (inReducerMap, payloadOnly=false) => {
  const {...reducerMap} = inReducerMap

  return  (state, action) => {
    if(reducerMap.hasOwnProperty(action.type)) {
      if(payloadOnly) {
        return reducerMap[action.type](state, action.payload)
      }
      return reducerMap[action.type](state, action)
    }
    return state
  }
}

/**
 * Returns an object with
 * 'reducer' - a reducer where inReducerMap's keys are the action.types (just like actionKeyReducer)
 * 'actions' - an object with action creator functions where actions['someaction'] is a function that creates an action of action.type == 'someaction'
 *
 * @param inReducerMap
 * @param payloadOnly
 * @returns {{actions: {}, reducer: (function(*=, *=): *)|*}}
 */
export const makeActionCreatorsAndReducer = (inReducerMap, payloadOnly=false) => {
  const reducer = actionKeyReducer(inReducerMap, payloadOnly)
  const actions = {}
  for(let actionName in inReducerMap) {
    actions[actionName] = (payload) => action(actionName, payload)
  }
  return {actions, reducer}
}
