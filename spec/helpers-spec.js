/* @flow */

import * as Helpers from '../lib/helpers'

describe('Helpers', function() {
  describe('locToPoint', function() {
    it('converts the babel loc item into Point-compatible Array', function() {
      expect(Helpers.locToPoint({ line: 1, column: 0 })).toEqual([0, 0])
      expect(Helpers.locToPoint({ line: 5, column: 5 })).toEqual([4, 5])
    })
  })
  describe('locToRange', function() {
    it('converts the babel loc into Range-compatible Array', function() {
      expect(Helpers.locToRange({ start: { line: 1, column: 5 }, end: { line: 10, column: 0 } })).toEqual([[0, 5], [9, 0]])
      expect(Helpers.locToRange({ start: { line: 20, column: 3 }, end: { line: 25, column: 10 } })).toEqual([[19, 3], [24, 10]])
    })
  })
  describe('processDeclaration', function() {
    it('resolves the name of npm modules in declarations', function() {
      expect(Helpers.processDeclaration([{
        position: { start: { line: 1, column: 5 }, end: { line: 10, column: 0 } },
        source: {
          filePath: 'resolve',
        },
      }], __filename)).toEqual([{
        range: [[0, 5], [9, 0]],
        source: {
          filePath: require.resolve('resolve'),
          position: null,
        },
      }])
    })
    it('skips the entry that cannot be resolved', function() {
      expect(Helpers.processDeclaration([{
        position: { start: { line: 1, column: 5 }, end: { line: 10, column: 0 } },
        source: {
          filePath: 'some-unknown-dependency',
        },
      }], __filename)).toEqual([])
    })
    it('skips core requires', function() {
      expect(Helpers.processDeclaration([{
        position: { start: { line: 1, column: 5 }, end: { line: 10, column: 0 } },
        source: {
          filePath: 'fs',
        },
      }], __filename)).toEqual([])
    })
  })
})
