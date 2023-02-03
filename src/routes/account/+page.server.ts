import type { PageServerLoad } from './$types.js'
import { prisma } from '$lib/prisma.js'
import { error, type Actions } from '@sveltejs/kit'
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession()
	if (!session?.user?.id) {
		throw error(403, 'You must be logged in to view this page')
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
		if (!session?.user?.id) {
			throw error(403, 'You must be logged in to update your account')
		}
		const formData = await request.formData()
		if (!formData) throw error(400, 'No form data found')
		const data = Object.fromEntries(formData.entries())
		await prisma.user.update({
			where: {
				id: session.user.id
			},
			data: {
				name: data.name as string,
				image: data.email as string,
				coverImg: data.coverImg as string
			}
		})
		return 'Succeeds'
	}
} satisfies Actions
