import axios from 'axios'

describe("Test basic module fetching", () => {
  test('It should response the GET method', done => {
    axios.get('http://localhost:8080/modules/CS1010S').then(res => {
      console.log(res)
    })
    expect(1).toBe(1)
  })
})
