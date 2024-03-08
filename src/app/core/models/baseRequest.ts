export class Request {
  Controller: string;
  Method: string;
  RequestObject: any;
  ClientId: number;
  Token: string;
  Loading: boolean;
}

export interface Category {
  Id: number
  Name: string;
  Level: number;
  RedirectUrl?: string;
  RedirectUrlEdit?: string;
  ApiRequest: string | null;
  Pages?: any[];
  isDynamic? : boolean;
  PartnerId?: number;
  ParentId?: number;
  DynamicLabelName?: string;
  isNestedDynamic? : boolean;
  Icon?: string,
  Path: string,
  Route: string
}

export interface Categories {
  CorePlatform: CategoryData;
  Sportsbook: CategoryData;
  VirtualGames: CategoryData;
  SkillGames: CategoryData;
  Settings: CategoryData;
  Help: CategoryData;
}

export interface CategoryData {
  Icon: string,
  Pages: Category[],
  Name: string,
  Color: string,

}


