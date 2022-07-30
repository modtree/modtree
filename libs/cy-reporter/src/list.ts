import './env'
import { init, db } from './data-source'
import { Repository } from 'typeorm'
import { CypressRun } from './entity'

const main = async (repo: Repository<CypressRun>) => {
  return repo.find().then((res) => {
    console.log(res, res.length)
  })
}

// run main under an initialized connection
init.then((repo) => main(repo)).then(() => db.destroy())
