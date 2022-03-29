/**
 * Filter for Redux style actions. causes the passed function to only receive payload
 * @param fn
 * @returns {function(*=, *): *}
 */
export const sagaPayloadOnly = (fn) => (action) => fn(action.payload)