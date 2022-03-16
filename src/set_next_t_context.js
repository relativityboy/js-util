/**
 * Set a root path for i18Next's 't' function
 * Useful where you have deep language trees.
 * Example:
 * t('some.annoyingly.deep.path.to.text')
 * t('some.annoyingly.deep.path.to.even.more.text')
 *
 * Becomes
 * tt = setNextTContext(t, 'some.annoyingly.deep.path.to')
 * tt('text')
 * tt('even.more.text')
 *
 * the returned 'tt' function accepts the same props as 't'
 *
 * @param t
 * @param rootPath
 * @returns {function(*): *}
 */
export const setNextTContext = (t, rootPath) => {
  if(!rootPath) throw new Error('setNextTContext - rootPath must be a non-empty string')

  /**
   *
   * @param childPath
   * @param {*} [prop1]
   * @param {*} [prop2]
   * @param {*} [..etc]
   * @returns {string}
   */
  function contextedT (childPath) {
    if(!childPath) throw new Error('setNextTContext - childPath must be a non-empty string')
    const args = [`${rootPath}.${childPath}`]
    for(let i = 1; i < arguments.length; i++) {
      args.push(arguments[i])
    }
    return t.apply(this, args)
  }
  return contextedT
}