import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return !!token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export const config = {
  matcher: ['/protected/:path*'],
};
