import { createFlowEdge } from './get-edges'

it('source is the first parameter', () => {
  const res = createFlowEdge('CS1010', 'MA2001')
  expect(res.source).toBe('CS1010')
})

it('target is the second parameter', () => {
  const res = createFlowEdge('CS1010', 'MA2001')
  expect(res.target).toBe('MA2001')
})

it('ID is source-target', () => {
  const res = createFlowEdge('CS1010', 'MA2001')
  expect(res.id).toBe('CS1010-MA2001')
})
