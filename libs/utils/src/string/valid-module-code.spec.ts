import { validModuleCode } from '.'

const correct: [string, boolean][] = [
  ['cs1010s', false],
  ['', false],
  ['NOT_VALID', false],
  ['AC5001', true],
  ['AR3101A', true],
  ['LC5204AV', true],
  ['LL5009GRSI', true],
  ['LC6009GRSII', true],
  ['ACC1701', true],
  ['ACC1701X', true],
  ['ASP1201CH', true],
  ['DMB1201ACC', true],
  ['DMR1201GEQA', true],
  ['GESS1000', true],
  ['GESS1000T', true],
  ['UTOA2001EL', true],
  ['DMA1402L01', true],
]

test.each(correct)('%s is valid: %s', (received, expected) => {
  expect(validModuleCode(received)).toBe(expected)
})

// import allCodes from './module-codes.json'
//
// const generateUniqueRegex = () => {
//   const regex: RegExp[] = [
//     // start with 2
//     /^[A-Z]{2}[0-9]{4}$/,
//     /^[A-Z]{2}[0-9]{4}[A-Z]$/,
//     /^[A-Z]{2}[0-9]{4}[A-Z]{2}$/,
//     /^[A-Z]{2}[0-9]{4}[A-Z]{4}$/,
//     /^[A-Z]{2}[0-9]{4}[A-Z]{5}$/,
//     // start with 3
//     /^[A-Z]{3}[0-9]{4}$/,
//     /^[A-Z]{3}[0-9]{4}[A-Z]$/,
//     /^[A-Z]{3}[0-9]{4}[A-Z]{2}$/,
//     /^[A-Z]{3}[0-9]{4}[A-Z]{3}$/,
//     /^[A-Z]{3}[0-9]{4}[A-Z]{4}$/,
//     // start with 4
//     /^[A-Z]{4}[0-9]{4}$/,
//     /^[A-Z]{4}[0-9]{4}[A-Z]$/,
//     /^[A-Z]{4}[0-9]{4}[A-Z]{2}$/,
//     // memes
//     /^[A-Z]{3}[0-9]{4}[A-Z][0-9]{2}$/,
//   ]
//   const results: number[] = regex.map(() => 0)
//   const firsts: string[] = regex.map(() => '')
//   const outside: string[] = []
//   allCodes.forEach((code) => {
//     for (let i = 0; i < regex.length; i++) {
//       if (code.match(regex[i])) {
//         results[i] += 1
//         if (firsts[i] === '') firsts[i] = code
//         return
//       }
//     }
//     outside.push(code)
//   })
//   console.log(
//     results.reduce((a, b) => a + b, 0),
//     '/',
//     allCodes.length
//   )
//   console.log('firsts', firsts)
//   console.log('outside', outside)
// }
