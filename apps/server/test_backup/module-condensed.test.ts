import { server } from '@modtree/test-env'

/**
 * try a specific full module search
 * this should return an Array with just one result
 */
test('It should get a summary of MA2101S', async () => {
  expect.assertions(4)
  await server.get('modules/find/MA2101S').then((res) => {
    const results = res.data
    expect(results).toHaveLength(1)
    expect(results[0].moduleCode).toStrictEqual('MA2101S')
    expect(results[0].moduleLevel).toStrictEqual(2101)
    expect(results[0].title).toStrictEqual('Linear Algebra II (S)')
  })
})

/**
 * try a fuzzy search
 * this should return an Array with several results
 */
test('It should get a search results of CS', async () => {
  expect.assertions(4)
  await server.get('modules/find/CS').then((res) => {
    const results: any[] = res.data
    expect(results.length).toBeGreaterThan(10)
    const x = results[0]
    expect(typeof x.title).toStrictEqual('string')
    expect(typeof x.moduleCode).toStrictEqual('string')
    expect(typeof x.moduleLevel).toStrictEqual('number')
  })
})
