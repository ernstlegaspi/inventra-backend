import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import dotenv from 'dotenv'
import Fastify from 'fastify'

import jwtPlugin from './plugins/jwt'
import prismaPlugin from './plugins/prisma'
import redisPlugin from './plugins/redis'

(async () => {
  dotenv.config()

  const app = Fastify({
    ajv: {
      customOptions: {
        coerceTypes: false,
        allErrors: true
      }
    },
    logger: true
  })

  app.register(jwtPlugin)
  app.register(prismaPlugin)
  app.register(redisPlugin)

  app.register(cookie, {
    secret: process.env.COOKIE_SECRET!,
    hook: 'onRequest'
  })

  app.register(cors, {
    credentials: true,
    origin: '*'
  })

  app.addSchema({
    $id: 'ErrorResponse',
    type: 'object',
    required: ['message'],
    properties: { message: { type: 'string' } }
  })

  try {
    const port = process.env.PORT || 3000

    await app.listen({ port: Number(port) })

    console.log(`Server is running in PORT: ${port}`)
  } catch(e) {
    app.log.error(e)
  }
})()