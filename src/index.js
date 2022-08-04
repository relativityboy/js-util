export * from './action'
export * from './action_key_reducer'
export * from './css_names'
export * from './get_state_path'
export * from './make_on_ready'
export * from './set_next_t_context'
export * from './saga_payload_only'
export * from './delay_take_every_curry'
export * from './make_sagas'


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

export const elapsed = (start=false) => {
  if(!start) {
    const strt = Date.now()
    return () => (Date.now() - strt) / 1000
  }
  return (Date.now() - start) / 1000
}

/**
 *
 * @param filterOutAttributes
 * @param obj
 * @param filterIn
 * @returns {*}
 */
export const filterOut = (filterOutAttributes=[], obj, filterIn=false) => {
  if(filterIn) {
    return this.filterIn.reduce((acc, key)=> {
      if(obj.hasOwnProperty(key) && !filterOutAttributes.includes(key)) {
        acc[key] = obj[key]
      }
      return acc
    }, {})
  } else {
    return Object.keys(obj).reduce((acc, key)=>{
      if(!filterOutAttributes.includes(key)) {
        acc[key] = obj[key]
      }
      return acc
    }, {})
  }
}

/**
 * Reduces an object or an array. inAcc defaults to an empty object
 * @param iteratee [], {}
 * @param reducer ()
 * @param start
 * @returns {{}}
 */
export const reduce = (iteratee, reducer, start=false) => {
  let acc
  if(iteratee.constructor === Array) {
    acc = start? start : []
    for(let i = 0; i < iteratee.length; i++) {
      acc = reducer(acc, iteratee[i], i)
    }
  } else {
    acc = start? start : {}
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

const searchAllExpressions = {
  '=':(compareValue) => (val) => val === compareValue,
  '<':(compareValue) => (val) => val < compareValue,
  '>':(compareValue) => (val) => val > compareValue,
  '>=':(compareValue) => (val) => val > compareValue || val === compareValue,
  '<=':(compareValue) => (val) => val < compareValue || val === compareValue,
  'startsWith': (compareValue) => (val) => val.starsWith(compareValue),
  'endsWith':(compareValue) => (val) => val.endsWith(compareValue),
  'includes': (compareValue) => (val) => val.includes(compareValue),
  'like':(compareValue) => {
    let compVal
    if(compareValue.startsWith('%') && compareValue.endsWith('%')) {
      compVal = compareValue.slice(1,-1)
      return searchAllExpressions.includes(compVal)
    }
    if(compareValue.startsWith('%')) {
      compVal = compareValue.slice(1)
      return searchAllExpressions.endsWith(compVal) === 0
    }
    if(compareValue.endsWith('%')) {
      compVal = compareValue.slice(0,-1)
      return searchAllExpressions.startsWith(compVal)
    }
    return (val) => val === compareValue
  },
}

/**
 * Creates a closure that searches all the 'things' in a list of things, based on thing[propName] === propValue and returns a list of shallow copies
 * All compar
 * @param searchParams - {}
 *  {
 *    key:'value',
 *    key2:['like', 'value%'], // '%value', 'value%', '%value%'
 *    key3:['like', '%value%'],
 *    key4:['>', value'] // '>', '<', '=', '>=', '<='
 *  }
 * @param or boolean - toggles 'all comparisons match' or 'at least one comparison matches'
 * @returns function
 *
 * Closure - when called will return a shallow copy of the matching objects in 'list',
 * @param list
 * @returns []
 */
export const searchAllBy = (searchParams, or=false) => {
  const searchExpressions = {}
  const searchKeys = Object.keys(searchParams)

  searchKeys.forEach((key) => {
    switch (typeof searchParams[key]) {
      case 'function' :
        searchExpressions[key] = (searchParams[key])
        break
      case 'object' :
        if(searchParams[key].constructor === Array) {
          if(searchParams[key].length !== 2) throw Error(`searchAllBy requires search array expressions be in the form of ['comparator', value]`)
          if(!searchAllExpressions.hasOwnProperty(searchParams[key][0])) throw Error(`searchAllBy cannot search by '${searchParams[key][0]}`)
          searchExpressions[key] = searchAllExpressions[searchParams[key][0]](searchParams[key][1])
        }
        break
      default :
        searchExpressions[key] = searchAllExpressions['='](searchParams[key])
    }
  })

  if(or === false)  {
    return (list, originals=false) => {
      return list.reduce((acc, item)=> {
        let push = true
        for (let i = 0; i < searchKeys.length; j++) {
          if (!searchExpressions[searchKeys[j]](item[searchKeys[j]])) {
            push = false
            break
          }
        }
        if(push) {
          if(originals) acc.push(item)
          else acc.push(Object.assign({}, item))
        }
        return acc
      }, [])
    }
  } else {
    return (list, originals=false) => {
      return list.reduce((acc, item)=> {
        let push = false
        for (let i = 0; i < searchKeys.length; j++) {
          if (searchExpressions[searchKeys[j]](item[searchKeys[j]])) {
            push = true
            break
          }
        }
        if(push) {
          if(originals) acc.push(item)
          else acc.push(Object.assign({}, item))
        }
        return acc
      }, [])
    }
  }
}

/**
 * Puts newItem into an existing list, either at every location where propName == newItem[propName], or inserts it at the end of the list
 * (use with caution)
 * @param list
 * @param propName
 * @param newItem
 * @param unshift=false if true, new items will be put at the beginning of the list
 * @returns {Uint8Array | BigInt64Array | *[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
 */
export const putOneBy = (list, propName, newItem, unshift=false) => {
  let found = false
  const respList = list.map(item => (item[propName] === newItem[propName] && (found = true))? newItem : item )
  if(!found) {
    if(unshift) {
      respList.unshift(newItem)
    } else {
      respList.push(newItem)
    }
  }
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
 * @param raw - if you want the raw object instead of a function (not recommended)
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
 * Filter for Redux style actions. causes the passed function to only receive payload
 * @param fn
 * @returns {function(*=, *): *}
 */
export const payloadOnly = (fn) => (state, action) => fn(state, action.payload)

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
export const seconds = (millis=false) => Math.floor(((typeof millis !== 'boolean')? millis : Date.now()) / 1000)


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


const alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
const Alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
const num = ['0','1','2','3','4','5','6','7','8','9']
const AlphaNum = [...alpha, ...Alpha, ...num]

export const randStr = (charArray, length) => {
  let resp = ''
  for(let i = 0; i < length; i++) {
    resp += charArray[Math.floor(Math.random() * charArray.length)]
  }
  return resp
}


export const randNumStr = (length) => randStr(num, length)

export const randAlphaNum = (length) => randStr(AlphaNum, length)