export interface IMarketType {
    Id: number;
    Name: string;
    SportId: number;
    SportName: string;
    GroupIds: number[];
    CombinationalNumber: number;
    Enabled: boolean;
    Priority: number;
    Color: string;
    LineNumber: number;
    TranslationId: number;
    ValueType: any;
    DisplayType: number;
    IsForFilter: number;
    ResultTypeId: number;
    MatchPhaseId: number;
    SelectionsCount: number;
    SuccessOutcomeCount: number;
    PartnerSetting: any;
    Selections: any[] | null;
  }