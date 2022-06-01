import axios from 'axios'

describe('Test basic module-condensed fetching', () => {
  test('It should summary of CS1010S', async () => {
    const res = await axios
      .get('http://localhost:8080/modules/CS1010S')
      .then((res) => {
        const results = res.data.result
        expect(results).toHaveLength(1)
        expect(results[0].moduleCode).toStrictEqual('CS1010S')
        expect(results[0].moduleLevel).toStrictEqual(1010)
        expect(results[0].title).toStrictEqual('Programming Methodology')
        return true
      })
    expect(res).toBeDefined()
  })
})
