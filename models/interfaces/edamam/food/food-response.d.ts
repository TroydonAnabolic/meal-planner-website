import { IFood, Measure } from "../../food/food";

interface IFoodParser {
  text: string;
  count: number;
  parsed: ParsedFood[];
  hints: IHint[];
  _links: Links;
}

interface ParsedFood {
  food: IFood;
  quantity: number;
  measure: Measure;
}

interface PLUCode {
  code: string;
  category: string;
  commodity: string;
  variety: string;
  isRetailerAssigned: boolean;
}

interface IHint {
  pluCode: PLUCode;
  food: IFood;
  measures: Measure[];
}

interface NextLink {
  href: string;
  title: string;
}

interface Links {
  next: NextLink;
}

export interface IFoodParserResponse {
  status: number;
  data?: IFoodParser;
}
