import type { PageServerLoad } from './$types.js'
import { prisma } from '$lib/prisma.js'
import type { Actions } from '@sveltejs/kit'
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession()
	if (!session?.user?.id) {
		return {}
	}
	return {
		user: await prisma.user.findUnique({
			where: {
				id: session.user.id
			}
		}),

		myKeeps: await prisma.keep.findMany({
			where: {
				userId: session.user.id
			},
			include: {
				user: true,
				_count: {
					select: {
						vaults: true
					}
				}
			}
		})
	}
}

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const session = await locals.getSession()
		const formData = await request.formData()
		const data = Object.fromEntries(formData.entries())
		await prisma.user.updateMany({
			where: {
				id: session?.user?.id
			},
			data: {
				name: data.name,
				image: data.email,
				coverImg: data.coverImg
			}
		})
		return 'Succeeds'
	}
} satisfies Actions
