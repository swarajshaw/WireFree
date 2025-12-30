import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global {
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined
  // eslint-disable-next-line no-unused-vars
  var prismaPool: Pool | undefined
}

const pool = global.prismaPool || new Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const client = global.prisma || new PrismaClient({ adapter })
if (process.env.NODE_ENV !== 'production') {
  global.prisma = client
  global.prismaPool = pool
}

export default client
