const Sequencer = require('@jest/test-sequencer').default
// source: https://jestjs.io/docs/configuration#testsequencer-string
class CustomSequencer extends Sequencer {
  sort(tests) {
    const copyTests = Array.from(tests)
    /** put base test in front */
    const baseFirst = copyTests.filter((t) => t.path.endsWith('base.test.ts'))
    const baseless = copyTests.filter((t) => !t.path.endsWith('base.test.ts'))
    /** sort the rest alphabetically  */
    const alphabetical = baseless.sort((testA, testB) => (testA.path > testB.path ? 1 : -1))
    const testSequence = baseFirst.concat(alphabetical)
    return testSequence
  }
}
module.exports = CustomSequencer
