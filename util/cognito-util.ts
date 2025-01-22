import { IClientInterface } from "@/models/interfaces/client/client";
import {
  CognitoUserPool,
  ICognitoUserAttributeData,
  CognitoUserAttribute,
  CognitoUser,
  CognitoIdToken,
  CognitoAccessToken,
  CognitoRefreshToken,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { Session, User } from "next-auth";
import { z } from "zod";
import { AttributeType } from "@aws-sdk/client-cognito-identity-provider";

export const USER_POOL_ID = process.env
  .NEXT_PUBLIC_COGNITO_USER_POOL_ID as string;
export const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string;

if (!USER_POOL_ID || !CLIENT_ID) {
  throw new Error("Missing environment variables for Cognito User Pool");
}

const poolData = {
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
};
export const cognitoPool = new CognitoUserPool(poolData);

export const mapAttributesToUser = (
  attributes: ICognitoUserAttributeData[]
): User => {
  const user: User = {
    userId: "",
    email: "",
    givenName: "",
    familyName: "",
    phoneNumber: "",
    profilePicUrl: "",
    isStripeBasicActive: false,
    stripeCustomerId: "",
  };

  attributes.forEach((attribute) => {
    switch (attribute.Name) {
      case "sub":
        user.userId = attribute.Value;
        break;
      case "email":
        user.email = attribute.Value;
        break;
      case "given_name":
        user.givenName = attribute.Value;
        break;
      case "family_name":
        user.familyName = attribute.Value;
        break;
      case "phone_number":
        user.phoneNumber = attribute.Value;
        break;
      default:
        break;
    }
  });

  return user;
};

export const mapAttributes = (attributes: AttributeType[]): User => {
  const user: User = {
    userId: "",
    email: "",
    givenName: "",
    familyName: "",
    phoneNumber: "",
    profilePicUrl: "",
    isStripeBasicActive: false,
    stripeCustomerId: "",
  };

  attributes.forEach((attribute) => {
    switch (attribute.Name) {
      case "sub":
        user.userId = attribute.Value!;
        break;
      case "email":
        user.email = attribute.Value!;
        break;
      case "given_name":
        user.givenName = attribute.Value!;
        break;
      case "family_name":
        user.familyName = attribute.Value!;
        break;
      case "phone_number":
        user.phoneNumber = attribute.Value!;
        break;
      default:
        break;
    }
  });

  return user;
};

export function prepareAttributes(
  client: IClientInterface
): CognitoUserAttribute[] {
  const attributeList: CognitoUserAttribute[] = [];
  const attrData: ICognitoUserAttributeData[] = [
    { Name: "email", Value: client.Email },
    { Name: "given_name", Value: client.FirstName },
    { Name: "family_name", Value: client.LastName },
    {
      Name: "address",
      Value: `${client.Address} ${client.Suburb} ${client.PostCode} ${client.Country}`,
    },
    { Name: "phone_number", Value: client.PhoneNumber },
    { Name: "custom:DomainId", Value: "1" },
    // Add other attributes as needed
  ];

  attributeList.push(...(attrData as CognitoUserAttribute[]));
  return attributeList;
}
export function handleValidationErrors(
  result: z.SafeParseReturnType<any, any>
): { [key: string]: string } {
  const errors: { [key: string]: string } = {};
  result.error?.errors.forEach((error) => {
    if (error.path.length > 0) {
      errors[error.path[0]] = error.message;
    } else {
      errors.general = error.message;
    }
  });
  //localhost:3000/meal-planner/meal-preferences
  http: return errors;
}
export function initializeCognitoUser(
  email: string,
  idToken?: string | undefined,
  accessToken?: string | undefined,
  refreshToken?: string | undefined
): CognitoUser {
  const userData = {
    Username: email,
    Pool: cognitoPool,
  };

  const cognitoUser = new CognitoUser(userData);

  if (idToken && accessToken && refreshToken) {
    const cognitoIdToken = new CognitoIdToken({
      IdToken: idToken,
    });
    const cognitoAccessToken = new CognitoAccessToken({
      AccessToken: accessToken,
    });
    cognitoAccessToken;
    const cognitoRefreshToken = new CognitoRefreshToken({
      RefreshToken: refreshToken,
    });

    cognitoUser.setSignInUserSession(
      new CognitoUserSession({
        AccessToken: cognitoAccessToken,
        IdToken: cognitoIdToken,
        RefreshToken: cognitoRefreshToken,
      })
    );
  }

  return cognitoUser;
}
