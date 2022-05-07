import axios from 'axios'

const base = 'http://localhost:5001/mod-tree/us-central1'

export function cloud(string: string): string {
  return `${base}/${string}`
}

const fn = 'getMod'

axios.post(cloud(fn), { moduleCode: 'CS2030S' }).then((res) => {
  const data = res.data
  console.log(data)
  console.debug(JSON.stringify(data, null, 2))
})
