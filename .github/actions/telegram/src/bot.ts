import * as core from '@actions/core'
import { Telegram } from 'telegraf'

/**
 * read this from github actions
 */
const token = core.getInput('telegram-token')
const chatId = core.getInput('telegram-chat-id')

/**
 * instantiate a new telegram bot with the token
 */
const tele = new Telegram(token)

/**
 * export a simpler version
 */
export const bot = {
  send: (message: string | string[]) => {
    if (typeof message === 'string') {
      tele.sendMessage(chatId, message)
    } else {
      tele.sendMessage(chatId, message.join('\n'))
    }
  },
}
