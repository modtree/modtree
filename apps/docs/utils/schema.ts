/**
 * Generates a schema given a sample response.
 * Assumes that there are no nested arrays.
 * Assumes that arrays have at least one element (so that type can be inferred)
 *
 * @params {SampleResponse} sampleResponse
 */
export function generateSchema(sampleResponse: SampleResponse): SchemaItem {
  return helper(sampleResponse)
}

/**
 * Helper function for generateSchema
 *
 * @params {any} data
 */
function helper(data: any): SchemaItem {
  const schema = {}

  // handle non objects
  if (typeof data !== 'object')
    return {
      type: typeof data,
    }

  // handle top-level arrays
  if (data instanceof Array) {
    let items
    // assume that array is not empty
    if (data[0] instanceof Object) {
      items = {
        type: 'object',
        properties: helper(data[0]),
      }
    } else {
      items = helper(data[0])
    }
    return [items]
  }

  // is a object
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof Array) {
      let items
      // assume that array is not empty
      if (value[0] instanceof Object) {
        items = {
          type: 'object',
          properties: helper(value[0]),
        }
      } else {
        items = helper(value[0])
      }
      schema[key] = {
        type: 'array',
        items,
      }
    } else if (value instanceof Object) {
      schema[key] = {
        type: 'object',
        properties: helper(value),
      }
    } else {
      schema[key] = {
        type: typeof value,
      }
    }
  })
  return schema
}
