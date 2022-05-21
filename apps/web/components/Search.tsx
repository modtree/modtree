import { Dispatch, SetStateAction, useState } from 'react'
import { ModuleCondensed } from 'database'

const Search = (props: {
  setResults: Dispatch<SetStateAction<ModuleCondensed[]>>
}) => {
  // the text that shows up in the search bar
  const [display, setDisplay] = useState('')
  async function handleQuery(value: string) {
    setDisplay(value.toUpperCase())
    if (value.length === 0) {
      // empty queries are really slow
      props.setResults([])
      return
    }
    const upper = value.toUpperCase()
    const backend = process.env.NEXT_PUBLIC_BACKEND
    const url = `${backend}/modules/${upper}`
    console.debug('querying url:', url)
    fetch(url).then((res) => {
      res.json().then((json) => {
        const moduleList: ModuleCondensed[] = json.result
        props.setResults(moduleList)
      })
    })
  }
  return (
    <div>
      <div className="text-gray-600 mb-2">Search for a module:</div>
      <div className="flex flex-row">
        <input
          spellCheck={false}
          className="flex-1 rounded-md shadow-md py-2 px-3 font-medium"
          value={display}
          onChange={(e) => handleQuery(e.target.value)}
        />
        <div className="w-2" />
      </div>
    </div>
  )
}

export default Search
