import NextAuth, { NextAuthConfig, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { mapAttributes } from "./util/cognito-util";
import Credentials from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers";
import { EmailNotConfirmedException } from "./util/error-util";
import { refreshCognitoSession } from "./lib/cognito";
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
  GetUserCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getClientUnsafe } from "./lib/client/client-side/client";

//import jwt from "jsonwebtoken";
//var jwt = require("jsonwebtoken");

const cognitoConfig: CognitoIdentityProviderClientConfig = {
  region: process.env.NEXT_PUBLIC_COGNITO_REGION, // Your AWS region
};

const cognitoClient = new CognitoIdentityProviderClient(cognitoConfig);

const providers: Provider[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "email", type: "text", placeholder: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      if (!credentials) return null;

      const params = {
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
        AuthParameters: {
          USERNAME: credentials.email as string,
          PASSWORD: credentials.password as string,
        },
      };

      try {
        const command = new InitiateAuthCommand(params);
        const response = await cognitoClient.send(command);

        if (!response.AuthenticationResult) {
          throw new Error("Authentication failed");
        }

        const { AccessToken, IdToken, RefreshToken } =
          response.AuthenticationResult;

        // Fetch user attributes
        const getUserCommand = new GetUserCommand({
          AccessToken: AccessToken!,
        });
        const userResponse = await cognitoClient.send(getUserCommand);
        const userAttributes = userResponse.UserAttributes;

        // TODO: Increase security by Implementing HTTP cookie for session management
        const userInfo: User = {
          userId: credentials.email as string,
          idToken: IdToken!,
          accessToken: AccessToken!,
          refreshToken: RefreshToken!,
          email: "",
          givenName: "",
          familyName: "",
          phoneNumber: "",
        };

        if (userAttributes) {
          const mappedUser = mapAttributes(userAttributes);
          Object.assign(userInfo, mappedUser);
        }

        // fetch clientid and store in the user object
        const client = await getClientUnsafe(userInfo.userId);
        const clientId = client.Id ? client.Id.toString() : "";
        userInfo.clientId = clientId;

        //TODO: Implement secure cookie
        // Inside your authorize function after fetching clientId
        // const cookie = serialize("clientId", clientId.toString(), {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === "production",
        //   sameSite: "strict",
        //   path: "/",
        //   maxAge: 60 * 60 * 24 * 30, // 30 days
        // });

        // console.log("User authenticated", userInfo);
        return userInfo;
      } catch (err) {
        console.error(err);
        if (err instanceof EmailNotConfirmedException) {
          throw err; // Rethrow the specific exception
        }
        return null;
      }
    },
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

const config: NextAuthConfig = {
  // TODO: Implement secure cookie when deploying to production, check this if issues in production
  useSecureCookies: process.env.NODE_ENV === "production",
  providers: providers,
  callbacks: {
    // token: JWT; user: User | AdapterUser; account: Account | null; profile?: Profile; trigger?: "signIn" | "signUp" | "update"; isNewUser?: boolean; session?: any; }):
    async jwt({
      token,
      user,
      account,
      profile,
      trigger,
      isNewUser,
      session,
    }: {
      token: JWT;
      user?: User;
      account?: any;
      profile?: any;
      trigger?: string;
      isNewUser?: boolean;
      session?: any;
    }): Promise<JWT> {
      if ((trigger == "signUp" && session?.user) || user) {
        // runs on sign in
        token.expires = Date.now() + 3600 * 1000; // 1 hour
        user ||= session?.user;
        return {
          ...token,
          ...user,
        };
      } else if (session && trigger === "update") {
        // runs on update session
        return { ...token, user: session };
      }

      // Check if token is expired
      if (Date.now() > token?.expires) {
        // Refresh session using refreshToken
        try {
          const newToken = await refreshCognitoSession(token); // Refresh expiration time
          return newToken;
        } catch (error) {
          console.error("Error refreshing session:", error);
          return token;
        }
      }

      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          userId: token.userId as string,
          clientId: token.clientId as string,
          email: token.email as string,
          givenName: token.givenName as string,
          familyName: token.familyName as string,
          phoneNumber: token.phoneNumber as string,
          idToken: token.idToken as string,
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
        },
      };
    },
  },
  events: {
    // Create a new user in your system
  },
  pages: {
    signIn: "/login",
    newUser: "/register", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  secret: process.env.SECRET,
};

export const { auth, handlers, signIn, signOut, unstable_update } =
  NextAuth(config);