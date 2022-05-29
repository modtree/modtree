function parseMarkdown(markdownText: string) {
  if (!markdownText) {
    return ''
  }
  const htmlText = markdownText
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
    .replace(/`(.*)`/gim, '<code>$1</code>')
    .replace(/\*(.*)\*/gim, '<i>$1</i>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/\n$/gim, '<br />')
  return htmlText.trim()
}

export default function Parameter(props: Parameter) {
  return (
    <div className='border-t border-t-gray-300 mt-4 pt-4'>
      <div className='flex flex-row mb-2'>
        <div className='flex-1'>
          <code className='mr-3 font-semibold'>{props.name}</code>
          <span className='text-gray-600 text-sm'>{props.dataType}</span>
        </div>
        {props.required == true && <div className='text-yellow-600'>Required</div>}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: parseMarkdown(props.description) }}
      />
    </div>
  )
}
