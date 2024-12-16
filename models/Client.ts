import { Countries } from "@/constants/constants-enums";
import { IClientInterface } from "./interfaces/client/client";
import { IClientSettingsInterface } from "./interfaces/client/client-settings";
class Client implements IClientInterface {
  Id: number;
  DashboardId?: number;
  AmazonId?: string;
  FirstName: string;
  LastName: string;
  Age: number;
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

  constructor({
    Id,
    DashboardId,
    FirstName,
    LastName,
    Age,
    BodyWeight,
    Height,
    Gender,
    Email,
    PhoneNumber,
    Birthday,
    Country,
    City,
    Address,
    Suburb,
    PostCode,
    Activity,
    UserID,
    Bodyfat,
    ClientSettingsDto,
  }: IClientInterface) {
    this.Id = Id;
    this.DashboardId = DashboardId;
    this.FirstName = FirstName;
    this.LastName = LastName;
    this.Age = Age;
    this.BodyWeight = BodyWeight;
    this.Height = Height;
    this.Gender = Gender;
    this.Email = Email;
    this.PhoneNumber = PhoneNumber;
    this.Birthday = Birthday;
    this.Address = Address;
    this.Suburb = Suburb;
    this.Country = Country;
    this.City = City;
    this.PostCode = PostCode;
    this.Activity = Activity;
    this.UserID = UserID;
    this.Bodyfat = Bodyfat;
    this.ClientSettingsDto = ClientSettingsDto;
  }
}
export enum GenderType {
  Male = "Male",
  Female = "Female",
}

export enum ActivityLevel {
  Sedentary = "Sedentary",
  LightlyActive = "LightlyActive",
  Active = "Active",
  VeryActive = "VeryActive",
  HighlyActive = "HighlyActive",
}

export default Client;
