import type { FastifyInstance } from 'fastify'

import IORedis, { Redis } from 'ioredis'
import fplugin from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis
  }
}

export default fplugin(async (fastify: FastifyInstance) => {
  const redis = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
    connectTimeout: 10_000,
    lazyConnect: false,
    retryStrategy: times => Math.min(times * 200, 2000)
  })

  fastify.decorate('redis', redis)

  fastify.addHook('onClose', async () => {
    await redis.quit()
  })
})
