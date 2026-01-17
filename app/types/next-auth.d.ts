import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
    themeColor?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role?: string;
      themeColor?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
    themeColor?: string;
  }
}
