import { initializeCognitoUser } from "@/util/cognito-util";
import {
  CognitoRefreshToken,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { JWT } from "next-auth/jwt";

import {
  AdminInitiateAuthCommand,
  AdminInitiateAuthRequest,
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthRequest,
} from "@aws-sdk/client-cognito-identity-provider";

export async function refreshCognitoSession(token: JWT): Promise<JWT> {
  const client = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_COGNITO_REGION,
  });

  const params: AdminInitiateAuthRequest = {
    UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    AuthParameters: {
      REFRESH_TOKEN: token.refreshToken as string,
      //  DEVICE_KEY: "device-key", // Required for refresh token auth
    },
  };

  const command = new AdminInitiateAuthCommand(params);

  try {
    const response = await client.send(command);

    if (response.AuthenticationResult) {
      token.idToken = response.AuthenticationResult?.IdToken!;
      token.accessToken = response.AuthenticationResult?.AccessToken!;
      token.refreshToken =
        response.AuthenticationResult?.RefreshToken || token.refreshToken;
      token.expires = Date.now() + 3600 * 1000;

      return token;
    } else {
      throw new Error("Authentication result is empty");
    }
  } catch (error) {
    console.error("Error refreshing Cognito session:", error);
    throw error;
  }
}
