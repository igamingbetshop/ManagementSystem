export const categories = localStorage.getItem("adminmenu")
// {
//   CorePlatform: {
//     Icon: "games", Pages: [
//       {Name: 'Dashboard.Dashboard', Icon: "dashboard", RedirectUrl: '/main/platform/dashboard'},
//       {Name: 'RealTime.RealTime', Icon: "access_time" ,RedirectUrl: '/main/platform/real-time'},
//       {Name: 'Clients.Clients', Icon: "people", RedirectUrl: '/main/platform/clients/all-clients'},
//       {Name: 'Providers.Affilates', Icon: "handshake", RedirectUrl: '/main/platform/affiliates/all-affiliates'},
//       {Name: 'Users.Users&Agents', Icon: "supervisor_account", RedirectUrl: '/main/platform/users/all-users'},

//       {
//         Name: 'Payments.Payments', Icon: "payment", NestedData: [
//           {Name: 'Payments.Deposits', Icon: "save_alt", RedirectUrl: '/main/platform/payments/deposits'},
//           {Name: 'Payments.Withdrawals', Icon: "unarchive", RedirectUrl: '/main/platform/payments/withdrawals'},
//           {Name: 'Payments.PaymentForms', Icon: "feed", RedirectUrl: '/main/platform/payments/payment-forms'},
//         ]
//       },
//       {
//         Name: 'Bets.Bets', Icon: "casino", NestedData: [
//           {Name: 'Dashboard.Internet', Icon: "router", RedirectUrl: '/main/platform/bets/internet'},
//           {Name: 'BetShops.BetShops', Icon: "production_quantity_limits", RedirectUrl: '/main/platform/bets/bet-bet-shops'},
//         ]
//       },
//       {
//         Name: 'Dashboard.Bonuses', Icon: "comment_bank", NestedData: [
//           {Name: 'Bonuses.Common', Icon: "aspect_ratio", RedirectUrl: '/main/platform/bonuses/commonses'},
//           {Name: 'Bonuses.Triggers', Icon: "change_circle", RedirectUrl: '/main/platform/bonuses/triggers'},
//         ]
//       },
//       // {Name: 'ClientCategories.ClientCategories', Icon: "supervisor_account", RedirectUrl: '/main/platform/clients-categories'},
//       {Name: 'Segments.Segments', Icon: "badge", RedirectUrl: '/main/platform/segments/all-segments'},
//       {Name: 'Partners.Partners', Icon: "dashboard", RedirectUrl: '/main/platform/partners/all-partners'},
//       {
//         Name: 'BetShops.BetShops', Icon: "shopping_cart", DynamicLabelName: 'bet-shops',
//         RedirectUrlEdit: '/main/platform/bet-shops-edit', NestedData: [
//           {Name: '...'},
//         ]
//       },
//       {
//         Name: 'Providers.Providers', Icon: "assignment_ind", NestedData: [
//           {Name: 'Products.Products', Icon: "inventory_2", RedirectUrl: '/main/platform/providers/all-providers'},
//           {Name: 'Providers.Payments', Icon: "credit_card", RedirectUrl: '/main/platform/providers/payment-systems'},
//           {Name: 'Providers.Affilates', Icon: "handshake", RedirectUrl: '/main/platform/providers/affiliates' },
//           {Name: 'Providers.Notifications', Icon: "notifications", RedirectUrl: '/main/platform/providers/notifications'  },
//         ]
//       },
//       {Name: 'ProductCategories.ProductCategories', Icon: "category", RedirectUrl: '/main/platform/product-categories'},
//       {
//         Name: 'Products.Products', Icon: "hub", DynamicLabelName: 'products',
//         RedirectUrlEdit: '/main/platform/product-edit',  NestedData: [
//           {Name: '...............', Icon: 'sync'},
//           {Name: '...............', Icon: 'sync'},
//           {Name: '...............', Icon: 'sync'},
//           {Name: '...............', Icon: 'sync'},
//           {Name: '...............', Icon: 'sync'},
//           {Name: '...............', Icon: 'sync'},
//           {Name: '...............', Icon: 'sync'},
//           {Name: '...............', Icon: 'sync'},
//           {Name: '...............', Icon: 'sync'},
//           {Name: '...............', Icon: 'sync'},
//           {Name: '...............', Icon: 'sync'},
//           {Name: '...............', Icon: 'sync'},
//         ]
//       },
//       {
//         Name: 'Accounting.Accounting', Icon: "account_box", NestedData: [
//           {Name: 'Accounting.BetShopCalculation', Icon: "calculate", RedirectUrl: '/main/platform/accounting/betshop-calculation'},
//           {Name: 'Accounting.BetShopStates', Icon: "schema", RedirectUrl: '/main/platform/accounting/betshop-states'}
//         ]
//       },
//       {
//         Name: 'Reports.Reports', Icon: "report", NestedData: [
//           {
//             Name: 'Reports.InternetClients', Icon: "business_center", NestedData: [
//               {Name: 'Reports.ReportByBets', Icon: "casino", RedirectUrl: '/main/platform/reports/internet-clients/report-by-bets'},
//               {Name: 'Reports.ReportByGames', Icon: "casino", RedirectUrl: '/main/platform/reports/internet-clients/report-by-games'},
//               {Name: 'Reports.ReportByProviders', Icon: "casino", RedirectUrl: '/main/platform/reports/internet-clients/report-by-providers'},
//               {Name: 'Reports.ReportByDeposit', Icon: "casino", RedirectUrl: '/main/platform/reports/internet-clients/report-by-deposit'},
//               {Name: 'Reports.ReportByWithdrawal', Icon: "casino", RedirectUrl: '/main/platform/reports/internet-clients/report-by-withdrawal'},
//               {Name: 'Reports.ReportByClient', Icon: "casino", RedirectUrl: '/main/platform/reports/internet-clients/report-by-client'},
//               {Name: 'Reports.ReportByClientExclusions', Icon: "casino", RedirectUrl: '/main/platform/reports/internet-clients/report-by-client-exclusions'},
//               {Name: 'Reports.ReportByBonuses', Icon: "casino", RedirectUrl: '/main/platform/reports/internet-clients/report-by-bonuses'},
//               {Name: 'Reports.ReportByClientChanges', Icon: "casino", RedirectUrl: '/main/platform/reports/internet-clients/report-by-client-changes'}
//             ]
//           },
//           {
//             Name: 'BetShops.BetShops', Icon: "next_week", NestedData: [
//               {Name: 'Reports.ReportByBets', Icon: "manage_history", RedirectUrl: '/main/platform/reports/betshops/report-by-bets'},
//               {Name: 'Reports.ReportByPayments', Icon: "manage_history", RedirectUrl: '/main/platform/reports/betshops/report-by-payments'},
//               {Name: 'Reports.ReportByShifts', Icon: "manage_history", RedirectUrl: '/main/platform/reports/betshops/report-by-shifts'},
//               {Name: 'Reports.ReportByBetshops', Icon: "manage_history", RedirectUrl: '/main/platform/reports/betshops/report-by-betshops'},
//               {Name: 'Reports.ReportByGames', Icon: "manage_history", RedirectUrl: '/main/platform/reports/betshops/report-by-betshop-game'}
//             ]
//           },
//           {
//             Name: 'Users.Users&Agents', Icon: "next_week", NestedData: [

//               {Name: 'Reports.ReportByUserTransactions', Icon: "manage_history", RedirectUrl: '/main/platform/reports/users-and-agents/report-by-user-transactions'},
//               {Name: 'Reports.ReportByAgentTransfers', Icon: "manage_history", RedirectUrl: '/main/platform/reports/users-and-agents/report-by-agent-transactions'},
//             ]
//           },
//           {
//             Name: 'Reports.BusinessIntelligence', Icon: "next_week", NestedData: [
//               {Name: 'Reports.ReportByProviders', Icon: "manage_history", RedirectUrl: '/main/platform/reports/business-intelligence/report-by-providers'},
//               {Name: 'Reports.ReportByPartners', Icon: "manage_history", RedirectUrl: '/main/platform/reports/business-intelligence/report-by-partners'},
//               {Name: 'Reports.ReportByClientIdentity', Icon: "manage_history", RedirectUrl: '/main/platform/reports/business-intelligence/report-by-client-identity'},
//               {Name: 'Reports.ReportByProducts', Icon: "manage_history", RedirectUrl: '/main/platform/reports/business-intelligence/report-by-products'},
//               {Name: 'Reports.ReportByCorrections', Icon: "manage_history", RedirectUrl: '/main/platform/reports/business-intelligence/report-by-corrections'},
//               {Name: 'Reports.ReportByPaymentSystem', Icon: "manage_history", RedirectUrl: '/main/platform/reports/business-intelligence/report-by-payment-system'},
//             ]
//           },
//           {
//             Name: 'Reports.BusinessAudit', Icon: "next_week", NestedData: [
//               {Name: 'Reports.ReportByUserLogs', Icon: "manage_history", RedirectUrl: '/main/platform/reports/business-audit/report-by-user-logs'},
//               {Name: 'Reports.ReportBySessions', Icon: "manage_history", RedirectUrl: '/main/platform/reports/business-audit/report-by-sessions'},
//               {Name: 'Reports.ReportByLogs', Icon: "manage_history", RedirectUrl: '/main/platform/reports/business-audit/report-by-logs'}
//             ]
//           },
//           {
//             Name: 'Accounting.Accounting', Icon: "next_week", NestedData: [
//               {Name: 'Reports.ReportByDeposit', Icon: "manage_history", RedirectUrl: '/main/platform/reports/accounting/report-by-deposit'},
//               {Name: 'Reports.ReportByWithdrawal', Icon: "manage_history", RedirectUrl: '/main/platform/reports/accounting/report-by-withdrawal'}
//             ]
//           }
//         ]
//       },
//       {Name: 'Roles.Roles', Icon: "settings_accessibility", RedirectUrl: '/main/platform/roles/all-roles'},
//       {
//         Name: 'Notifications.Notifications', Icon: "notification_important", NestedData: [
//           {Name: 'Notifications.Tickets', Icon: "description", RedirectUrl: '/main/platform/notifications/tickets'},
//           {Name: 'Notifications.Emailes', Icon: "mark_email_read", RedirectUrl: '/main/platform/notifications/emails'},
//           {Name: 'Notifications.Smses', Icon: "sms", RedirectUrl: '/main/platform/notifications/smses'},
//           {Name: 'Notifications.Announcements', Icon: "announcement", RedirectUrl: '/main/platform/notifications/announcements'}
//         ]
//       },
//       {Name: 'Currencies.Currencies', Icon: "dashboard", RedirectUrl: '/main/platform/currencies/all-currencies'},
//       {
//         Name: 'Crm.Crm', Icon: "settings_applications", NestedData: [
//           {Name: 'Crm.Settings', Icon: "settings", RedirectUrl: '/main/platform/crm/settings'},
//           {Name: 'Crm.Templates', Icon: "settings_input_composite", RedirectUrl: '/main/platform/crm/templates'}
//         ]
//       },
//       {
//         Name: 'Cms.Cms', Icon: "settings_applications", NestedData: [
//           {Name: 'Cms.Banners', Icon: "ad_units", RedirectUrl: '/main/platform/cms/banners'},
//           {Name: 'Cms.Promotions', Icon: "inventory", RedirectUrl: '/main/platform/cms/promotions'},
//           {Name: 'Cms.Regions', Icon: "gps_fixed", RedirectUrl: '/main/platform/cms/regions'},
//           {Name: 'Cms.CommentTypes', Icon: "touch_app", RedirectUrl: '/main/platform/cms/comment-types'},
//           {Name: 'Cms.JobAreas', Icon: "work_history", RedirectUrl: '/main/platform/cms/job-areas'},
//           {Name: 'Cms.Translations', Icon: "translate", RedirectUrl: '/main/platform/cms/translations'},
//           {Name: 'Cms.Enumerations', Icon: "edit_note", RedirectUrl: '/main/platform/cms/enumerations'},
//           {Name: 'Cms.SecurityQuestions', Icon: "security", RedirectUrl: '/main/platform/cms/security-questions'}
//         ]
//       },
//     ]
//   },
//   Sportsbook: {
//     Icon: "sports_soccer", Pages: [
//       {Name: 'Sport.Sports', Icon: "sports_score", RedirectUrl: '/main/sportsbook/sports'},
//       {Name: 'Sport.Regions', Icon: "gps_fixed", RedirectUrl: '/main/sportsbook/regions'},
//       {Name: 'Sport.CompetitionTemplates', Icon: "reviews", RedirectUrl: '/main/sportsbook/competitions-categories'},
//       {
//         Name: 'Sport.Competitions', Icon: "account_box", NestedData: [
//           {Name: 'Common.All', Icon: "psychology", RedirectUrl: '/main/sportsbook/competitions'},
//           {Name: 'Sport.Favorites', Icon: "quickreply", RedirectUrl: '/main/sportsbook/competitions/favorites'},

//         ]
//       },
//       {Name: 'Sport.Teams', Icon: "groups", RedirectUrl: '/main/sportsbook/teams'},
//       {Name: 'Sport.MarketTypesGroup', Icon: "add_business", RedirectUrl: '/main/sportsbook/market-types-group'},
//       {Name: 'Sport.MarketTypes', Icon: "store", RedirectUrl: '/main/sportsbook/market-types'},
//       {
//         Name: 'Sport.Matches', Icon: "join_left", NestedData: [
//           {Name: 'Bonuses.Active', Icon: "sensors", RedirectUrl: '/main/sportsbook/matches/active-matches/all-active'},
//           {Name: 'Sport.Favorites', Icon: "quickreply", RedirectUrl: '/main/sportsbook/matches/favorites'},
//           {Name: 'Sport.Finished', Icon: "done_all", RedirectUrl: '/main/sportsbook/matches/finished/all-finished'}
//         ]
//       },
//       {
//         Name: 'Sport.Mappings', Icon: "explore", NestedData: [
//           {Name: 'Sport.Sports', Icon: "sports_score", RedirectUrl: '/main/sportsbook/mappings/sports'},
//           {Name: 'Sport.Regions', Icon: "gps_fixed", RedirectUrl: '/main/sportsbook/mappings/regions'},
//           {Name: 'Sport.Competitions', Icon: "account_box", RedirectUrl: '/main/sportsbook/mappings/competitions'},
//           {Name: 'Sport.Teams', Icon: "groups", RedirectUrl: '/main/sportsbook/mappings/teams'},
//           {Name: 'Sport.MarketTypes', Icon: "store", RedirectUrl: '/main/sportsbook/mappings/market-types'},
//           {Name: 'Sport.Phases', Icon: "swap_horizontal_circle", RedirectUrl: '/main/sportsbook/mappings/phases'},
//           {Name: 'Sport.ResultTypes', Icon: "open_with", RedirectUrl: '/main/sportsbook/mappings/result-types'}
//         ]
//       },
//       {Name: 'Sport.Partners', Icon: "people_outline", RedirectUrl: '/main/sportsbook/partners'},
//       {Name: 'VirtualGames.PlayerCategories', Icon: "settings_input_antenna", RedirectUrl: '/main/sportsbook/players-categories'},
//       {Name: 'Dashboard.Players', Icon: "settings_accessibility", RedirectUrl: '/main/sportsbook/players'},
//       {Name: 'Sport.Teasers', Icon: "add_business", RedirectUrl: '/main/sportsbook/teasers'},
//       {
//         Name: 'Dashboard.Bonuses', Icon: "assessment", NestedData: [
//           {Name: 'Sport.BonusSettings', Icon: "assessment", RedirectUrl: '/main/sportsbook/bonuses/bonus-settings'},
//           {Name: 'Sport.MultipleBonuses', Icon: "library_add_check", RedirectUrl: '/main/sportsbook/bonuses/multiple-bonuses'},
//           {Name: 'Sport.MultipleCashbackBonuses', Icon: "account_balance_wallet", RedirectUrl: '/main/sportsbook/bonuses/multiple-cashback-bonuses'}
//         ]
//       },
//       {Name: 'Cms.CommentTypes', Icon: "touch_app", RedirectUrl: '/main/sportsbook/comment-types'},
//       {Name: 'BetShops.BetShops', Icon: "production_quantity_limits", RedirectUrl: '/main/sportsbook/bet-shops'},
//       {
//         Name: 'Reports.Reports', Icon: "support", NestedData: [
//           {
//             Name: 'Reports.BusinessIntelligence', Icon: "business_center", NestedData: [
//               {Name: 'Reports.ReportByBets', Icon: "casino", RedirectUrl: '/main/sportsbook/business-intelligence/by-bets'},
//               {Name: 'Reports.ReportByNotAcceptedBets', Icon: "report_off", RedirectUrl: '/main/sportsbook/business-intelligence/by-bets-not-accepted'},
//               {Name: 'Reports.ReportByLimits', Icon: "auto_graph", RedirectUrl: '/main/sportsbook/business-intelligence/by-limits'},
//               {Name: 'Reports.ReportByMatches', Icon: "join_left", RedirectUrl: '/main/sportsbook/business-intelligence/by-matches'},
//               {Name: 'Reports.Results', Icon: "settings_accessibility", RedirectUrl: '/main/sportsbook/business-intelligence/results'},
//             ]
//           },
//           {
//             Name: 'Reports.BusinessAudit', Icon: "next_week", NestedData: [
//               {Name: 'Reports.ReportBySelectionChange', Icon: "manage_history", RedirectUrl: '/main/sportsbook/business-audit/change-history'},
//               {Name: 'Reports.ReportBySessions', Icon: "report", RedirectUrl: '/main/sportsbook/business-audit/by-sessions'}
//             ]
//           },
//         ]
//       },
//       {
//         Name: 'Cms.Cms', Icon: "pending", NestedData: [
//           {Name: 'Settings.Translations', Icon: "translate", RedirectUrl: '/main/sportsbook/cms/translations'},
//           {Name: 'Cms.Banners', Icon: "ad_units", RedirectUrl: '/main/sportsbook/cms/banners'}
//         ]
//       },
//       {
//         Name: 'Bonuses.Common', Icon: "category", NestedData: [
//           {Name: 'Currencies.Currencies', Icon: "currency_exchange", RedirectUrl: '/main/sportsbook/common/currencies'},
//           {Name: 'Sport.PermissibleOdds', Icon: "smart_toy", RedirectUrl: '/main/sportsbook/common/permissible-odds'},
//           {Name: 'Common.Coins', Icon: "toll", RedirectUrl: '/main/sportsbook/common/coins'},
//         ]
//       },
//     ]
//   },
//   VirtualGames: {
//     Icon: "sports_esports", Pages: [
//       {Name: 'VirtualGames.Games', Icon: "dashboard", RedirectUrl: '/main/virtualGames/games'},
//       {Name: 'Dashboard.Players', Icon: "settings_accessibility", RedirectUrl: '/main/virtualGames/players/all-players'},
//       {Name: 'VirtualGames.PlayerCategories', Icon: "settings_input_antenna", RedirectUrl: '/main/virtualGames/player-categories'},
//       {Name: 'Users.Users', Icon: "supervisor_account", RedirectUrl: '/main/virtualGames/users/all-users'},
//       {Name: 'Partners.Partners', Icon: "people_outline", RedirectUrl: '/main/virtualGames/partners/all-partners'},
//       {Name: 'Sport.MarketTypes', Icon: "store", RedirectUrl: '/main/virtualGames/market-types'},
//       {Name: 'BetShops.BetShops', Icon: "casino", RedirectUrl: '/main/virtualGames/bet-shops'},
//       {
//         Name: 'Reports.Reports', Icon: "support", NestedData: [
//           {Name: 'Reports.ReportByBet', Icon: "casino", RedirectUrl: '/main/virtualGames/reports/report-by-bet'},
//           {Name: 'ReportsResults', Icon: "equalizer", RedirectUrl: '/main/virtualGames/reports/results'}
//         ]
//       },
//       {Name: 'Reports.Currencies', Icon: "paid", RedirectUrl: '/main/virtualGames/currencies'},
//       {
//         Name: 'Cms.Cms', Icon: "pending", NestedData: [
//           {Name: 'Cms.Translations', Icon: "translate", RedirectUrl: '/main/virtualGames/cms/translations'},
//           {Name: 'Cms.Banners', Icon: "ad_units", RedirectUrl: '/main/virtualGames/cms/banners'}
//         ]
//       },
//     ]
//   },
//   SkillGames: {
//     Icon: "casino", Pages: [
//       {Name: 'Dashboard.Players', Icon: "settings_accessibility", RedirectUrl: '/main/skillGames/players'},
//       {Name: 'Partners.Partners', Icon: "people_outline", RedirectUrl: '/main/skillGames/partners/all-partners'},
//       {Name: 'Users.Users', Icon: "supervisor_account", RedirectUrl: '/main/skillGames/users/all-users'},
//       {
//         Name: 'SkillGames.CashTables', Icon: "support", NestedData: [
//           {Name: 'Bonuses.Active', Icon: "supervisor_account", RedirectUrl: '/main/skillGames/cash-tables/active-cash-tables'},
//           {Name: 'Sport.Finished', Icon: "supervisor_account", RedirectUrl: '/main/skillGames/cash-tables/finished-cash-tables'},
//         ]
//       },
//       {
//         Name: 'SkillGames.Tournaments', Icon: "support", NestedData: [
//           {Name: 'Bonuses.Active', Icon: "supervisor_account", RedirectUrl: '/main/skillGames/tournaments/active-tournaments'},
//           {Name: 'Sport.Finished', Icon: "supervisor_account", RedirectUrl: '/main/skillGames/tournaments/finished-tournaments'},
//         ]
//       },
//       {
//         Name: 'Reports.Reports', Icon: "support", NestedData: [
//           {Name: 'Reports.ReportByLogs', Icon: "casino", RedirectUrl: '/main/skillGames/reports/report-by-log'},
//         ]
//       },
//       {Name: 'Currencies.Currencies', Icon: "paid", RedirectUrl: '/main/skillGames/currencies'},
//       {
//         Name: 'Cms.Cms', Icon: "pending", NestedData: [
//           {Name: 'Cms.Translations', Icon: "translate", RedirectUrl: '/main/skillGames/cms/translations'},
//           {Name: 'Cms.Banners', Icon: "ad_units", RedirectUrl: '/main/skillGames/cms/banners'}
//         ]
//       },
//     ]
//   },
//   Settings: {
//     Icon: "settings.Settings", Pages: [
//       {Name: 'Settings.Translations', Icon: "translate", RedirectUrl: '/main/settings/translations'},
//     ]
//   },
//   Help: {
//     Icon: "help", Pages: [
//       {Name: 'Home.CorePlatform', Icon: "help"},
//       {Name: 'Home.Sportsbook', Icon: "help"},
//       {Name: 'Home.VirtualGames', Icon: "help"},
//       {Name: 'Home.SkillGames', Icon: "help"},
//     ]
//   }
// }

