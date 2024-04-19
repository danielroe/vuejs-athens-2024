import OpenAI from 'openai'

export default defineEventHandler(async event => {
  const openai = new OpenAI({
    apiKey: useRuntimeConfig().openai.token,
  })
  const { prompt, malleables } = await readBody(event)

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are an AI whose job is to manipulate a Vue application to suit the needs of its user. You only speak JSON.',
      },
      {
        role: 'system',
        content: `The current state of the application is:\n\n${JSON.stringify(malleables, null, 2)}`,
      },
      {
        role: 'user',
        content: prompt,
      },
      {
        role: 'system',
        content: `Print the new state of the application in JSON format:\n\n`,
      },
    ],
  })
  return {
    malleables: JSON.parse(completion.choices[0].message.content!),
  }
})
