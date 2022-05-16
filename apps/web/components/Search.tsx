import { Dispatch, SetStateAction, useState } from 'react'
import { Module } from 'database'

const Search = (props: {
  setQuery: Dispatch<SetStateAction<string>>
  setResults: Dispatch<SetStateAction<string[]>>
}) => {
  // the text that shows up in the search bar
  const [display, setDisplay] = useState('')
  async function handleQuery(value: string) {
    setDisplay(value)
    if (value.length === 0) {
      // empty queries are really slow
      props.setQuery('')
      props.setResults([])
      return
    }
    const upper = value.toUpperCase()
    const backend = process.env.NEXT_PUBLIC_BACKEND
    const url = `${backend}/modules/${upper}`
    console.debug('querying url:', url)
    fetch(url).then((res) => {
      res.json().then((json) => {
        const moduleList: Module[] = json.result
        props.setResults(moduleList.map((x) => x.moduleCode))
      })
    })
    props.setQuery(upper)
  }
  return (
    <div>
      <div className="text-gray-600">Search for a module:</div>
      <div className="flex flex-row">
        <input
          spellCheck={false}
          className="flex-1 rounded-md shadow-md py-1 px-2"
          value={display}
          onChange={(e) => handleQuery(e.target.value)}
        />
        <div className="w-2" />
        <button className="bg-blue-400 text-white py-1 px-2 rounded-md">
          do nothing
        </button>
      </div>
    </div>
  )
}

export default Search
