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

          return { 
            id: user._id.toString(),
            email: user.email, 
            role: user.role 
          } as any;
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
          let existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              password: '', // No password for OAuth users
              role: 'admin',
            });
            existingUser = await newUser.save();
          }
          
          // Add user ID to the user object for JWT callback
          (user as any).id = existingUser._id.toString();
          (user as any).role = existingUser.role;
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, user }) {
      // Include user ID and role in the JWT token
      console.log('JWT callback - token:', token);
      console.log('JWT callback - user:', user);
      
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        console.log('JWT callback - updated token:', token);
      }
      return token;
    },
    
    async session({ session, token }) {
      // Include user ID and role in the session
      console.log('Session callback - token:', token);
      console.log('Session callback - session before:', session);
      
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        
        // If ID is missing from token, fetch it from database
        if (!token.id && session.user?.email) {
          try {
            await connectToMongoose();
            const user = await User.findOne({ email: session.user.email });
            if (user) {
              (session.user as any).id = user._id.toString();
              (session.user as any).role = user.role;
            }
          } catch (error) {
            console.error('Error fetching user ID in session callback:', error);
          }
        }
      }
      
      console.log('Session callback - session after:', session);
      return session;
    },
    
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

