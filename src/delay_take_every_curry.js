export const delayTakeEveryCurry = (takeLatest, delay) => (action, fn, miliseconds=300) => {
  function* watchInput(payload) {
    yield delay(miliseconds)
    yield fn(payload)
  }
  return takeLatest(action, watchInput)
}