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

    it(`add() appends multiple strings`, () => {
        const cName = cssNames('a', 'b')
        cName.add('c', 'd', 'e')
        expect(cName.toString()).toBe('a b c d e')
    })
    it(`push() still works`, () => {
        const cName = cssNames('a', 'b')
        cName.push('c', 'd', 'e')
        expect(cName.toString()).toBe('a b c d e')
    })
})