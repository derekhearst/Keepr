import type { Vault } from '@prisma/client'
import { writable } from 'svelte/store'

export const myVaults = writable([] as Vault[])
