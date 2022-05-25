import { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function () {
  const input = useRef(null)
  const {locale} = useRouter()

  useEffect(() => {
    const inputs = ['input', 'select', 'button', 'textarea']

    const down = (e) => {
      if (
        document.activeElement &&
        inputs.indexOf(document.activeElement.tagName.toLowerCase() !== -1)
      ) {
        if (e.key === '/') {
          e.preventDefault()
          input.current?.focus()
        }
      }
    }

    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (window.docsearch) {
      window.docsearch({
        apiKey: 'd966b09842ceb0b6630d94eeeefc8ae3',
        indexName: 'vercel_swr',
        inputSelector: 'input#algolia-doc-search',
        algoliaOptions: { 'facetFilters': locale === 'zh-CN' ? ["tags:cn"] : ["tags:en"] }
      })
    }
  }, [locale])

  return <div className="relative w-full md:w-64 mr-2 docs-search">
    <input
      id="algolia-doc-search"
      className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      type="search"
      placeholder='Search ("/" to focus)'
      ref={input}
    />
  </div>
}
