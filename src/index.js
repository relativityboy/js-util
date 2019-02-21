/**
 * match an underscore and a word
 * @type {RegExp}
 */
const rUnderscore = /(_\w)/g

/**
 * convert the match at [1] to uppercase and return it.
 * @param matches
 * @returns {string}
 */
const convert = matches => matches[1].toUpperCase()

/**
 * Get a shallow copy of 'obj' with only the 'keys' attributes.
 * Returns a curried filter function if only 'keys' is passed
 * @param keys
 * @param obj
 * @returns {*}
 */
export const filter = (keys, obj=false) => {
  if(obj)
    return keys.reduce((acc, key) => {
      if (keys.includes(key)) acc[key] = obj[key]
      return acc
    }, {})

  return (obj) => {
    return keys.reduce((acc, key) => {
      if (obj.hasOwnProperty(key)) acc[key] = obj[key]
      return acc
    }, {})
  }
}

export const reduce = (iteratee, reducer, start) => {
  let acc = start
  if(iteratee.constructor === Array) {
    for(let i = 0; i < iteratee.length; i++) {
      acc = reducer(acc, iteratee[i], i)
    }
  } else {
    const keys = Object.keys(iteratee)
    for(let i = 0; i < keys.length; i++) {
      acc = reducer(acc, iteratee[keys[i]], keys[i])
    }
  }
  return acc
}


/**
 * Makes a camelCased copy of a snake_cased string
 * @param str
 * @returns {string}
 */
export const toCamelStr = str => str.replace('__','_').replace(rUnderscore, convert)

/**
 * Makes a camelCased copy of a snake_cased object
 * @param obj
 * @returns {{}}
 */
export const toCamelObj = obj =>
  Object.keys(obj).reduce((out, key) => {
    out[toCamelStr(key)] = toCamel(obj[key])
    return out
  }, {} )

/**
 * Makes a camelCased copy of a list of snake_cased things
 * @param shallowList
 * @returns {Uint8Array | BigInt64Array | {}[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
 */
export const toCamelList = shallowList => shallowList.map(toCamel)

/**
 * makes a camelCased copy of a snake_cased thing.
 * @param obj
 * @returns {*}
 */
export const toCamel = obj =>
  (typeof obj === 'object')? ((obj.constructor === Array)? toCamelList(obj) : toCamelObj(obj)) : obj


/**
 * Finds a single 'thing' in a list of things, based on thing[propName] === propValue and returns a shallow copy of that thing
 * @param list
 * @param propName
 * @param propValue
 * @returns {*}
 */
export const findOneBy = (list, propName, propValue) => {
  for(let i = 0; i < list.length; i++) {
    if(list[i][propName] === propValue) {
      return Object.assign({}, list[i])
    }
  }
  return null
}

/**
 * Finds all the 'things' in a list of things, based on thing[propName] === propValue and returns a list of shallow copies
 * @param list
 * @param propName
 * @param propValue
 * @returns {*}
 */
export const findAllBy = (list, propName, propValue) => {
  const resp = [];
  for(let i = 0; i < list.length; i++) {
    if(list[i][propName] === propValue) {
      resp.push(Object.assign({}, list[i]))
    }
  }
  return resp
}

/**
 * Puts newItem into an existing list, either at every location where propName == newItem[propName], or inserts it at the end of the list
 * (use with caution)
 * @param list
 * @param propName
 * @param newItem
 * @returns {Uint8Array | BigInt64Array | *[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
 */
export const putOneBy = (list, propName, newItem) => {
  let found = false
  const respList = list.map(item => (item[propName] === newItem[propName] && (found = true))? newItem : item )
  if(!found) respList.push(newItem)
  return respList
}

/**
 * get a function that can find an item in the list by attribute attrName in constant time. Values of attrName must be unique
 * @param list
 * @param attrName
 * @returns {function(*, *): *}
 */
export const indexify = (list, attrName) => {
  const obj = list.reduce((acc, item) => {
    if(acc.hasOwnProperty(item[attrName])) throw Error(`multiple objects in list have same .${attrName} value: ${item[attrName]} use indexifyArrays() instead.`)
    acc[item[attrName].toString()] = item
    return acc
  }, {})
  return (id, all) => {  return (all)? obj : obj[id.toString()]}
}


/**
 * get a function that can find all items in the list by attribute attrName in constant time. The response is always an array of items.
 * @param list
 * @param attrName
 * @returns {function(*, *): *}
 */
export const indexifyArrays = (list, attrName, raw=false) => {
  const obj = list.reduce((acc, item) => {
    if(!acc.hasOwnProperty(item[attrName])) {
      acc[item[attrName]] = []
    }
    acc[item[attrName]].push(item)
    return acc
  }, {})
  const fn = raw? obj : id => obj[id]
  if(obj !== fn) {
    fn.obj = obj
  }
  return fn
}

/**
 * Get the number of seconds into the current day for a given Date object (beware timezones! Nodejs people!)
 * @param date
 * @returns {number}
 */
export const getDaySeconds = (date=(new Date())) =>{
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
}

/**
 * Alphabetizes a list
 * @param propName
 * @param caseSensitive
 * @returns {Function}
 */
export const sortList = (propName, caseSensitive=false) => {
  if(!caseSensitive) {
    return (list) => {
      return list.slice().sort((a, b) => {
        if (a[propName] === b[propName])
          return 0

        if (a[propName] < b[propName])
          return -1

        return 1
      })
    }
  } else {
    return (list) => {
      return list.slice().sort((a, b) => {
        try {
          const propA = a[propName].toLowerCase()
          const propB = b[propName].toLowerCase()
          if (propA === propB) return 0
          if (propA < propB) return -1
          return 1
        } catch (e) {
          console.error(`sortList expected a string and likely got something else... returning 0. Values were as follows a.${propName}:`, a[propName], `b.${propName}:`, b[propName], 'list:', list)
          return 0
        }
      })
    }
  }
}

/**
 * Returns a copy of state with newProps assigned.
 * @param state
 * @param newPropsOrPath
 * @param propValue
 * @param merge
 * @returns {*}
 */
export const newState = (state, newPropsOrPath, propValue, merge=true) => {
  if(typeof propValue === 'undefined')  return Object.assign({}, state, newPropsOrPath)
  const path = (typeof newPropsOrPath === 'string')? newPropsOrPath.split('.') : newPropsOrPath
  return newStateByPath(state, path, propValue, merge)
}

const newStateByPath = (state, path, propValue, merge=false ) => {
  const attrName = path.shift();
  let childState
  if(path.length > 0) {
    childState = {[attrName]:newState(state[attrName], path, propValue, merge)}
  } else {
    if(merge && state.hasOwnProperty(attrName) && typeof propValue === 'object' && propValue.constructor !== Array) {
      childState = {[attrName]:Object.assign({}, state[attrName], propValue)}
    } else {
      childState =  {[attrName]:propValue}
    }
  }
  return Object.assign({}, state, childState)
}


/**
 * Passed into redux-saga select
 * @param state
 * @param path
 * @returns {string}
 */
export const getStatePath = (state, path) => {
  const pathNodes = path.split('.')

  if(!path) return state

  return pathNodes.reduce((acc, pathNode) => {
    return acc[pathNode]
  }, state)
}

/**
 * Filter for Redux/Saga style actions. causes the passed function to only receive payload
 * @param fn
 * @returns {function(*=, *): *}
 */
export const payloadOnly = (fn) => (state, action) => fn(state, action.payload)

/**
 * Creates a Redux/Saga style action object
 * @param type
 * @param payload
 * @returns {{payload: *, type: *}}
 */
export const action = (type, payload) =>{ return {type, payload} }


/**
 * Takes a number of seconds and multiplies it by 1000
 * @param seconds
 * @returns {number}
 */
export const millis = seconds => seconds * 1000

/**
 * Takes a number of seconds an divides by 1000, then floor.
 * @param millis
 * @returns {number}
 */
export const seconds = millis => Math.floor(millis / 1000)

/**
 * Returns a 'pretty' formatted json string
 * @param obj
 * @returns {string}
 */
export const jsPretty = (obj) => JSON.stringify(obj, null, 2)

/**
 * Outputs a 'pretty' formatted json string to the console
 * @param obj
 * @returns {string}
 */
export const jsPrettyConsole = (obj) => console.log(jsPretty(obj))