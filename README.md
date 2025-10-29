# js-util

This package isn't for you. But you can use it. 

Zero production deps.

It holds oft implemented utility patterns. 

If you're looking for a generic util solution consider 
[lodash](https://www.npmjs.com/package/lodash), a more complete
and better tested util library.  

---

## Functions by category

### redux
**actionKeyReducer** - Allows you to create a reducer-object where the keys are the action.types 
Much faster and less error prone than `if/else` or `switch` blocks

_After the creation of `makeActionCreatorsAndReducer` Redux Toolkit introduced `createSlice`, which follows a very similar pattern.
While the actionKeyReducer is a little faster, `createSlice` is widely adopted and well supported. Unless you need the 
speed and customizability, i recommend using `createSlice` .

Example with three actions:
```javascript
import { configureStore } from '@reduxjs/toolkit'

const updateUsername = (state, userName) => (
        {...state, user: {...state.user, userName}}
    )

const reducerMap = {
    [ACTN_LOGIN]: (state, user) => ({...state, user}),
    [ACTN_LOGOUT]: (state) => ({...state, user: false}),
    [ACTN_UPDATE_USERNAME]: updateUsername
}

const reducer = actionKeyReducer(reducerMap, true) // the 'true' unwraps the payload from the action, resulting in simpler reducers
const store = configureStore({reducer, preloadedState: {}})

```

**makeActionCreatorsAndReducer** - creates the same reducer as `actionKeyReducer` but also auto generates action creators to go with it.

Example 
```javascript
import { configureStore } from '@reduxjs/toolkit'

//given the reducerMap from above

const {reducer, actions} = makeActionCreatorsAndReducer(reducerMap)
const store = configureStore({reducer, preloadedState: {}})
store.dispatch(
  actions[ACTN_LOGIN]( {userName:'bob'} )
)

// the created action looks like  {type: ACTN_LOGIN, payload: {userName:'bob'}}
```

**getStatePath** - retrieves a node from an object tree. Returns undefined otherwise. 
Less relevant now that support for `?.` is widespread, but still very convenient for dynamic paths.

See [tests for examples](./src/get_state_path.test.js).

**action** - a simple function to make producing actions cleaner and more reliable.
The action type has to be a string, and if payload isn't passed in, becomes an undefined property (this helps with other automations like payloadOnly).
``` 
// OLD
dispatch({
  action:'My action',
  payload: { some:'random payload' }
})

// Becomes
dispatch(action('My action', { some:'random payload' }))
```

### redux-saga

### generic 


**makeOnReady** - an on-ready queue in a single line, with data! - save yourself 20 lines of code and 80 lines of tests!
```
```
**setNextTContext** - to help with deep language paths. Simpler and more reliable than in-place dummy-text interpolators 
```
// OLD i18Next
t('some.annoyingly.deep.path.to.text1')
t('some.annoyingly.deep.path.to.text2')
t('some.annoyingly.deep.path.to.even.more.text')

// Becomes
tt = setNextTContext(t, 'some.annoyingly.deep.path.to')

tt('text1')
tt('text2')
tt('even.more.text')
```
