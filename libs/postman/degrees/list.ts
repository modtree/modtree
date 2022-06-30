import { postman } from '../postman'

postman.get('degrees/').then((res) => {
  const pretty = res.map((u: any) => ({
    id: u.id,
    title: u.title,
  }))
  console.debug(pretty)
})
