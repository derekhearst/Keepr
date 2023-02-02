import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'

export const POST = (async ({ locals, request }) => {
	const session = await locals.getSession()
	if (!session?.user?.id) return new Response('not logged in', { status: 401 })
	const data = await request.json()
	const vault = await prisma.vault.findFirst({
		where: {
			id: data.vaultId,
			userId: session?.user?.id
		}
	})
	if (!vault) return new Response('No vault at that ID or you cant access it.', { status: 404 })

	const rows = await prisma.vault.update({
		where: {
			id: data.vaultId
		},
		data: {
			keeps: {
				connect: {
					id: data.keepId
				}
			}
		}
	})

	if (rows) {
		return new Response('success', { status: 200 })
	} else {
		return new Response('No vault at that ID or you cant access it.', { status: 500 })
	}
}) satisfies RequestHandler
