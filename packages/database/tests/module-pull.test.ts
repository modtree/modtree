import { module } from '../src/functions/module'
import { moduleCondensed } from '../src/functions/moduleCondensed'
import { endpoint } from '../src/data-source'
import { setup } from './setup'
import { Module } from '../src/entity'
import { remove } from '../src/sql'

beforeAll(async () => {
  await setup()
})

/* ===================================================================
 *   PULLS
 * ===================================================================
 */

jest.setTimeout(12000)
test('module.pull', async () => {
  await remove.tables(['degree_modules_required_module', 'module'])
  // check that table removal was successfull
  const mc = await endpoint(moduleCondensed.getCodes)
  const m = await endpoint(module.getCodes)
  expect(mc).toBeDefined()
  expect(m).toBeDefined()
  if (!mc || !m) {
    return
  }
  expect(m.size).toStrictEqual(0)

  // wait for both to pull
  const pm: void | Module[] = await endpoint(module.pull)

  // check pull validity
  expect(pm).toBeDefined()
  if (!pm) {
    return
  }
  pm.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  expect(pm.length).toBeGreaterThan(10)
  expect(pm).toBeInstanceOf(Array)

  if (!pm) {
    return
  }

  /* make sure every element is a valid ModuleCondensed */
  pm.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  const s = new Set(pm.map(x => x.moduleCode))
  expect(s.size).toBe(pm.length)
  expect(s.size).toStrictEqual(mc.size)
})

