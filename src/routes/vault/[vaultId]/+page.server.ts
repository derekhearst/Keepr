import type { PageServerLoad } from './$types.js'
import { prisma } from '$lib/prisma'
import type { Vault } from '@prisma/client'

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

	if (!vault) return { status: 404 }
	if (vault.isPrivate && vault.userId != session?.user?.id) return { status: 403 }

	return {
		vault: vault
	}
}) satisfies PageServerLoad
