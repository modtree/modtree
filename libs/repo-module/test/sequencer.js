const Sequencer = require('@jest/test-sequencer').default

class CustomSequencer extends Sequencer {
  /**
   * Sort test to determine order of execution
   * Sorting is applied after sharding
   */
  sort(tests) {
    const copyTests = Array.from(tests)
    const sorted = copyTests.sort((testA, testB) =>
      testA.path > testB.path ? 1 : -1
    )
    const initialize = copyTests.filter((x) => x.path.includes('initialize'))
    const others = copyTests.filter((x) => !x.path.includes('initialize'))
    return [...initialize, ...others]
  }
}

module.exports = CustomSequencer
