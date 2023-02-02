import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'
export const GET = (async ({ locals }) => {
	const user = await locals.getSession()
	if (!user) {
		return new Response(null, { status: 401 })
	}
	// console.log(user.user)
	// @ts-expect-error ID does actually exist here
	const dbuser = await prisma.user.findUnique({ where: { id: user.user.id } })
	console.log(dbuser)
	return new Response(JSON.stringify(dbuser))
}) satisfies RequestHandler
