import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Allow if token/user exists
      return !!token;
    },
  },
  // Set your secret if needed; usually from your .env
  secret: process.env.NEXTAUTH_SECRET,
});

// Only protect routes you want, e.g. "/protected/*"
export const config = {
  matcher: ["/protected/:path*"], // or ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};

