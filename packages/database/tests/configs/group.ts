import { group } from './jest.config'

const args = process.argv
const last = args.pop()

export default group(last)
