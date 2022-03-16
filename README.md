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

### redux-saga

### generic 

**makeOnReady** - an on-ready queue in a single line, with data! - save yourself 20 lines of code and 80 lines of tests!
```
```
**setNextTContext** - to help with deep language paths. Simpler and more reliable than in-place dummy-text interpolators 
```
// i18Next
t('some.annoyingly.deep.path.to.text1')
t('some.annoyingly.deep.path.to.text2')
t('some.annoyingly.deep.path.to.even.more.text')

// Becomes
tt = setNextTContext(t, 'some.annoyingly.deep.path.to')

tt('text1')
tt('text2')
tt('even.more.text')
```