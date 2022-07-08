import emoji from './emoji.json'

const log = console.log

const needs = {
  first: {
    result: 'failure',
    outputs: {},
  },
  second: {
    result: 'success',
    outputs: {},
  },
}

const results = Object.entries(needs)

results.forEach(([key, value]) => {
  const e = emoji[value.result]
  log(e, key)
})
