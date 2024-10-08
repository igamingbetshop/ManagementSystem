export interface User {
    Id: number;
    PartnerId: number;
    Password: string | null;
    FirstName: string;
    LastName: string;
    Gender: number;
    LanguageId: string;
    UserName: string;
    NickName: string;
    MobileNumber: string | null;
    State: number;
    Type: number;
    CurrencyId: string;
    Email: string | null;
    ParentId: number;
    CreationTime: string;
    LastUpdateTime: string;
    ClientCount: number | null;
    Accounts: UserAccount[];
    Configurations: UserConfiguration[];
    Level: number;
    OddsType: string | null;
    UserRoles: string | null;
    TotalBetAmount: number;
    TotalWinAmount: number;
    TotalGGR: number;
    TotalTurnoverProfit: number;
    TotalGGRProfit: number;
    Phone: string | null;
    UserNamePrefix: string | null;
    CloningUserName: string | null;
    Fax: string | null;
    IsTwoFactorEnabled: boolean;
    ParentState: number | null;
    Closed: boolean | null;
    LastLogin: string | null;
    LoginIp: string | null;
    DirectClientCount: number | null;
    Balance: number | null;
    Count: number | null;
    DirectBetAmount: number;
    DirectWinAmount: number;
    DirectGGR: number;
    DirectTurnoverProfit: number;
    DirectGGRProfit: number;
    ViewBetsAndForecast: boolean | null;
    ViewReport: boolean | null;
    ViewBetsLists: boolean | null;
    ViewTransfer: boolean | null;
    ViewLog: boolean | null;
    MemberInformationPermission: boolean | null
    CalculationPeriod: string | null;   
    AllowAutoPT: boolean | null;  
    AllowParentAutoPT: boolean | null;  
    AllowOutright: boolean | null;
    AllowParentOutright: boolean | null;
    AllowDoubleCommission: boolean | null;    
    AllowParentDoubleCommission: boolean | null
    MaxCredit: number | null;     
    LevelLimits: number | null;   
    CountLimits: number | null;   
    Commissions: number | null;   
    PositionTakings: number | null;     
    CommissionPlan: string | null;
    Path: string;     
  }
  
  export interface UserAccount {
    Id: number; 
    TypeId: number;   
    Balance: number;  
    CurrencyId: string;     
  }
  
  export interface UserConfiguration {
    Id: number; 
    UserId: number;   
    CreatedBy: number;
    Name: string;     
    BooleanValue: boolean | null; 
    NumericValue: number | null;  
    StringValue: string | null;   
    CreationTime: string;   
    LastUpdateTime: string; 
  }
  