import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'
export const GET = (async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: {
			id: params.profileId
		},
		include: {
			keeps: true,
			vaults: true
		}
	})
	return new Response(JSON.stringify(user))
}) satisfies RequestHandler
