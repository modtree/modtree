import { postman } from '../postman'

postman.get('graph/list').then((res) => {
  const pretty = res.map((g: any) => ({
    id: g.id,
    user: g.user,
    degree: g.degree,
  }))
  console.log(pretty)
})
