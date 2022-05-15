import { setup } from '../setup'
import { endpoint } from '../../src/data-source'
import { Degree, Module } from '../../src/entity'

beforeAll(async () => {
  await setup()
})

jest.setTimeout(5000)

test('Degree.save() is successful', async () => {
  // Save the degree
  const props = {
    moduleCodes: [
      'CS1101S',
      'CS1231S',
      'CS2030S',
      'CS2040S',
      'CS2100',
      'CS2103T',
      'CS2106',
      'CS2109S',
      'CS3230',
    ],
    title: 'Computer Science',
  }
  await Degree.save(props)

  const degree = await endpoint(() => Degree.getOne(props.title))
  expect(degree).toBeDefined()
  if (!degree)
    return

  const modulesRequired = degree.modulesRequired

  // defined
  expect(modulesRequired).toBeDefined()
  if (!modulesRequired)
    return

  // set equality: A = B if A subset of B and B subset of A
  const moduleCodes = modulesRequired.map((one: Module) => one.moduleCode)
  expect(props.moduleCodes).toEqual(expect.arrayContaining(moduleCodes))
  expect(moduleCodes).toEqual(expect.arrayContaining(props.moduleCodes))
})
