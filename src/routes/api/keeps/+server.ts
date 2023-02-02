import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'

export const POST = (async ({ request, locals }) => {
	const session = await locals.getSession()
	if (!session?.user?.id) {
		return new Response(null, { status: 401 })
	}
	const body = await request.json()
	const keep = await prisma.keep.create({
		data: {
			...body,
			user: {
				connect: {
					id: session.user.id
				}
			}
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

export const GET = (async () => {
	const keeps = await prisma.keep.findMany()
	return new Response(JSON.stringify(keeps))
}) satisfies RequestHandler
