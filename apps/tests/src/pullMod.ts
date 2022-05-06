import axios from 'axios'

const base = "http://localhost:5001/mod-tree/us-central1"

export function cloud(string: string): string {
  return `${base}/${string}`
}


const fn = 'pullMod'

axios.post(cloud(fn), { moduleCode: 'CS1010S' }).then((res) => {
  const data = res.data
  console.debug(data)
})
