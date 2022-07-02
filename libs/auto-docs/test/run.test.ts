import '@modtree/test-env/jest'
import { routes } from '../src/routes'
import { postman } from '../src/postman'
import fs from 'fs'
import { join } from 'path'

jest.setTimeout(60000)

describe('samples', () => {
  const all: any[] = []

  test.each(routes)('%p %p', async (method, route, routeInfo) => {
    // unpack data
    const url = routeInfo.url
    const params = routeInfo.params

    // make request
    const res = await postman.send(method, url, { params })

    // truncate response data if necessary
    let response
    if (Array.isArray(res.data) && res.data.length > 3) {
      // if the response is an array, only give at most 3 entries
      response = [res.data[0], res.data[1], res.data[2]]
    } else {
      // otherwise just leave it
      response = res.data
    }

    // transform data
    const data = {
      method: res.config.method,
      url: res.config.url,
      res: response,
    }

    all.push(data)

    expect(1).toEqual(1)
  })

  test('write to file', () => {
    const rootDir = join(__dirname, '../../..')
    const json = JSON.stringify(all, null, 2)
    fs.writeFileSync(join(rootDir, 'references/api.json'), json)

    expect(1).toEqual(1)
  })
})
