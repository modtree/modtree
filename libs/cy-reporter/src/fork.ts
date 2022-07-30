import { fork } from 'child_process'

/**
 * fork a sender process that will handle async operations
 * (path given here is relative to the cypress project, in
 * this case is apps/web-e2e)
 *
 * because of this relative declaration, this file is only
 * meant to be ran automatically by cypress.
 *
 * running this file by node standalone will throw and error
 * for resolving the path of the forked process.
 */
export const sender = fork('reporters/sender')
