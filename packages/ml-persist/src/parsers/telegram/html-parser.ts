import cheerio from 'cheerio'


type RowMessage = {
  id?: number, // message_id
  name?: string,
  text?: string,
  reply?: number | null, // message_id
  day?: string | null,
  time?: string,
  date?: Date,
}

export type Message = {
  id: number, // message_id
  name: string,
  text: string,
  reply: number | null, // message_id
  date: Date,
}


const log = false
  ? console.log
  : (...p: any) => {}


export const htmlParse = (html: string): Message[] => {
  const $ = cheerio.load(html)

  let day: null | string = null

  let name: null | string = null

  const messages: RowMessage[] = []

  const domMessages = Array.from($('.history').children())
 
  const domIterMessages = Array.from(domMessages)

  for(let i=0;i<domIterMessages.length;i++) {
    const el = domIterMessages[i]

    const message: RowMessage = {}

    const id = $(el).attr('id')

    if (id === undefined) continue

    message.id = parseInt(id.replace('message', ''), 10)

    const body = $(el).children('.body')

    message.name = $(body).find('.from_name').text().trim() || undefined

    message.text = $(body).find('.text').text().trim() || undefined

    message.time = $(body).find('.date').text().trim() || undefined

    const reply = $(body).find('.reply_to').find('a').attr('href') || null

    if (reply !== null) {
      const replyIdStr = reply.replace(/.*go_to_message(\d+)/, (match, replyId) => {
        return replyId
      })

      if (replyIdStr !== '') {
        message.reply = parseInt(replyIdStr, 10)
      }
    }

    const isDay = id.indexOf('-')

    if (isDay !== -1) {
      message.day = $(el).text().trim() || undefined
    }
    else {
      message.day = null
    }

    if (message.day !== null && message.day !== undefined) {
      day = message.day
    }
    else {
      message.day = day
    }

    if (message.name !== null && message.name !== undefined) {
      name = message.name
    }
    else {
      message.name = name as string
    }

    message.date = new Date(`${message.day} ${message.time}`)

    delete message.day
    delete message.time

    messages.push(message)
  }


  const messagesFullInfo: Message[] = messages.filter(m => {
    if (!m.id) {
      log('empty id ' + m.id + ' in', m)
      return false
    }
    if (!m.name) {
      log('empty name ' + m.name + ' in', m)
      return false
    }
    if (!m.text) {
      log('empty text ' + m.text + ' in', m)
      return false
    }
    if (!m.date) {
      log('empty date ' + m.date + ' in', m)
      return false
    }
    return true
  }) as Message[]

  return messagesFullInfo
}

