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
    <div>
      <div style={header}>
        <div>
          <code style={name}>{props.name}</code>
          <span>{props.dataType}</span>
        </div>
        {props.required == true && <div style={required}>Required</div>}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: parseMarkdown(props.description) }}
      />
    </div>
  )
}

const header: any = {
  margin: '8px 0',
  padding: '8px 0',
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: '1px solid #aaa',
}

const name: any = {
  fontWeight: 'bold',
  marginRight: '8px',
}

const required: any = {
  color: 'red',
}
