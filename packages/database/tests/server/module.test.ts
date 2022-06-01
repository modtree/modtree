import axios from 'axios'

describe('Test basic module fetching', () => {
  test('It should response the GET method', async () => {
    const res = await axios.get('http://localhost:8080/modules/CS1010S').then((res) => {
      const results = res.data.result
      console.log(results)
      expect(results).toBeDefined()
      return true
    })
    expect(res).toBeDefined()
  })
})
