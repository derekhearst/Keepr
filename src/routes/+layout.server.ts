import type { LayoutServerLoad } from './$types'
import { prisma } from '$lib/prisma'

export const load = (async (event) => {
	const session = await event.locals.getSession()

	return {
		session: session,

		myVaults: prisma.vault.findMany({
			where: {
				userId: session?.user?.id as string | undefined
			},
			include: {
				user: true
			}
		})
	}
}) satisfies LayoutServerLoad
