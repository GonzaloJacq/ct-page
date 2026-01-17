import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import type { Session } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { IncomingMessage } from 'http';

import { Teko, Montserrat } from "next/font/google";

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CLAN TEAM FC - Gestión del equipo",
  description: "Sistema de gestión integral del equipo de fútbol amateur",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null as Session | null;
  try {
    // Only validate token if NEXTAUTH_SECRET is set (required for JWT decryption)
    if (process.env.NEXTAUTH_SECRET) {
      // Build a request-like object for getToken using headers and cookies from next/headers
      const h = await headers();
      const c = await cookies();

      const headerEntries = Array.from(h as unknown as Iterable<[string, string]>);
      const cookieEntries = c.getAll().map((item) => [item.name, item.value]);

      const reqLike: { headers: Record<string, string>; cookies: Record<string, string> } = {
        headers: Object.fromEntries(headerEntries),
        cookies: Object.fromEntries(cookieEntries),
      };

      // Validate token first to avoid NextAuth internal logs on decryption failure
      let token = null as null | Record<string, unknown>;
      try {
        token = await getToken({ req: reqLike as unknown as IncomingMessage & { cookies: Record<string, string> }, secret: process.env.NEXTAUTH_SECRET });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err || '');
        const isDecryptionError = msg.includes('decryption operation failed') || msg.includes('JWEDecryptionFailed') || msg.includes('JWT_SESSION_ERROR');
        if (isDecryptionError) {
          // If the user's cookie cannot be decrypted, redirect to login so we don't call getServerSession
          console.warn('Invalid auth cookie detected in layout — redirecting to login and avoiding getServerSession call.');
          redirect('/auth/login');
        }
        // Other errors just fall through and we won't set a session
      }

      // Build a minimal session from detected token so we don't call getServerSession
      if (token) {
        type TokenPayload = { id?: string; email?: string; name?: string; exp?: number | string; sub?: string };
        const tok = token as TokenPayload;
        session = {
          user: {
            id: tok.id || tok.sub || '',
            email: tok.email || tok.sub || '',
            name: tok.name || '',
          },
          expires: tok.exp ? new Date(Number(tok.exp) * 1000).toISOString() : undefined,
        } as Session;
      }
    }
    // If NEXTAUTH_SECRET is not set, session remains null but we don't redirect
    // The session will be provided by client-side SessionProvider after login
  } catch (err: unknown) {
    // If this is a Next.js redirect, re-throw so it causes navigation rather than logging
    if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err;
    // Any unexpected errors while attempting to fetch a session should not crash the render
    console.warn('Error while fetching server session in layout:', err);
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${teko.variable} ${montserrat.variable} antialiased font-sans`}
      >
        <SessionWrapper session={session}>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
