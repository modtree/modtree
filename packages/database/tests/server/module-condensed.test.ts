import axios from 'axios'

test('It should get a summary of CS1010S', async () => {
  const res = await axios
    .get('http://localhost:8080/modules/CS1010S')
    .then((res) => {
      const results = res.data
      expect(results).toHaveLength(1)
      expect(results[0].moduleCode).toStrictEqual('CS1010S')
      expect(results[0].moduleLevel).toStrictEqual(1010)
      expect(results[0].title).toStrictEqual('Programming Methodology')
      return true
    })
  expect(res).toBeDefined()
})

test('It should get a search results of CS', async () => {
  const res = await axios
    .get('http://localhost:8080/modules/CS')
    .then((res) => {
      const results: any[] = res.data
      expect(results.length).toBeGreaterThan(10)
      results.forEach(x => {
        expect(typeof x.title).toStrictEqual('string')
        expect(typeof x.moduleCode).toStrictEqual('string')
        expect(typeof x.moduleLevel).toStrictEqual('number')
      })
      return true
    })
  expect(res).toBeDefined()
})
