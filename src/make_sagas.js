import { sagaPayloadOnly } from './saga_payload_only'
import { delayTakeEveryCurry } from "./delay_take_every_curry"

/**
 * Allows declaration of sagas as a simple mapped object, with automatic assignment of
 * saga to takeEvery & takeLatest and delayTakeEvery (a debounce).
 *
 * To use first curry with redux-saga's takeEvery, takeLatest, and delay
 * @param takeEveryFn
 * @param takeLatestFn
 * @param delayFn
 * @returns {function({takeEvery?: *, takeLatest?: *, delayTakeEvery?: *, custom?: *}): *[]}
 */
export const makeSagas = (takeEveryFn, takeLatestFn, delayFn=false) => {
  const delayTakeEveryFn = delayFn ? delayTakeEveryCurry : takeEveryFn

  const assign = (takeFn, sagas) => Object.keys(sagas).map((actn) => takeFn(actn, sagaPayloadOnly(sagas[actn])))

  return ({ takeEvery={}, takeLatest={}, delayTakeEvery={}, custom=[]}) => {
    return [...assign(takeEveryFn, takeEvery), ...assign(takeLatestFn, takeLatest), ...assign(delayTakeEveryFn, delayTakeEvery), ...custom]
  }
}