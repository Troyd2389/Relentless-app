export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/client-dashboard/:path*', '/coach-dashboard/:path*']
};
