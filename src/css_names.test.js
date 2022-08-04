import { cssNames } from './css_names'

describe('cssNames', () => {

    it('returns an array', () => {
        const cName = cssNames()
        expect(cName.constructor).toBe(Array)
    })

    it(`toString returns result of join(' ') operation`, () => {
        const cName = cssNames('a', 'b')
        expect(cName.toString()).toBe('a b')
    })
})