export function generateSchema(sampleResponse: any) {
  let schema = {}

  // handle string separately
  // because Object.entries makes string be treated as
  // array of chars
  if (typeof sampleResponse === 'string')
    return {
      type: 'string',
    }

  // Assume for now we can only have arrays on
  // the first layer keys of API response
  Object.entries(sampleResponse).forEach(([key, value]) => {
    if (value instanceof Array) {
      let items
      // assume that array is not empty
      if (value[0] instanceof Object) {
        items = {
          type: 'object',
          properties: generateSchema(value[0]),
        }
      } else {
        items = generateSchema(value[0])
      }
      schema[key] = {
        type: 'array',
        items,
      }
    } else if (value instanceof Object) {
      schema[key] = {
        type: 'object',
        properties: generateSchema(value),
      }
    } else {
      schema[key] = {
        type: typeof value,
      }
    }
  })
  return schema
}
