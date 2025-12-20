import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Make sure this is exported properly for App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 