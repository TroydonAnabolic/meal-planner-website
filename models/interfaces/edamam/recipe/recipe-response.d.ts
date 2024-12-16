import { IRecipeHit } from "../../recipe/recipe";

export interface IRecipeResponseData {
  from: number;
  to: number;
  count: number;
  _links: {
    next?: {
      href: string;
      title: string;
    };
  };
  hits: IRecipeHit[];
}

export interface IRecipeResponse {
  status: number;
  data?: IRecipeResponseData;
}
