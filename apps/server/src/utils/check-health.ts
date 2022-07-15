import { Api } from '@modtree/repos'

export function checkhealth(api: Api) {
  const repos = [
    api.moduleRepo,
    api.moduleCondensedRepo,
    api.moduleFullRepo,
    api.userRepo,
    api.degreeRepo,
    api.graphRepo,
  ]
  Promise.all(repos.map((r) => r.count())).then((results) => {
    const names = ['Modules', 'Condensed', 'Full', 'Users', 'Degrees', 'Graphs']
    results.forEach((result, i) => {
      console.debug(names[i], result)
      if (names[i] === 'Users' && result < 3) {
        api.frontendSetup()
      }
    })
  })
}
