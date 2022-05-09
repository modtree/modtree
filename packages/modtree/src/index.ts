import { AppDataSource } from './data-source'
import { User } from './entities/User'

AppDataSource.initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...')
    const user = new User()
    user.firstName = 'Khang'
    user.lastName = 'Nguyen'
    user.age = 25
    // user.comment = "hello world"
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
