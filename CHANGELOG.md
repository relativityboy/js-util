# Change log

## V 0.9.0
* added `makeActionCreatorsAndReducer()`. Takes the same args as `actionKeyReducer`. 
Returns `{actions, reducer}`. Where actions is an object of action creators, keyed by their type.

## V 0.8.3
* added cssNames (makes an array where toString() === .join(' '))
* improved tests for delayTakeEveryCurry

## V 0.8.1
* added type argument errors and tests for `action` - redux helper

## V 0.8.0
* added `setNextTContext` - i18Next helper for deep language text paths

## V 0.7.0
* added `makeOnReady` - a simple on-ready helper
