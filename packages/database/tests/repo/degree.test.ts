import { AppDataSource, container, endpoint } from '../../src/data-source'
import { setup } from '../setup'
import { ModuleCondensed } from '../../src/entity-repo/ModuleCondensed'
import { ModuleCondensedRepository } from '../../src/repository/ModuleCondensed'
import { DegreeRepository } from '../../src/repository/Degree'
import { remove } from '../../src/sql'
import { Module } from '../../src/entity-repo/Module'
import { Degree } from '../../src/entity-repo/Degree'

const lowerBound = 6000

let total = 0

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
  await container(async () => {
    await DegreeRepository.initialize(props)
  })

  const degree = await endpoint(() => DegreeRepository.getOne(props.title))
  expect(degree).toBeDefined()
  if (!degree) return

  const modulesRequired = degree.modulesRequired

  // defined
  expect(modulesRequired).toBeDefined()
  if (!modulesRequired) return

  // set equality: A = B if A subset of B and B subset of A
  const moduleCodes = modulesRequired.map((one: Module) => one.moduleCode)
  expect(props.moduleCodes).toEqual(expect.arrayContaining(moduleCodes))
  expect(moduleCodes).toEqual(expect.arrayContaining(props.moduleCodes))
})

test('Degree.get() is successful', async () => {
  // Save the degrees
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
  await DegreeRepository.initialize(props)

  const props2 = {
    moduleCodes: [
      'MA1100',
      'MA2001',
      'MA2002',
      'MA2101',
      'MA2104',
      'MA2108',
      'ST2131',
      'MA4198',
    ],
    title: 'Mathematics',
  }
  await DegreeRepository.initialize(props2)

  const degrees = await endpoint(() => DegreeRepository.get())
  expect(degrees).toBeDefined()
  if (!degrees) return

  const degreeNames = degrees.map((one: Degree) => one.title)
  const names = ['Computer Science', 'Mathematics']
  expect(degreeNames).toEqual(expect.arrayContaining(names))
  expect(names).toEqual(expect.arrayContaining(degreeNames))
})
