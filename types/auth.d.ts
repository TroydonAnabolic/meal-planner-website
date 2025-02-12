import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    userId: string;
    clientId?: string | undefined;
    email: string;
    givenName: string;
    familyName: string;
    phoneNumber: string;
    profilePicUrl: string;
    stripeCustomerId: string;
    isStripeBasicActive: boolean;
    timeZoneId?: string;
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT, User {
    // This will merge the properties of User into JWT
    expires: number;
  }
}
