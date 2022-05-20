import { container, endpoint } from '../src/data-source'
import { setup } from './setup'
import { Degree, Module } from '../src/entity'
import { DegreeRepository } from '../src/repository'
import { Init } from '../types/modtree'
import { init } from './init'

beforeEach(async () => {
  await setup()
})

jest.setTimeout(5000)

test('Module should be defined', () => {
  expect(Module).toBeDefined()
})

test('Degree.initialize() is successful', async () => {
  const props: Init.DegreeProps = init.degree1
  // write the degree to database
  await container(() => DegreeRepository.initialize(props))

  // retrieve that degree again
  const possiblyNull: Degree | void = await endpoint(() =>
    container(() =>
      DegreeRepository.findOne({
        where: {
          title: props.title,
        },
        relations: ['modules'],
      })
    )
  )
  // expect degree to be not null, not undefined
  expect(possiblyNull).toBeDefined()
  if (!possiblyNull) return

  const degree: Degree = possiblyNull
  const modules: Module[] = degree.modules

  expect(modules).toBeDefined()
  if (!modules) return

  const moduleCodes = modules.map((m) => m.moduleCode)
  // match relation's module codes to init props' modules codes
  expect(moduleCodes.sort()).toStrictEqual(props.moduleCodes.sort())
  expect(moduleCodes.length).toStrictEqual(9)
})

test('Degree.insertModules', async () => {
  const props = init.degree1
  // 1. write the degree to database
  await container(() => DegreeRepository.initialize(props))

  const first = await container(() =>
    DegreeRepository.findOne({
      where: {
        title: props.title,
      },
      relations: ['modules'],
    })
  )

  expect(first).toBeDefined()
  if (!first) return

  // 2. Add modules to degree, and write the result to database
  const newModuleCodes = ['MA1521', 'MA2001', 'ST2334']
  await DegreeRepository.insertModules(first, newModuleCodes)

  // 3. Retrieve the degree from database
  const second = await endpoint(() =>
    container(() =>
      DegreeRepository.find({
        where: {
          title: props.title,
        },
        relations: ['modules'],
      })
    )
  )
  expect(second).toBeDefined()
  if (!second) return

  // Inserting modules to the degree should not create a new Degree
  expect(second.length).toEqual(1)

  // 4. Confirm that the insert worked as expected
  const combinedModuleCodes = props.moduleCodes.concat(newModuleCodes)

  const modules = second[0].modules
  const moduleCodes = modules.map((m: Module) => m.moduleCode)
  // match retrieved module codes to
  // init props' module codes + added module codes
  expect(moduleCodes.sort()).toStrictEqual(combinedModuleCodes.sort())
  expect(moduleCodes.length).toStrictEqual(12)
})
