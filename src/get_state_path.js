/**
 * Passed into redux-saga select
 * @param state
 * @param path
 * @param defaultVal
 * @returns {string}
 */
export const getStatePath = (state, path='', defaultVal=undefined) => {
  const pathNodes = path.split('.')

  if(!path) return state

  const returnVal = pathNodes.reduce((acc, pathNode) => {
    if(typeof acc == 'undefined') return acc
    return acc[pathNode]
  }, state)

  if(typeof returnVal === 'undefined' && typeof defaultVal !== 'undefined') {
      return defaultVal
  }

  return returnVal
}