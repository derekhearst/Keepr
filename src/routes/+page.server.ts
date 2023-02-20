import type { PageServerLoad } from './$types'
import { prisma } from '$lib/prisma'
export const ssr = false

export const load = (async () => {
	return {
		defer: {
			keeps: prisma.keep.findMany({
				include: {
					user: true,
					_count: {
						select: {
							vaults: true
						}
					}
				}
			})
		}
	}
}) satisfies PageServerLoad
