import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'

export const DELETE = (async ({ locals, params, request }) => {
	const session = await locals.getSession()
	const data = await request.json()
	if (!session?.user?.id) return new Response('not logged in', { status: 401 })
	const vault = await prisma.vault.findFirst({
		where: {
			id: params.vaultId
		}
	})
	if (!vault) return new Response('No vault at that ID or you cant access it.', { status: 404 })
	await prisma.vault.update({
		where: {
			id: params.vaultId
		},
		data: {
			keeps: {
				disconnect: {
					id: data.keepId
				}
			}
		}
	})
	return new Response('success', { status: 200 })
}) satisfies RequestHandler
