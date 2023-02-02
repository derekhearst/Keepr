import type { Keep, User, Vault } from '@prisma/client'
export type KeepWithUserAndCount = Keep & {
	user: User
	_count: {
		vaults: number
	}
}

export type VaultWithKeeps = Vault & {
	keeps: Keep[] | KeepWithUserAndCount[]
}
