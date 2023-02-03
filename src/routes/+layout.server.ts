import type { LayoutServerLoad } from './$types'
import { prisma } from '$lib/prisma'

export const load = (async (event) => {
	const session = await event.locals.getSession()

	return {
		session: session,
		keeps: await prisma.keep.findMany({
			include: {
				user: true,
				_count: {
					select: {
						vaults: true
					}
				}
			}
		}),
		myVaults: await prisma.vault.findMany({
			where: {
				userId: session?.user?.id as string | undefined
			},
			include: {
				user: true
			}
		})
	}
}) satisfies LayoutServerLoad
