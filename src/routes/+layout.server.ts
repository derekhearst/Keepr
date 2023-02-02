import type { LayoutServerLoad } from './$types'
import { prisma } from '$lib/server/prisma'

export const load = (async (event) => {
	return {
		session: await event.locals.getSession(),
		keeps: await prisma.keep.findMany({
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
}) satisfies LayoutServerLoad
