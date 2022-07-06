test('works with const', () => {
  const before = 'a/:degreeId/b/:degreeId/c'
  const after = before.replace(/:degreeId/g, '___')
  expect(after).toEqual('a/___/b/___/c')
})

test('works with let', () => {
  let url = 'a/:degreeId/b/:degreeId/c'
  url = url.replace(/:degreeId/g, '___')
  expect(url).toEqual('a/___/b/___/c')
})
