import { AppDataSource, container } from './data-source'
import { Module } from './entity/Module'
// import { AppDataSource } from './data-source'

async function main() {
  await container(async () => {
    const m = new Module()
    m.faculty = 'Computing'
    await AppDataSource.manager.save(m)
    // await repo.save(m)
  })
}

main()
