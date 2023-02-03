import { PrismaClient } from '@prisma/client/edge'
import { NEW_DATABASE_URL } from '$env/static/private'
export const prisma = new PrismaClient({
	datasources: {
		db: {
			url: NEW_DATABASE_URL
		}
	}
})
