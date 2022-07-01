import { exec } from '.'

test('basic echo', async () => {
  await exec('echo "hello"').then((res) => {
    expect(res.stdout).toBe('hello\n')
  })
})

test('error handling', async () => {
  await exec('___invalid_command___').then((res) => {
    const check = res.stderr.includes('___invalid_command___')
    expect(check).toBe(true)
  })
})
