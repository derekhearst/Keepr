import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'

export const PUT = (async ({ params, locals, request }) => {
	const session = await locals.getSession()
	if (!session?.user?.id) return new Response('not logged in', { status: 401 })
	const data = await request.json()

	const rows = await prisma.vault.updateMany({
		where: {
			userId: session?.user?.id,
			id: params.vaultId
		},
		data: {
			name: data.name,
			description: data.description,
			isPrivate: data.isPrivate,
			img: data.img,
			userId: session.user.id
		}
	})
	if (rows) {
		return new Response('success', { status: 200 })
	} else {
		return new Response('No vault at that ID or you cant access it.', { status: 404 })
	}
}) satisfies RequestHandler
