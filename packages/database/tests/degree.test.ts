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

test('Degree.insertModules', async () => {
  // 1. Save degree
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

  const degree = await container(() =>
    DegreeRepository.findOne({
      where: {
        title: props.title,
      }, relations: ['modules']
    })
  )

  expect(degree).toBeDefined()
  if (!degree) return

  // 2. Add modules to degree
  const newModuleCodes = ['MA1521', 'MA2001', 'ST2334']
  await degree.insertModules(newModuleCodes)

  // 3. Search for degree again
  const degrees = await container(() =>
    DegreeRepository.find({
      where: {
        title: props.title,
      }, relations: ['modules']
    })
  )
  expect(degrees).toBeDefined()
  if (!degrees) return

  console.log(degrees)
  // Inserting modules to the degree should not create a new Degree
  expect(degrees.length).toEqual(1)

  // 4. Confirm that the insert worked as expected
  const combinedModuleCodes = props.moduleCodes.concat(newModuleCodes)

  const modules = degrees[0].modules

  // set equality: A = B if A subset of B and B subset of A
  const moduleCodes = modules.map((one: Module) => one.moduleCode)
  expect(combinedModuleCodes).toEqual(expect.arrayContaining(moduleCodes))
  expect(moduleCodes).toEqual(expect.arrayContaining(combinedModuleCodes))
})
