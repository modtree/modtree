export default function Parameter(props: ParameterProps) {
  return (
    <div>
      <div style={header}>
        <div>
          <code style={name}>{props.name}</code>
          <span>{props.type}</span>
        </div>
        {props.required == "true" && <div style={required}>Required</div>}
      </div>
      <div>{props.children}</div>
    </div>
  )
}

const header: any = {
  margin: '8px 0',
  padding: '8px 0',
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: '1px solid #aaa'
}

const name: any = {
  fontWeight: 'bold',
  marginRight: '8px'
};

const required: any = {
  color: 'red'
}
