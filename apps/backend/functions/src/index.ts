import { https } from 'firebase-functions'

// database
import { AppDataSource } from './data-source'
import { User } from './entities/User'

export const addUser = https.onRequest(async (req, res) => {
  // info
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const age = req.body.age;

  // create user
  const user = new User()
  user.firstName = firstName;
  user.lastName = lastName;
  user.age = age;

  // save user to DB
  await AppDataSource.initialize().then(async () => {
    await AppDataSource.manager.save(user);
    console.log('Saved a new user with id: ' + user.id)

    // list all users in DB
    console.log('Loading users from the database...')
    const users = await AppDataSource.manager.find(User)
    console.log('Loaded users: ', users)
  });

  res.json({
    message: "Successful addUser"
  });
});
