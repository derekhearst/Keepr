import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'

export const GET = (async ({ params }) => {
	await prisma.keep.update({
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

export const DELETE = (async ({ params, locals }) => {
	const session = await locals.getSession()
	if (!session?.user?.id) {
		return new Response('Unauthorized', { status: 401 })
	}
	const { count } = await prisma.keep.deleteMany({
		where: {
			id: params.keepId,
			userId: session.user.id
		}
	})
	if (count === 0) {
		return new Response('Unauthorized', { status: 401 })
	}
	return new Response('Deleted')
}) satisfies RequestHandler
