import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
    role?: string;
    themeColor?: string;
  }

  interface Session {
    user: User & {
      id: string;
      isAdmin: boolean;
      role?: string;
      themeColor?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
    role?: string;
    themeColor?: string;
  }
}
