import { postman } from '../postman'

postman.get('degree/list').then((res) => {
  const pretty = res.map((u: any) => ({
    id: u.id,
    title: u.title,
  }))
  console.log(pretty)
})
