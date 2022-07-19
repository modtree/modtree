/** for use when debugging */
const forceProd = false

const getIsDevEnv = () => {
  const env = process.env['NODE_ENV']
  if (env === 'production') return false // real production override
  if (forceProd) return false // forceProd override at debug-time
  // is development environment otherwise
  if (env === 'development') return true
  return true
}

/** the state used app-wide */
export const devEnv = getIsDevEnv()
