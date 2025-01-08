import { Countries } from "@/constants/constants-enums";
import { GenderType, ActivityLevel } from "@/models/Client";
import ClientSettingsDto from "@/models/client-settings";
import { IClientSettingsInterface } from "./client-settings";

export interface IClientInterface {
  Id: number;
  DashboardId?: number;
  AmazonId?: string;
  stripeCustomerId: string;
  isStripeBasicActive: boolean;
  FirstName: string;
  LastName: string;
  Age?: number;
  BodyWeight?: number;
  Height?: number;
  Gender?: GenderType;
  Email: string;
  PhoneNumber: string;
  Birthday?: Date;
  Country: Countries;
  City?: string;
  PostCode?: number;
  Activity?: ActivityLevel;
  UserID?: string;
  Address?: string;
  Suburb?: string;
  Bodyfat?: number;
  ClientSettingsDto?: IClientSettingsInterface;
}
