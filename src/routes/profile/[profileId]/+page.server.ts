import type { PageServerLoad } from './$types.js'
import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'
export const load = (async ({ params, locals }) => {
	const session = await locals.getSession()
	const profile = await prisma.user.findUnique({
		where: {
			id: params.profileId
		},
		include: {
			keeps: {
				include: {
					user: true,
					_count: {
						select: {
							vaults: true
						}
					}
				}
			},
			vaults: {
				where: {
					OR: [{ isPrivate: false }, { userId: session?.user?.id as string | undefined }]
				}
			}
		}
	})

	if (!profile) throw error(404, 'Profile not found')

	return {
		profile: profile
	}
}) satisfies PageServerLoad
