import { PrismaClient } from '@prisma/client/edge'
export const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.NEW_DATABASE_URL
		}
	}
})