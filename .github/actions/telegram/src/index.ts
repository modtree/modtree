import * as core from '@actions/core'
import * as github from '@actions/github'
import type { Needs } from './types'
import { bot } from './bot'
import { print } from './print'

/**
 * this is read from github actions
 */
const needs: Needs = JSON.parse(core.getInput('needs'))
const prTitle = core.getInput('pr-title')

const push = () => {
  bot.send([print.needs(needs)])
}

const pullRequest = () => {
  const title = `#${github.context.payload.pull_request.number} ${prTitle}`
  console.log(github.context.action)
  console.log(github.context.job)
  console.log(github.context.workflow)
  bot.send([title, print.needs(needs)])
}

const deploy = () => {
  const title = `#${github.context.payload.pull_request.number} ${prTitle}`
  bot.send([title, print.needs(needs)])
}

try {
  const event = github.context.eventName
  if (event === 'pull_request') pullRequest()
  if (event === 'push') push()
} catch (error) {
  core.setFailed(error.message)
}
