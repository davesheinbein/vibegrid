import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env
				.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	session: {
		strategy: 'jwt',
	},
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
			if (session.user) {
				session.user.name = token.name as string;
				session.user.email = token.email as string;
				session.user.image = token.picture as string;
				// Add id as a custom property
				(session.user as any).id = token.id;
			}
			return session;
		},
	},
});
