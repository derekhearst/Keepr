import { SvelteKitAuth } from '@auth/sveltekit';
import Auth0 from '@auth/core/providers/auth0';
import { GITHUB_ID, GITHUB_SECRET, CLIENT_ID, CLIENT_SECRET, ISSUER } from '$env/static/private';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { prisma } from '$lib/server/prisma';
export const handle = SvelteKitAuth({
	providers: [Auth0({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, issuer: ISSUER })],
	adapter: PrismaAdapter(prisma)
});
