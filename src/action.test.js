import { action } from "./action";

describe('action', () => {
  it('returns an object like {type,payload} with corresponding values ', () => {
    const actn = action('ACTN_SOME_TYPE', {'A':"RANDOM PAYLOAD"})
    expect(actn.hasOwnProperty('type')).toBeTruthy()
    expect(actn.hasOwnProperty('payload')).toBeTruthy()
    expect(actn.type).toEqual('ACTN_SOME_TYPE')
    expect(actn.payload).toStrictEqual({'A':"RANDOM PAYLOAD"})
  })
  it(`has typeof payload =='undefined' if payload argument missing`, () => {
    const actn = action('ACTN_SOME_TYPE', )
    expect(actn.hasOwnProperty('type')).toBeTruthy()
    expect(actn.hasOwnProperty('payload')).toBeTruthy()
    expect(typeof actn.payload).toEqual('undefined')
  })
  it('Errors if type not passed in, or not string', () => {
    expect(() => {
      action()
    }).toThrow(`action - first argument (action type) is 'undefined' must be string`)

    expect(() => {
      action({chaos:'monkey'})
    }).toThrow(`action - first argument (action type) is 'object' must be string`)
  })
})