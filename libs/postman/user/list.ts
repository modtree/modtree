import { postman } from '../postman'

postman.get('user/list').then((res) => {
  const pretty = res.map((u: any) => ({
    id: u.id,
    user: u.username,
  }))
  console.log(pretty)
})
