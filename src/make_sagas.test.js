import { makeSagas } from './make_sagas'
import * as payloadOnlyMock from './saga_payload_only'
import * as delayMock from './delay_take_every_curry'

// { sagaPayloadOnly }
// { delayTakeEveryCurry }
describe('todo - makeSagas',() => {
  let takeEveryFn, takeLatestFn, delayFn = null
});