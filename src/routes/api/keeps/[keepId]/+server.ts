import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'

export const GET = (async ({ params }) => {
	prisma.keep.update({
		where: {
			id: params.keepId
		},
		data: {
			views: {
				increment: 1
			}
		}
	})
	const keep = await prisma.keep.findUnique({
		where: {
			id: params.keepId
		},
		include: {
			user: true,
			_count: {
				select: {
					vaults: true
				}
			}
		}
	})
	return new Response(JSON.stringify(keep))
}) satisfies RequestHandler
