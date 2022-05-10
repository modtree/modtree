import { listModuleCondensed, listModules } from '../../modules'
import { log } from '../../cli'
// import { db } from '../../data-source'
import { Module as NM } from '../../../types/nusmods'
// import { Module } from '../../entity'
import axios from 'axios'
import { Agent } from 'https'
import { AppDataSource, db } from '../../data-source'
import { Module } from '../../entity'
import { constructModule } from '../../nusmods'

async function main() {
  const client = axios.create({
    baseURL: 'https://api.nusmods.com/v2/2021-2022/modules/',
    timeout: 1000000,
    maxRedirects: 10,
    httpsAgent: new Agent({ keepAlive: true }),
  })
  const toPull = await listModuleCondensed()
  const already = await listModules()
  const _arr = Array.from(toPull).filter((x) => !already.has(x))
  const arr = _arr.slice(0, 10)
  // const repo = AppDataSource.getRepository(Module)
  const q = []
  const w = []
  let done = 0
  for (let i = 0; i < arr.length; i++) {
    q.push(
      client
        .get(`${arr[i]}.json`)
        .then((res) => {
          const n: NM = res.data
          const m = new Module()
          constructModule(n, m)
          done += 1
          console.log(done, n.moduleCode)
          w.push(m)
        })
        .catch(() => {
          console.log('continuing...')
          // await Promise.allSettled(w)
        })
    )
    log.yellow(i.toString())
  }
  await Promise.allSettled(q)
  await db.open()
  await AppDataSource.manager.save(w)
  await db.close()
  console.log(w)
}

main()
