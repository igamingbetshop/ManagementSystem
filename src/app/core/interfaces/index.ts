export interface RouteTabItem {
    label: string;
    route: string;
}

export interface Client {
    CategoryName: any;
    Address: string;
    Apartment: string
    BetShopId: number
    BirthDate: any;
    BuildingNumber: number;
    CallToPhone: boolean;
    CategoryId: number;
    Citizenship: string;
    CityId: number;
    City: string;
    CountryId: number;
    CreationTime: string;
    CurrencyId: string;
    DocumentIssuedBy: string;
    DocumentNumber: string;
    DocumentType: number;
    Email: string;
    FirstDepositDate: string;
    FirstName: string;
    Gender: number;
    HasNote: boolean;
    Id: number;
    Info: string;
    IsDocumentVerified: boolean;
    IsEmailVerified: boolean;
    IsMobileNumberVerified: boolean;
    JobArea: number;
    LanguageId: string;
    LastDepositAmount: number;
    LastDepositDate: string;
    LastName: string;
    LastUpdateTime: string;
    MobileNumber: string;
    NickName: string;
    PartnerId: number;
    PhoneNumber: string;
    RegionId: number;
    RegistrationIp: string;
    SecondName: string;
    SecondSurname: string;
    SendMail: boolean;
    SendPromotions: boolean;
    SendSms: boolean;
    State: number;
    StateName: string;
    UserId: number;
    UserName: string;
    ZipCode: string;
    PartnerName: string;
    LanguageName: string;
    CountryName: string;
    PromoCode: string;
    CityName: string;
    ClientStateName: string;
    AffiliatePlatformId: string | number;
    AffiliateId: number;
    JobAreaName: string;
    CitizenshipName: string;
    Comment: string;
    GenderName: string;
    DistrictId: string | number;
    TownId: string | number;
    ReferralType: null | number;
    USSDPin: string | null | number;
    LastSessionDate: string | null | number;
    Age: string | null | number;
    RefId: string;
    RegionIsoCode: string | null | number;
    UnderMonitoringTypes: [],
    UnderMonitoringTypesNames: string
    CharacterName: string;
    CharacterId: string | number;
    CharacterLevel: string | number;
    PinCode: string | number | null;
}


