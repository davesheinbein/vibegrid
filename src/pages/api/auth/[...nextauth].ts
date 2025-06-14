import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env
				.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account && profile) {
				token.id = (profile as any).sub;
				token.email = profile.email;
				token.name = profile.name;
				token.picture = (profile as any).picture;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token) {
				session.user.name = token.name as string;
				session.user.email = token.email as string;
				session.user.image = token.picture as string;
				(session.user as any).id = token.id;
			}
			return session;
		},
	},
	pages: {
		error: '/auth/error',
	},
	debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
