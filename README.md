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

**actionKeyReducer** - Allows you to create a reducer-object where the keys are the action.types 
Much faster and less error prone than `if/else` or `switch` blocks

Example with three actions:
```
const updateUsername = (state, userName) => (
        {...state, user: {...state.user, userName}}
    )

const reducers = {
    [ACTN_LOGIN]: (state, user) => ({...state, user}),
    [ACTN_LOGOUT]: (state) => ({...state, user: false}),
    [ACTN_UPDATE_USERNAME]: updateUsername
}

export default actionKeyReducer(reducers, true)
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