/**
 * Passed into redux-saga select
 * @param state
 * @param path
 * @returns {string}
 */
export const getStatePath = (state, path='') => {
  const pathNodes = path.split('.')

  if(!path) return state

  return pathNodes.reduce((acc, pathNode) => {
    if(typeof acc == 'undefined') return acc
    return acc[pathNode]
  }, state)
}