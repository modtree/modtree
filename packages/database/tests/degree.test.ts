import { container, endpoint } from '../src/data-source'
import { setup } from './setup'
import { DegreeRepository } from '../src/repository/Degree'
import { Module } from '../src/entity/Module'

beforeAll(async () => {
  await setup()
})

jest.setTimeout(5000)

test('Degree.initialize() is successful', async () => {
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
  await container(async () => {
    await DegreeRepository.initialize(props)
  })

  const degree = await endpoint(() =>
    DegreeRepository.findOne({
      where: {
        title: props.title,
      }, relations: ['modules']
    })
  )
  expect(degree).toBeDefined()
  if (!degree) return

  const modules = degree.modules

  // defined
  expect(modules).toBeDefined()
  if (!modules) return

  // set equality: A = B if A subset of B and B subset of A
  const moduleCodes = modules.map((one: Module) => one.moduleCode)
  expect(props.moduleCodes).toEqual(expect.arrayContaining(moduleCodes))
  expect(moduleCodes).toEqual(expect.arrayContaining(props.moduleCodes))
})
