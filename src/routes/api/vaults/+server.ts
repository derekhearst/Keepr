import { prisma } from '$lib/prisma'
import type { RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.getSession()
	if (!session?.user?.id) return new Response('Unauthorized', { status: 401 })
	const body = await request.json()
	const vault = await prisma.vault.create({
		data: {
			name: body.name,
			img: body.img,
			description: body.description,
			isPrivate: body.isPrivate,
			user: {
				connect: {
					id: session.user.id
				}
			}
		}
	})
	return new Response(JSON.stringify(vault))
}
