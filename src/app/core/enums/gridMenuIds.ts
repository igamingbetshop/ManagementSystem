export enum GridMenuIds {
  // CORE
  REAL_TIME = 3,
  ALL_CLIENTS = 4,
  AFFILIATES = 5,
  USERS = 6,
  AGENTS = 206,
  DEPOSITS = 8,
  WITHDRAWALS = 9,
  PAYMENT_FORMS = 10,
  INTERNET = 12,
  BET_SHOPS = 13,
  COMMON = 15,
  TRIGGERS = 16,
  SEGMENTS = 17,
  PARTNERS = 18,
  CORE_PROVIDERS_PRODUCTS = 21,
  CORE_PROVIDERS_PAYMENTS = 22,
  PRODUCT_CATEGORIES = 25,
  BETSHOP_CALCULATION = 28,
  BETSHOP_STATES = 29,
  CORE_REPORT_BY_BET = 32,
  CORE_REPORT_BY_GAMES = 33,
  CORE_REPORT_BY_PROVIDERS = 34,
  CORE_REPORT_BY_DEPOSITE = 35,
  CORE_REPORT_BY_WITHRAWALS = 36,
  CORE_REPORT_BY_CLIENT = 37,
  CORE_REPORT_BY_CLIENT_EXCLUSIONS = 38,
  CORE_REPORT_BY_BOUNUSES = 39,
  CORE_REPORT_BY_CLIENT_CHANGES = 40,
  CORE_REPORT_BY_BETSHOPS_BETS = 42,
  CORE_REPORT_BY_BETSHOPS_PAYMENTS = 43,
  CORE_REPORT_BY_BETSHOPS_SHIFTS = 44,
  CORE_REPORT_BY_BETSHOPS = 45,
  CORE_REPORT_BY_BETSHOPS_GAMES = 46,
  CORE_REPORT_BY_USER_TRANSACTIONS = 48,
  CORE_REPORT_BY_AGENTS_TRANSACTIONS = 49,
  CORE_REPORT_BY_AGENTS = 210,
  CORE_REPORT_BY_BUISNEES_INTELIGANCE_PROVIDERS = 51,
  CORE_REPORT_BY_BUISNEES_INTELIGANCE_PARTNERS = 52,
  CORE_REPORT_BY_CLIENT_IDENTITY = 53,
  CORE_REPORT_BY_BUISNEES_INTELIGANCE_PRODUCTS = 54,
  CORE_REPORT_BY_BUISNEES_INTELIGANCE_CORRECTIONS = 55,
  CORE_REPORT_BY_BUISNEES_INTELIGANCE_PAYMENT_SYSTEMS = 56,
  CORE_REPORT_BY_USER_LOGS = 58,
  CORE_REPORT_BY_SESSIONS = 59,
  CORE_REPORT_BY_LOGS = 60,
  CORE_REPORT_BY_JOB_LOGS = 272,
  CORE_REPORT_BY_ACOUNTING_DEPOSIT = 62,
  CORE_REPORT_BY_ACOUNTING_WITHRAWAL = 63,
  CORE_ROLES = 64,
  CORE_TICKETS = 66,
  CORE_EMAILES = 67,
  CORE_EMAIL_CLIENTS = 249,
  CORE_EMAIL_AGENTS = 250,
  CORE_EMAIL_AFFILIATES = 251,
  CORE_PARTNER_EMAILES = 174,
  CORE_SMSES = 68,
  CORE_ANNOUNCMENTS = 69,
  CORE_CURRENCIES = 70,
  CORE_REPORT_BY_DOCS = 173,
  CORE_CRM_SETTINGS = 72,
  CORE_CRM_TAMPLATES = 73,
  CORE_BANERS = 75,
  CORE_PROMOTIONS = 76,
  CORE_REGIONS = 77,
  CORE_COMMENT_TYPES = 78,
  CORE_JOBE_AREAS = 79,
  CORE_ENUMERATIONS = 81,
  CORE_SECURITY_QUESTIONS = 82,
  CORE_GAMIFICATION = 176,
  CORE_REPORT_BY_CLIENT_GAMES = 197,
  CORE_POPUPS = 203,
  CORE_REPORT_BY_CLIENT_DUPLICATES = 240,
  CORE_JAKPOT = 257,
  CORE_REPORT_BY_USER_CORRECTIONS = 277,
  CORE_REPORT_BY_AGENTS_CORRECTIONS = 278,

  // CLIENTS NESTED
  CLIENTS_DEPOSITSs = 178,
  CLIENTS_WITHDRAWALS = 179,
  CLIENTS_BETS = 180,
  CLIENTS_CAMPAGINS = 181,
  CLIENTS_ACCOUNT_HISTORY = 182,
  CLIENTS_TRANSACTIONS = 183,
  CLIENTS_SESSIONS = 184,
  CLIENTS_NOTES = 185,
  CLIENTS_KYC = 186,
  CLIENTS_PRODUCT_LIMITS = 187,
  CLIENTS_PAYMENT_SETTINGS = 188,
  CLIENTS_PAYMENT_INFO = 189,
  CLIENTS_TICKETS = 190,
  CLIENTS_FRIENDS = 191,
  CLIENTS_SETTINGS = 192,
  CLIENTS_LIMITS_AND_EXCLUSIONS = 193,
  CLIENTS_EMAILS = 194,
  CLIENTS_SMS = 195,
  CLIENTS_PROVIDER_SETTINGS = 196,
  CLIENTS_DUPLICATES = 241,
  CLIENTS_SEGMENTS = 248,

  // Partner nested
  PARTNERS_MAIN = 259,
  PARTNERS_SETTINGS = 260,
  PARTNERS_PRODUCTS_SETTINGS = 261,
  PARTNERS_CURRENCY_SETTINGS = 262,
  PARTNERS_LANGUAGE_SETTINGS = 263,
  PARTNERS_PROVIDER_SETTINGS = 264,
  PARTNERS_PRODUCT_LIMITS = 265,
  PARTNERS_PAYMENT_LIMITS = 266,
  PARTNERS_COMPLIMENTARY_POINTS = 267,
  PARTNERS_PAYMENT_INFO = 268,
  PARTNERS_COUNTRY_SETTINGS = 269,
  PARTNERS_KEYS = 271,
  // SPORTSBOOK
  SP_SPORTS = 84,
  SP_REGIONS = 85,
  SP_COMPETITON_TEMPLATES = 86,
  SP_COMPETITONS_ALL = 88,
  SP_COMPETITONS_FAVORITES = 89,
  SP_TEAMS = 90,
  SP_MARKET_TYPES_GROUP = 91,
  MARKET_TYPES = 92,
  SP_MATCHES_ACTIVE = 94,
  SP_MATCHES_FINISHED = 96,

  SP_MAPPINGS_SPORTS = 98,
  SP_MAPPINGS_REGIONS = 99,
  SP_MAPPINGS_COMPETITIONS = 100,
  SP_MAPPINGS_TEAMS = 101,
  SP_MAPPINGS_MARKET_TYPES = 102,
  SP_MAPPINGS_PHASES = 103,
  SP_MAPPINGS_RESULT_TYPES = 104,

  SP_PARTNERS = 105,
  SP_TEASERS = 108,
  SP_PLAYER_CATEGORIES = 106,
  SP_PLAYERS = 107,
  SP_COMMENT_TYPES = 113,
  SP_BET_SHOPS = 114,
  REPORT_BY_BETS = 117,
  SP_REPORT_BY_NOT_ACCEPTED_BETS = 118,
  SP_REPORT_BY_LIMITES = 119,
  SP_REPORT_BY_MATCHES = 120,
  SP_REPORT_BY_RESULTS = 121,
  SP_REPORT_BY_PLAYERS = 172,
  SP_REPORT_BY_SELECTION_CHANGES = 123,
  SP_REPORT_BY_SESSIONS = 124,
  SP_BANERS = 127,
  SP_CURRENCIES = 129,
  SP_PERMISSIBLE_ODDSS = 130,
  SP_COINS = 131,
  SP_BOUNUS_SETTINGS = 110,
  SP_MULTIPLE_BOUNUSES = 111,
  SP_MULTIPLE_CASHBACK_BOUNUSES = 112,
  SP_REPORT_BY_SPORTS = 175,
  SP_RESULT_TYPES = 200,
  SP_REPORT_BY_BOUNUSES = 205,

  SP_COMPETITON_TEMPLATES_MARKETS = 202,
  SP_JACKPOT = 250,
  SP_REPORT_BY_PLAYER_LIMITS = 258,
  //POOL BETTING
  POOL_BETTING = 198,
  PB_MATCHES = 0, // TODO add number
  PB_BANERS = 237,

  VG_GAMES = 133,
  VG_PLAYERS = 134,
  VG_PLATERS_CATEGORIES = 135,
  VG_USERS = 136,
  VG_PARTNERS = 137,
  VG_MARKET_TYPES = 138,
  VG_BET_SHOPS = 139,
  VG_REPORTS_BY_BETS = 141,
  VG_REPORTS_BY_RESULTS = 142,
  VG_CURRENCIES = 143,
  VG_CMS_BANNERS = 146,

  SG_PLAYERS = 148,
  SG_PARTNERS = 149,
  SG_CASH_TABLES_ACTIVE = 152,
  SG_CASH_TABLES_FINISHED = 153,
  SG_TOURNUMENT_ACTIVE = 155,
  SG_TOURNUMENT_FINISHED = 156,
  SG_CURRENCIES =  159,
}
