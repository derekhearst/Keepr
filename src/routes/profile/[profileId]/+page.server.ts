import type { PageServerLoad } from './$types.js'
import { prisma } from '$lib/prisma'
export const load = (async ({ params, locals }) => {
	const session = await locals.getSession()
	return {
		profile: await prisma.user.findUnique({
			where: {
				id: params.profileId
			},
			include: {
				keeps: true,
				vaults: {
					where: {
						// @ts-expect-error TODO: fix this
						OR: [{ isPrivate: false }, { userId: session?.user?.id }]
					}
				}
			}
		})
	}
}) satisfies PageServerLoad
