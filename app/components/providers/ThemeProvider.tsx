'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.themeColor) {
      document.documentElement.style.setProperty('--primary', session.user.themeColor);
      // Optional: Adjust secondary/accent colors based on primary if needed, 
      // but for now we essentially stick to one primary override.
    }
  }, [session?.user?.themeColor]);

  return <>{children}</>;
}
