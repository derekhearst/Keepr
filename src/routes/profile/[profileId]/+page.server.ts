import type { PageServerLoad } from './$types.js'
import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'
import type { User, Keep, Vault } from '@prisma/client'
export const load = (async ({ params, locals }) => {
	const session = await locals.getSession()
	const profile = await prisma.user.findUnique({
		where: {
			id: params.profileId
		},
		include: {
			keeps: true,
			vaults: {
				where: {
					OR: [{ isPrivate: false }, { userId: session?.user?.id as string | undefined }]
				}
			}
		}
	})

	if (!profile) throw error(404, 'Profile not found')

	return {
		profile: profile as User & { keeps: Keep[]; vaults: Vault[] }
	}
}) satisfies PageServerLoad
