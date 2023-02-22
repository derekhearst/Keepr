import type { PageServerLoad } from './$types'
import { prisma } from '$lib/prisma'

export const load = (async () => {
	return {
		keeps: prisma.keep.findMany({
			include: {
				user: true,
				_count: {
					select: {
						vaults: true
					}
				}
			},
			cacheStrategy: { swr: 60, ttl: 60 }
		})
	}
}) satisfies PageServerLoad
