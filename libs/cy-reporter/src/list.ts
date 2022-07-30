import './env'
import { init } from './sender'

init.then((repo) => {
  repo.find().then((res) => {
    console.log(res)
  })
})
