import type { PageServerLoad } from './$types.js'
import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'

export const load = (async ({ params, locals }) => {
	const session = await locals.getSession()
	const vault = await prisma.vault.findUnique({
		where: {
			id: params.vaultId
		},
		include: {
			user: true,
			keeps: {
				include: {
					user: true,
					_count: {
						select: {
							vaults: true
						}
					}
				}
			}
		}
	})

	if (!vault) throw error(404, 'Vault not found')
	if (vault.isPrivate && vault.userId != session?.user?.id) throw error(403, 'You do not have access to this vault')

	return {
		vault: vault
	}
}) satisfies PageServerLoad
