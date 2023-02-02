import { prisma } from '$lib/server/prisma'
import type { PageServerLoad } from './$types.js'
export const load = (async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: {
			id: params.profileId
		},
		include: {
			keeps: true,
			vaults: true
		}
	})
	return {
		user: user
	}
}) satisfies PageServerLoad
