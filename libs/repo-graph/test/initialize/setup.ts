import { t, init, Repo } from '@modtree/test-env'

export async function graphInitializeSetup() {
  return Promise.all([
    Repo.User.initialize({
      ...init.user1,
      modulesDone: ['MA2001'],
      modulesDoing: ['MA2219'],
    }),
    Repo.Degree.initialize({
      moduleCodes: ['CS1101S', 'MA2001'],
      title: 'Test Degree',
    }),
  ]).then(([user, degree]) => {
    t.user = user
    t.degree = degree
  })
}
