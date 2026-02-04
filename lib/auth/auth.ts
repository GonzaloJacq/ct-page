import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('NEXTAUTH_SECRET is not defined. This may cause JWT decryption errors.');
}

/**
 * Custom error class for authentication failures
 */
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Validates user credentials against the database
 */
async function verifyCredentials(credentials: Record<string, string> | undefined) {
  if (!credentials?.email || !credentials?.password) {
    throw new AuthenticationError('Email y contraseña son requeridos');
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new AuthenticationError('Usuario no encontrado');
  }

  const isValidPassword = await bcrypt.compare(credentials.password, user.password);
  
  if (!isValidPassword) {
    throw new AuthenticationError('Contraseña incorrecta');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    themeColor: user.themeColor || undefined, // Ensure strict compatibility with NextAuth User type
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          return await verifyCredentials(credentials);
        } catch (error) {
          // You might want to log the error here structurally
          throw error; 
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Cuando el usuario se loguea por primera vez
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        
        // Hardcoded admin for specific email
        if (user.email === 'admin@admin.com') {
          token.isAdmin = true;
        }

        token.themeColor = user.themeColor;
        // Establecer tiempo de expiración del token (15 minutos)
        token.iat = Math.floor(Date.now() / 1000);
        token.exp = Math.floor(Date.now() / 1000) + (15 * 60);
      }

      // Verificar si el token está próximo a expirar (renovar 2 minutos antes)
      if (token && typeof token.exp === 'number') {
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = token.exp - now;

        // Si quedan menos de 2 minutos, renovar el token
        if (timeUntilExpiry < 120) {
          token.iat = Math.floor(Date.now() / 1000);
          token.exp = Math.floor(Date.now() / 1000) + (15 * 60);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.themeColor = token.themeColor as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 minutos
    updateAge: 5 * 60, // Renovar sesión cada 5 minutos si hay actividad
  },
  jwt: {
    maxAge: 15 * 60, // 15 minutos
  },
};
