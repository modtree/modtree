import { postman } from '../postman'

const moduleCodes = ['MA2001', 'CS1231S', 'EL1101E']

postman.post('modules-condensed/', { moduleCodes }).then(console.log)
