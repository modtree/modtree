export function generateSchema(sampleResponse: any): SchemaItem {
  let schema = {}

  // handle non objects separately
  if (typeof sampleResponse !== 'object')
    return {
      type: typeof sampleResponse,
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
