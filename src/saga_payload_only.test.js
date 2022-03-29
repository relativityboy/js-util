import { sagaPayloadOnly } from './saga_payload_only'

describe('sagaPayloadOnly', () => {
  it('curries a function without calling it', () => {
    const actionHandler = jest.fn()
    const curriedFn = sagaPayloadOnly(actionHandler)
    expect(typeof curriedFn).toEqual('function')
    expect(actionHandler).toHaveBeenCalledTimes(0)
  })
  it('calls curried function with payload of passed in action', () => {
    const action = { type:'action', payload:{foo:'bar'}}
    const actionHandler = jest.fn()
    const curriedFn = sagaPayloadOnly(actionHandler)
    expect(typeof curriedFn).toEqual('function')
    expect(actionHandler).toHaveBeenCalledTimes(0)
    curriedFn(action)
    expect(actionHandler).toHaveBeenCalledTimes(1)
    expect(actionHandler).toHaveBeenCalledWith(action.payload)
  })
})