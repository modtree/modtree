/**
 * Generates a schema given a sample response.
 * Assumes that there are no nested arrays.
 * Assumes that arrays have at least one element (so that type can be inferred)
 *
 * @params {Record<string, any>} sampleResponse
 */
export function generateSchema(
  sampleResponse: Record<string, any>
): SchemaItem {
  return helper(sampleResponse)
}

/**
 * Helper function for generateSchema
 *
 * @params {any} data
 */
function helper(data: any): SchemaItem {
  const schema = {}

  // handle non objects separately
  if (typeof data !== 'object')
    return {
      type: typeof data,
    }

  // assume no nested arrays
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
