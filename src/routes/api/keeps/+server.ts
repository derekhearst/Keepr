import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'
import { invalidateAll } from '$app/navigation'

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
		}
	})
	return new Response(JSON.stringify(keep))
}) satisfies RequestHandler

export const GET = (async ({ locals }) => {
	const session = await locals.getSession()
	if (!session?.user?.id) {
		return new Response(null, { status: 401 })
	}
	const keeps = await prisma.keep.findMany()
	return new Response(JSON.stringify(keeps))
}) satisfies RequestHandler
