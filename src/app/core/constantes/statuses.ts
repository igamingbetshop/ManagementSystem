export const BETSTATUSES = [
  { Id: 1, Name: "Uncalculated" },
  { Id: 2, Name: "Won" },
  { Id: 3, Name: "Lost" },
  { Id: 4, Name: "Deleted" },
  { Id: 5, Name: "CashoutedFully" },
  { Id: 6, Name: "Returned" },
  { Id: 7, Name: "NotAccepted" },
  { Id: 8, Name: "CashoutedPartially" },
  { Id: 9, Name: "Waiting" }
];

export const BETAVAILABLESTATUSES = [
  { Id: '1', Status: -1, Name: 'Common.All' },
  { Id: '2', Status: 0, Name: 'Common.Prematch' },
  { Id: '3', Status: 1, Name: 'Common.Live' }
];

export const MATCH_STATUSES_OPTIONS = [
  { Id: null, Name: 'All' },
  { Id: 0, Name: 'Prematch' },
  { Id: 1, Name: 'Live' }
];

export const AVAILABLEBETCATEGORIES = [
  { Id: 1, status: -1, Name: 'Dashboard.AllBets' },
  { id: 2, status: 0, Name: 'Reports.RealBets' },
  { id: 3, status: 1, Name: 'Reports.BonusBets' }
];

export const OPERATIONS = [
  { Id: 3, Name: 'Bet' },
  { Id: 4, Name: 'Win' },
  { Id: 8, Name: 'Bonus' },
  { Id: 45, Name: 'Charge Back' },
  { Id: 0, Name: 'Other' },
];

export const REGULARITY = [
  { Id: null, Name: "Select" },
  { Id: 1, Name: 'Daily', },
  { Id: 2, Name: 'Weekly', },
  { Id: 3, Name: 'Monthly', }
];

export const DAYS = [
  { Id: null, Name: "Select" },
  { Id: 1, Name: "Monday" },
  { Id: 2, Name: "Tuesday" },
  { Id: 3, Name: "Wednesday" },
  { Id: 4, Name: "Thursday" },
  { Id: 5, Name: "Friday" },
  { Id: 6, Name: "Saturday" },
  { Id: 0, Name: "Sunday" },
];

export const ACTIVITY_STATUSES = [
  { Id: 1, Name: 'Active' },
  { Id: 2, Name: 'Inactive' },
];

export const ENVIRONMENTS_STATUSES = [
  { Id: 1, Name: 'Production' },
  { Id: 2, Name: 'Staging' },
];

export const COUNTRY_STATUSES = [
  { Id: '1', Name: 'Common.BlockedForVisiting' },
  { Id: '2', Name: 'Common.BlockedForRegistration' },
  { Id: '3', Name: 'Common.HighRisk' }
];

export const MATCH_STATUSES = [
  { id: 1, status: 0, name: 'Prematch', Name: 'Prematch', },
  { id: 2, status: 1, name: 'Live', Name: 'Live' },
  { id: 3, status: 2, name: 'Finished', Name: 'Finished' },
  { id: 4, status: 3, name: 'Canceled', Name: 'Canceled' },
  { id: 5, status: 4, name: 'Deleted', Name: 'Deleted' },
  { id: 6, status: 5, name: 'Unknown', Name: 'Unknown' },
  { id: 7, status: 6, name: 'Resulted', Name: 'Resulted' }
];

export const SETTELMENT_STATUSES = [
  { Id: null, Name: 'None' },
  { Id: true, Name: 'Yes' },
  { Id: false, Name: 'No' },
]

export const RECEIVER_TYPES = [
  { Id: 2, Name: "Client" },
  { Id: 4, Name: "BetShop" },
  { Id: 10, Name: "User" },
  { Id: 90, Name: "Affiliate" },
];

export const NEWS_TYPES = [
  { Id: 0, Name: 'Sport' },
  { Id: 1, Name: 'Casino' },
  { Id: 2, Name: 'Live Casino' },
  { Id: 3, Name: 'Virtual Games' },
  { Id: 4, Name: 'Skill Games' },
]

export const CLIENT_BOUNUS_STATUSES = [
  { Id: 1, Name: 'Active' },
  { Id: 2, Name: 'Inactive' },
  { Id: 3, Name: 'Finished' },
  { Id: 4, Name: 'Closed' },
  { Id: 5, Name: 'Waiting' },
  { Id: 6, Name: 'Lost' },
  { Id: 7, Name: 'NotAwarded' },
  { Id: 8, Name: 'Expired' }
];

export const BET_SELECTION_STATUSES = [
  { Name: "Uncalculated", Id: 1 },
  { Name: "Won", Id: 2 },
  { Name: "Lost", Id: 3 },
  { Name: "Returned", Id: 4 },
  { Name: "PartiallyWon", Id: 5 },
  { Name: "PartiallyLost", Id: 6 }
];

export const DEVICE_TYPES = [
  { Id: 1, Name: "Desktop" },
  { Id: 2, Name: "Mobile" },
  { Id: -1, Name: "All" }
]


