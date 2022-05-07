import axios from 'axios'

const base = 'http://localhost:5001/mod-tree/us-central1'

export function cloud(string: string): string {
  return `${base}/${string}`
}

const fn = 'initDegree'

axios.post(cloud(fn), { please: 'yes' }).then((res) => {
  const data = res.data
  console.debug(data)
})
