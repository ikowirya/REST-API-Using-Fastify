export const queryHealthSchema = {
    querystring: {
      type: 'object',
      properties: {
        filter: { type: 'string' }
      },
      additionalProperties: false
    }
  };