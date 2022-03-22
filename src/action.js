/**
 * Creates a Redux/Saga style action object
 * @param type
 * @param payload
 * @returns {{payload: *, type: *}}
 */
export const action = (type, payload) => {
  if(typeof type !== 'string') throw new Error(`action - first argument (action type) is '${typeof type}' must be string`)
  return {type, payload}
}