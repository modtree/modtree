import { AppDataSource } from './data-source'
import { User, Module } from './entity'

export const addUser = () => {
  AppDataSource.initialize()
    .then(async () => {
      console.log('Inserting a new user into the database...')
      const user = new User()
      user.firstName = 'Timber'
      user.lastName = 'Saw'
      user.age = 25
      await AppDataSource.manager.save(user)
      console.log('Saved a new user with id: ' + user.id)

      console.log('Loading users from the database...')
      const users = await AppDataSource.manager.find(User)
      console.log('Loaded users: ', users)

      console.log(
        'Here you can setup and run express / fastify / any other framework.'
      )
    })
    .catch((error) => console.log(error))
  return
}

export const addModule = () => {
  AppDataSource.initialize()
    .then(async () => {
      console.log('Inserting a new module into the database...')
      const module = new Module()
      const repo = AppDataSource.getRepository(Module)
      await repo.save(module)
      console.log('Saved a new module with id: ' + module.id)
    })
    .catch((error) => console.log(error))
  return
}
