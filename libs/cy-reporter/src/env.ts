// hard-coded because even in dev-time, we want to use the remote
// server to read/write the runs
export const useProd = false
export const baseURL = useProd
  ? 'https://modtree-cy-reporter.herokuapp.com'
  : 'http://localhost:8081'
