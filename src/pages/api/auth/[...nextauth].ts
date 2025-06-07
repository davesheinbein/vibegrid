import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account && profile) {
				token.id = profile.sub;
				token.email = profile.email;
				token.name = profile.name;
				token.picture = profile.picture;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id;
			session.user.email = token.email;
			session.user.name = token.name;
			session.user.image = token.picture;
			return session;
		},
	},
});
