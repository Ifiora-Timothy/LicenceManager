// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import bcrypt from 'bcryptjs';
import { connectToMongoose } from './mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
        async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          // Ensure Mongoose connection
          await connectToMongoose();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error('No user found with this email');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid password');
          }

          return { email: user.email, role: user.role } as any;
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      },
    }),
    
    
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Ensure Mongoose connection
          await connectToMongoose();
          
          // Auto-create user for Google OAuth
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              password: '', // No password for OAuth users
              role: 'admin',
            });
            await newUser.save();
          }
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, user }) {
      // Include user role in the JWT token
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Include user role in the session
      if (token) {
        (session.user as any).role = token.role;
      }
      return session;
    },
    
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

