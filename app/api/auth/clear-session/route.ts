import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Session cleared' });
  try {
    res.cookies.delete('next-auth.session-token');
    res.cookies.delete('__Secure-next-auth.session-token');
  } catch {}
  return res;
}
