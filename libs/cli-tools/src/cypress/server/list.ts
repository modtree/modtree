import { CypressRun } from '@modtree/types'
import { In, Repository } from 'typeorm'
import type { State } from '../types'

export const list = async (
  repo: Repository<CypressRun>,
  files: string[],
  commits: string[]
) => {
  return repo.findBy({ gitHash: In(commits), file: In(files) }).then((res) => {
    return files.map((file) => {
      let state: State = 'nores'
      let shortHash = '        '
      const data = res.filter((r) => r.file === file)
      // modify the state and shortHash if data is found
      if (data.length > 0) {
        const latest = data.sort((a, b) => b.timestamp - a.timestamp)[0]
        shortHash = latest.gitHash.slice(0, 8)
        state = latest.pass ? 'pass' : 'fail'
      }
      return { state, file, shortHash }
    })
  })
}
