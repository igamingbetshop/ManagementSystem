export interface PlayerCategories {
  Color: string;
  DelayBetweenBetsLive: number;
  DelayBetweenBetsPrematch: number;
  DelayPercentLive: number;
  DelayPercentPrematch: number;
  Id: number;
  LimitPercent: number;
  MaxOddLive: number;
  MaxOddPrematch: number;
  Name: string;
}

export interface Competitions {
  Id: number;
  SportId: number;
  Name: string;
  Color: string;
  AbsoluteLimit: number
}
