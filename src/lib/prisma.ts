import { PrismaClient } from '@prisma/client/edge'
import useAccelerate from '@prisma/extension-accelerate'
import { NEW_DATABASE_URL } from '$env/static/private'
export const prisma = new PrismaClient({
	datasources: {
		db: {
			url: NEW_DATABASE_URL
		}
	}
}).$extends(useAccelerate)
