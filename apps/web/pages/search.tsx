import { Button } from 'ui'
import { useState } from 'react'

export default function SearchPage() {
  const [query, setQuery] = useState('')

  return (
    <div>
      <h1>Web</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <h2>{query}</h2>
      <Button />
    </div>
  )
}
