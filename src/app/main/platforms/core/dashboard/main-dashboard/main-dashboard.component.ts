import { Component } from '@angular/core';
import { CommonDataService, ConfigService } from "../../../../../core/services";
import { CoreApiService } from "../../services/core-api.service";
import { Controllers, Methods } from "../../../../../core/enums";
import { take } from "rxjs/operators";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import {Chart, ChartModule} from "angular-highcharts";
import { DateTimeHelper } from "../../../../../core/helpers/datetime.helper";
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {CommonModule, DatePipe} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CollapseDirective} from "../../../../../core/directives/collapse.directive";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {HeaderFilterComponent} from "../../../../components/header-filter/header-filter.component";
import * as Highcharts from "highcharts";

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    TranslateModule,
    ChartModule,
    MatProgressSpinnerModule,
    CollapseDirective,
    MatCheckboxModule,
    HeaderFilterComponent
  ],
  providers: [DatePipe]
})
export class MainDashboardComponent {
  allSelected = false;
  public selectedItem = 'week';
  public selectedGrid = 0;
  public fromDate = new Date();
  public toDate = new Date();
  public filteredData;
  public options:any;
  public partners = [];
  public partnerId;
  public betsInfo;
  public deposits = [];
  public depositsGroupedData = [];
  public withdrawals;
  public playersInfo;
  public playersInfoChart = {
    visitors: [],
    signups: [],
    returns: [],
    bonus: [],
    cashouts: [],
    averageBets: [],
    maxBet: [],
    maxWin: [],
    dates: []
  }

  public placedBetsChart = {
    totalBetsAmount: [],
    totalBetsCount: [],
    totalBetsCountFromMobile: [],
    totalBetsCountFromTablet: [],
    totalBetsCountFromWebSite: [],
    totalBetsFromMobile: [],
    totalBetsFromTablet: [],
    totalBetsFromWebSite: [],
    totalGGR: [],
    totalGGRFromMobile: [],
    totalGGRFromTablet: [],
    totalGGRFromWebSite: [],
    totalNGR: [],
    totalNGRFromMobile: [],
    totalNGRFromTablet: [],
    totalNGRFromWebSite: [],
    totalPlayersCount: [],
    totalPlayersCountFromMobile: [],
    totalPlayersCountFromTablet: [],
    totalPlayersCountFromWebSite: [],
    dates: []
  }

  public providerBetsChart = {
    gameProviderId: [],
    gameProviderName: [],
    subProviderId: [],
    subProviderName: [],
    totalBetsAmount: [],
    totalBetsAmountFromBetShop: [],
    totalBetsAmountFromInternet: [],
    totalBetsCount: [],
    totalBonusBetsAmount: [],
    totalBonusWinsAmount: [],
    totalGGR: [],
    totalNGR: [],
    totalPlayersCount: [],
    totalWinsAmount: [],
    dates: [],
  }

  public providerBets;
  public providers;
  public pbt;
  public depositsItemChart = [];
  public withdrawalsItemChart = [];
  public depositsChart = [];
  public withdrawalsChart = [];
  public values = [[], [], [], [], []];
  public selectedGridName = '';
  public gridNames = ['Dashboard.PlacedBets', 'Dashboard.Deposits', 'Dashboard.Withdrawals', 'Dashboard.Players', 'Dashboard.BetsByProviders'];
  public paymentStates = [];
  public haveNotPermissionBets = '';
  public haveNotPermissionDeposits = '';
  public haveNotPermissionWithdarwals = '';
  public chart: Chart;
  public filteredStates = [];
  playersLoading = false;
  placedBetsLoading = false;
  depositsLoading = false;
  withdrawalsLoading = false;
  providersLoading = false;
  public cartTypes = [
    { id: 'Common.Line', value: 'line' },
    { id: 'Common.Spline', value: 'spline' },
    { id: 'Common.Area', value: 'area' },
    { id: 'Common.Areaspline', value: 'areaspline' },
    { id: 'Common.Column', value: 'column' },
    { id: 'Common.Bar', value: 'bar' },
  ];
  selectedProviderGridName: any;
  selectedRowIndex: any;
  depositsChatTitle: any;
  withdrawalsChartTitle: any;
  chartItemName: any;
  selectedKey: any;
  chartHref:Highcharts.Chart;

  constructor(
    public commonDataService: CommonDataService,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    private translate: TranslateService,
    public dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.selectedGrid = 0;
    this.partners = this.commonDataService.partners;
    this.toDate = new Date(this.toDate.setDate(this.toDate.getDate() + 1));
    this.getPaymentRequestStatesEnum();
    this.startDate();
    this.getDashboardApiCalls();
    this.selectedGridName = 'Dashboard.PlacedBets';
    this.setCart();
    if(window.matchMedia("(max-width: 1200px)").matches){
      this.options = {
        chart: { type: 'line', height: 600 },
        title: { text: '', style: { display: "none" } },
        xAxis: { categories: [] },
        yAxis: { labels: { enabled: true }, title: { text: null } },
        credits: { enabled: false, href: '', text:'', style: { display: "none" } },
        legend: {
          itemStyle: { fontSize: "13px" },
          itemMarginBottom: 10,
          navigation: { enabled: true },
          itemWidth: 170,
          x:-10
        },
        series: [],
      };
    }else {
      this.options = {
        chart: { type: 'line'},
        title: { text: '', style: { display: "none" } },
        xAxis: { categories: [] },
        yAxis: { labels: { enabled: true }, title: { text: null } },
        accessibility: {linkedDescription: ''},
        credits: { enabled: false, href: '', text:'', style: { display: "none" }},
        legend: {
          itemStyle: { fontSize: "14px" },
        },
        series: [],
      }
    }
  }

  getDashboardApiCalls() {
    this.getBetsInfo();
    this.getDeposits();
    this.getWithdrawals();
    this.getPlayersInfo();
    this.getProviderBets();
    // this.providerBetsChart = [];
  }

  setCart(): void {
    this.subscribeCart();
  }

  changeCartType(cartType: string) {
    this.options.chart = { type: cartType };
    this.subscribeCart();
  }

  getPaymentRequestStatesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_PAYMENT_REQUEST_STATES_ENUM, null, false).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.paymentStates = data.ResponseObject;
          this.filteredStates = this.paymentStates.map(state => state.Id);
        } else {
          this.paymentStates = [];
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  startDate(): void {
    DateTimeHelper.selectTime('week');
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    if (event.partnerId) {
      this.partnerId = event.partnerId;
    } else {
      this.partnerId = null;
    }
    this.filteredData = this.getFilteredDate();
    this.getDashboardApiCalls();
  }

  getFilteredDate() {
    if (this.partnerId) {
      return {
        FromDate: this.fromDate,
        ToDate: this.toDate,
        PartnerId: this.partnerId
      };
    } else {
      return {
        FromDate: this.fromDate,
        ToDate: this.toDate
      };
    }
  }

  getBetsInfo() {
    this.placedBetsLoading = true;
    this.filteredData = this.getFilteredDate();
    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
      Controllers.DASHBOARD, Methods.GET_BETS_INFO, null, false).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.placedBetsChart = {
            totalBetsAmount: [],
            totalBetsCount: [],
            totalBetsCountFromMobile: [],
            totalBetsCountFromTablet: [],
            totalBetsCountFromWebSite: [],
            totalBetsFromMobile: [],
            totalBetsFromTablet: [],
            totalBetsFromWebSite: [],
            totalGGR: [],
            totalGGRFromMobile: [],
            totalGGRFromTablet: [],
            totalGGRFromWebSite: [],
            totalNGR: [],
            totalNGRFromMobile: [],
            totalNGRFromTablet: [],
            totalNGRFromWebSite: [],
            totalPlayersCount: [],
            totalPlayersCountFromMobile: [],
            totalPlayersCountFromTablet: [],
            totalPlayersCountFromWebSite: [],
            dates: []
          }
          this.betsInfo = data.ResponseObject;
          this.betsInfo.DailyInfo.forEach(data => {
            this.placedBetsChart.dates.push(this.datePipe.transform(data.Date, "shortDate"));
            this.placedBetsChart.totalBetsAmount.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalBetsAmount]);
            this.placedBetsChart.totalBetsCount.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalBetsCount]);
            this.placedBetsChart.totalBetsCountFromMobile.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalBetsCountFromMobile]);
            this.placedBetsChart.totalBetsCountFromTablet.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalBetsCountFromTablet]);
            this.placedBetsChart.totalBetsCountFromWebSite.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalBetsCountFromWebSite]);
            this.placedBetsChart.totalBetsFromMobile.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalBetsFromMobile]);
            this.placedBetsChart.totalBetsFromTablet.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalBetsFromTablet]);
            this.placedBetsChart.totalBetsFromWebSite.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalBetsFromWebSite]);
            this.placedBetsChart.totalGGR.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalGGR]);
            this.placedBetsChart.totalGGRFromMobile.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalGGRFromMobile]);
            this.placedBetsChart.totalGGRFromTablet.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalGGRFromTablet]);
            this.placedBetsChart.totalGGRFromWebSite.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalGGRFromWebSite]);
            this.placedBetsChart.totalNGR.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalNGR]);
            this.placedBetsChart.totalNGRFromMobile.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalNGRFromMobile]);
            this.placedBetsChart.totalNGRFromTablet.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalNGRFromTablet]);
            this.placedBetsChart.totalNGRFromWebSite.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalNGRFromWebSite]);
            this.placedBetsChart.totalPlayersCount.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalPlayersCount]);
            this.placedBetsChart.totalPlayersCountFromMobile.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalPlayersCountFromMobile]);
            this.placedBetsChart.totalPlayersCountFromTablet.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalPlayersCountFromTablet]);
            this.placedBetsChart.totalPlayersCountFromWebSite.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalPlayersCountFromWebSite]);
          });
          this.selectCart();
          this.placedBetsLoading = false;
        } else {
          this.betsInfo = [];
          this.placedBetsLoading = false;
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  handleCartBetsInfo() {
    this.options.xAxis = { categories: this.placedBetsChart.dates };
    this.options.title.text = this.translate.instant('Dashboard.PlacedBets');
    this.options.series = [
      { type: undefined, name: this.translate.instant('Dashboard.BetsAmount'), data: this.placedBetsChart.totalBetsAmount },
      { type: undefined, name: this.translate.instant('Segments.TotalBetsCount'), data: this.placedBetsChart.totalBetsCount },
      { type: undefined, name: this.translate.instant('Dashboard.BetsCountFromMobile'), data: this.placedBetsChart.totalBetsCountFromMobile },
      { type: undefined, name: this.translate.instant('Dashboard.BetsCountFromTablet'), data: this.placedBetsChart.totalBetsCountFromTablet },
      { type: undefined, name: this.translate.instant('Dashboard.BetsCountFromWebSite'), data: this.placedBetsChart.totalBetsCountFromWebSite },
      { type: undefined, name: this.translate.instant('Dashboard.BetsFromMobile'), data: this.placedBetsChart.totalBetsFromMobile },
      { type: undefined, name: this.translate.instant('Dashboard.BetsFromTablet'), data: this.placedBetsChart.totalBetsFromTablet },
      { type: undefined, name: this.translate.instant('Dashboard.BetsFromWebSite'), data: this.placedBetsChart.totalBetsFromWebSite },
      { type: undefined, name: this.translate.instant('Dashboard.TotalGGR'), data: this.placedBetsChart.totalGGR },
      { type: undefined, name: this.translate.instant('Dashboard.GGRFromMobile'), data: this.placedBetsChart.totalGGRFromMobile },
      { type: undefined, name: this.translate.instant('Dashboard.GGRFromTablet'), data: this.placedBetsChart.totalGGRFromTablet },
      { type: undefined, name: this.translate.instant('Dashboard.GGRFromWebSite'), data: this.placedBetsChart.totalGGRFromWebSite },
      { type: undefined, name: this.translate.instant('Dashboard.TotalNGR'), data: this.placedBetsChart.totalNGR },
      { type: undefined, name: this.translate.instant('Dashboard.NGRFromMobile'), data: this.placedBetsChart.totalNGRFromMobile },
      { type: undefined, name: this.translate.instant('Dashboard.NGRFromTablet'), data: this.placedBetsChart.totalNGRFromTablet },
      { type: undefined, name: this.translate.instant('Dashboard.NGRFromWebSite'), data: this.placedBetsChart.totalNGRFromWebSite },
      { type: undefined, name: this.translate.instant('Dashboard.TotalPlayersCount'), data: this.placedBetsChart.totalPlayersCount },
      { type: undefined, name: this.translate.instant('Dashboard.PlayersCountFromMobile'), data: this.placedBetsChart.totalPlayersCountFromMobile },
      { type: undefined, name: this.translate.instant('Dashboard.PlayersCountFromTablet'), data: this.placedBetsChart.totalPlayersCountFromTablet },
      { type: undefined, name: this.translate.instant('Dashboard.PlayersCountFromWebSite'), data: this.placedBetsChart.totalPlayersCountFromWebSite }
    ];

    this.subscribeCart();
  }

  getDeposits() {
    this.depositsLoading = true;
    this.filteredData = this.getFilteredDate();
    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
      Controllers.DASHBOARD, Methods.GET_DEPOSITS, null, false).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.deposits = this.getPaymentResponse(data.ResponseObject, 'Deposits');
          this.depositsLoading = false;
        } else {
          this.deposits = [];
          this.depositsLoading = false;
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  handleDepositsChart() {
    this.options.title.text = this.translate.instant(this.depositsChatTitle);
    this.chartItemName = this.depositsChatTitle;

    this.options.series = [
      { type: undefined, name: this.translate.instant('Dashboard.TotalAmount'), data: this.depositsChart[this.depositsChatTitle]?.totalAmount },
      { type: undefined, name: this.translate.instant('Dashboard.TotalPlayersCount'), data: this.depositsChart[this.depositsChatTitle]?.totalPlayersCount },
      { type: undefined, name: this.translate.instant('Dashboard.TotalRequestsCount'), data: this.depositsChart[this.depositsChatTitle]?.totalRequestsCount },
    ];
    this.subscribeCart();
  }

  handleDepositsNestedChart() {
    this.options.title.text = this.translate.instant(this.depositsChatTitle);
    this.chartItemName = this.depositsChatTitle;

    this.options.series = [
      { type: undefined, name: this.translate.instant('Dashboard.TotalAmount'), data: this.depositsItemChart[this.depositsChatTitle]?.totalAmount },
      { type: undefined, name: this.translate.instant('Dashboard.TotalPlayersCount'), data: this.depositsItemChart[this.depositsChatTitle]?.totalPlayersCount },
      { type: undefined, name: this.translate.instant('Dashboard.TotalRequestsCount'), data: this.depositsItemChart[this.depositsChatTitle]?.totalRequestsCount },
    ];
    this.subscribeCart();
  }

  handleWithdrawalsChart() {
    this.options.title.text = this.translate.instant(this.withdrawalsChartTitle);
    this.chartItemName = this.withdrawalsChartTitle;
    this.options.series = [
      { type: undefined, name: this.translate.instant('Dashboard.TotalAmount'), data: this.withdrawalsChart[this.withdrawalsChartTitle]?.totalAmount },
      { type: undefined, name: this.translate.instant('Dashboard.TotalPlayersCount'), data: this.withdrawalsChart[this.withdrawalsChartTitle]?.totalPlayersCount },
      { type: undefined, name: this.translate.instant('Dashboard.TotalRequestsCount'), data: this.withdrawalsChart[this.withdrawalsChartTitle]?.totalRequestsCount },
    ];
    this.subscribeCart();
  }

  handleWithdrawalsNestedChart() {
    this.options.title.text = this.translate.instant(this.withdrawalsChartTitle);
    this.chartItemName = this.withdrawalsChartTitle;

    this.options.series = [
      { type: undefined, name: this.translate.instant('Dashboard.TotalAmount'), data: this.withdrawalsItemChart[this.withdrawalsChartTitle]?.totalAmount },
      { type: undefined, name: this.translate.instant('Dashboard.TotalPlayersCount'), data: this.withdrawalsItemChart[this.withdrawalsChartTitle]?.totalPlayersCount },
      { type: undefined, name: this.translate.instant('Dashboard.TotalRequestsCount'), data: this.withdrawalsItemChart[this.withdrawalsChartTitle]?.totalRequestsCount },
    ];
    this.subscribeCart();
  }

  handleCartPayment(payment, title: string) {
    payment = payment.filter(item => {
      const hasData = item.value.filter(value => this.filteredStates.includes(value.Status));
      return hasData.length > 0;
    });

    let infoName = title === 'Deposits' ? 'TotalDepositsCount' : 'TotalWithdrawalsCount';

    this.options.xAxis = {
      categories: payment.map(deposit => {
        return deposit.pSystems.map(system => system['PaymentSystemName'] + ' (' + deposit.key + ')');
      }).reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
    };

    this.options.title.text = title;
    const series = [
      { type: undefined, name: this.translate.instant('Common.TotalAmount'), data: [], KeyName: "TotalAmount" },
      { type: undefined, name: this.translate.instant('Segments.TotalDepositsCount' || 'Segments.TotalWithdrawalsCount'), data: [], KeyName: infoName },
      { type: undefined, name: this.translate.instant('Dashboard.TotalPlayersCount'), data: [], KeyName: "TotalPlayersCount" },
    ];

    series.forEach(cartItem => {
      cartItem.data = payment.map(deposit => {
        return deposit.pSystems.map(system => system[cartItem.KeyName]);
      }).reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
    });

    this.options.series = series;

    this.subscribeCart();
  }

  getWithdrawals() {
    this.withdrawalsLoading = true;
    this.filteredData = this.getFilteredDate();

    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
      Controllers.DASHBOARD, Methods.GET_WITHDRAWALS, null, false).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.withdrawals = this.getPaymentResponse(data.ResponseObject, 'Withdrawals');
          this.withdrawalsLoading = false;
        } else {
          this.withdrawals = [];
          this.withdrawalsLoading = false;
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getPlayersInfo() {
    this.playersLoading = true;
    this.filteredData = this.getFilteredDate();
    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
      Controllers.DASHBOARD, Methods.GET_PLAYERS_INFO, null, false).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.playersInfoChart = {
            visitors: [],
            signups: [],
            returns: [],
            bonus: [],
            cashouts: [],
            averageBets: [],
            maxBet: [],
            maxWin: [],
            dates: []
          };
          this.playersInfo = data.ResponseObject;
          this.playersInfo.DailyInfo.forEach(data => {
            this.playersInfoChart.dates.push(this.datePipe.transform(data.Date, "shortDate"));
            this.playersInfoChart.visitors.push([this.datePipe.transform(data.Date, "shortDate"), data.VisitorsCount]);
            this.playersInfoChart.signups.push([this.datePipe.transform(data.Date, "shortDate"), data.SignUpsCount]);
            this.playersInfoChart.returns.push([this.datePipe.transform(data.Date, "shortDate"), data.ReturnsCount]);
            this.playersInfoChart.bonus.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalBonusAmount]);
            this.playersInfoChart.cashouts.push([this.datePipe.transform(data.Date, "shortDate"), data.TotalCashoutAmount]);
            this.playersInfoChart.maxBet.push([this.datePipe.transform(data.Date, "shortDate"), data.MaxBet]);
            this.playersInfoChart.maxWin.push([this.datePipe.transform(data.Date, "shortDate"), data.MaxWin]);
            this.playersInfoChart.averageBets.push([this.datePipe.transform(data.Date, "shortDate"), data.AverageBet]);
          });
          if (this.selectedGridName === 'Dashboard.Players') {
            this.selectCart();
          }
          this.playersLoading = false;
        } else {
          this.playersInfo = [];
          this.playersLoading = false;
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  // private formatDate(value: any, type: string = "axis") {
  //   let dP = new DatePipe("en-US");
  //   return dP.transform(value, type === "axis" ? "short" : "shortDate");
  // }

  handleCartPlayersInfo() {
    this.options.xAxis = { categories: this.playersInfoChart.dates };
    this.options.title.text = this.translate.instant('Dashboard.Players');
    this.options.series = [
      { type: undefined, name: this.translate.instant('Dashboard.Visitors'), data: this.playersInfoChart.visitors },
      { type: undefined, name: this.translate.instant('Dashboard.Signups'), data: this.playersInfoChart.signups },
      { type: undefined, name: this.translate.instant('Dashboard.Returns'), data: this.playersInfoChart.returns },
      { type: undefined, name: this.translate.instant('Segments.Bonus'), data: this.playersInfoChart.bonus },
      { type: undefined, name: this.translate.instant('Sport.Cashout'), data: this.playersInfoChart.cashouts },
      { type: undefined, name: this.translate.instant('Dashboard.AverageBet'), data: this.playersInfoChart.averageBets },
      { type: undefined, name: this.translate.instant('Dashboard.MaxBet'), data: this.playersInfoChart.maxBet },
      { type: undefined, name: this.translate.instant('Dashboard.MaxWin'), data: this.playersInfoChart.maxWin }
    ];

    this.subscribeCart();
  }

  getProviderBets() {
    this.providersLoading = true;
    this.filteredData = this.getFilteredDate();
    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
      Controllers.DASHBOARD, Methods.GET_PROVIDER_BETS, null, false).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.providerBets = data.ResponseObject.Bets;
          this.pbt = {
            ProviderName: 'total',
            TotalBetsAmount: 0,
            TotalBetsCount: 0,
            TotalGGR: 0,
            TotalNGR: 0,
            TotalPlayersCount: data.ResponseObject.TotalPlayersCount,
            TotalBetsAmountFromInternet: 0,
            TotalBetsAmountFromBetShop: 0,
            TotalWinsAmount: 0,
          };

          this.providerBets.forEach((pb) => {
            this.pbt.TotalBetsAmount += pb.TotalBetsAmount;
            this.pbt.TotalBetsAmountFromBetShop += pb.TotalBetsAmountFromBetShop;
            this.pbt.TotalBetsAmountFromInternet += pb.TotalBetsAmountFromInternet;
            this.pbt.TotalBetsCount += pb.TotalBetsCount;
            this.pbt.TotalGGR += pb.TotalGGR;
            this.pbt.TotalNGR += pb.TotalNGR;
            this.pbt.TotalWinsAmount += pb.TotalWinsAmount;

            const subProviderName = pb.SubProviderName;
            this.providerBetsChart[subProviderName] = {
              gameProviderId: [],
              gameProviderName: [],
              subProviderId: [],
              subProviderName: [],
              totalBetsAmount: [],
              totalBetsAmountFromBetShop: [],
              totalBetsAmountFromInternet: [],
              totalBetsCount: [],
              totalBonusBetsAmount: [],
              totalBonusWinsAmount: [],
              totalGGR: [],
              totalNGR: [],
              totalPlayersCount: [],
              totalWinsAmount: [],
              dates: [],
            };

            pb.DailyInfo.forEach((data) => {
              this.providerBetsChart[subProviderName].dates.push(this.datePipe.transform(data.Date, 'shortDate'));
              this.providerBetsChart[subProviderName].totalBetsAmount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalBetsAmount]);
              this.providerBetsChart[subProviderName].totalBetsAmountFromBetShop.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalBetsAmountFromBetShop]);
              this.providerBetsChart[subProviderName].totalBetsAmountFromInternet.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalBetsAmountFromInternet]);
              this.providerBetsChart[subProviderName].totalBetsCount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalBetsCount]);
              this.providerBetsChart[subProviderName].totalBonusBetsAmount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalBonusBetsAmount]);
              this.providerBetsChart[subProviderName].totalBonusWinsAmount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalBonusWinsAmount]);
              this.providerBetsChart[subProviderName].totalGGR.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalGGR]);
              this.providerBetsChart[subProviderName].totalNGR.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalNGR]);
              this.providerBetsChart[subProviderName].totalPlayersCount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalPlayersCount]);
              this.providerBetsChart[subProviderName].totalWinsAmount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalWinsAmount]);
            });
          });
          if (this.selectedGridName == 'Dashboard.BetsByProviders') {
            this.selectCart();
          }
          this.providersLoading = false;
        } else {
          this.providerBets = [];
          this.providersLoading = false;
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      });
  }

  handleCartProviderBets(item) {
    this.chartItemName = item;
    this.options.title.text = item;
    this.options.series = [
      { type: undefined, name: this.translate.instant('Dashboard.BetsAmount'), data: this.providerBetsChart[item]?.totalBetsAmount },
      { type: undefined, name: this.translate.instant('Dashboard.BetsAmountFromBetShop'), data: this.providerBetsChart[item]?.totalBetsAmountFromBetShop },
      { type: undefined, name: this.translate.instant('Dashboard.BetsAmountFromInternet'), data: this.providerBetsChart[item]?.totalBetsAmountFromInternet },
      { type: undefined, name: this.translate.instant('Segments.TotalBetsCount'), data: this.providerBetsChart[item]?.totalBetsCount },
      { type: undefined, name: this.translate.instant('Dashboard.BonusBetsAmount'), data: this.providerBetsChart[item]?.totalBonusBetsAmount },
      { type: undefined, name: this.translate.instant('Dashboard.BonusWinsAmount'), data: this.providerBetsChart[item]?.totalBonusWinsAmount },
      { type: undefined, name: this.translate.instant('Dashboard.TotalGGR'), data: this.providerBetsChart[item]?.totalGGR },
      { type: undefined, name: this.translate.instant('Dashboard.TotalNGR'), data: this.providerBetsChart[item]?.totalNGR },
      { type: undefined, name: this.translate.instant('Dashboard.TotalPlayersCount'), data: this.providerBetsChart[item]?.totalPlayersCount },
      { type: undefined, name: this.translate.instant('Dashboard.TotalWinsAmount'), data: this.providerBetsChart[item]?.totalWinsAmount }
    ];
    this.subscribeCart();
  }

  onPartnerChange(partnerId: number) {
    this.partnerId = partnerId;
    this.getDashboardApiCalls();
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
    this.filteredData.FromDate = new Date(this.fromDate.setDate(this.fromDate.getDate()));
  }

  onEndDateChange(event) {
    this.toDate = event.value;
    this.filteredData.ToDate = new Date(this.toDate.setDate(this.toDate.getDate()));
  }

  groupBy(value: Array<any>, field: string): Array<any> {
    const groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});

    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
  }

  selectGrid(index, item?, i?) {
    let data = this.values[index];
    this.selectedGridName = this.gridNames[index];
    if (index === 1 || index === 5) {
      this.depositsChatTitle = item;
      if(i) {
        this.selectedKey = i.key;
      }
      this.selectedGridName = 'Dashboard.Deposits';
    } else if (index === 2 || index === 6) {
      this.withdrawalsChartTitle = item;
      this.selectedGridName = 'Dashboard.Withdrawals';
      if(i) {
        this.selectedKey = i.key;
      }
    } else {
      this.chartItemName = ''
    }
    this.selectedGrid = index;
    if (item) {
      this.selectedProviderGridName = item;
      this.selectedRowIndex = i;
    }
    this.selectCart();
    return data;
  }

  changeGraff(value) {
    this.selectedGrid += value;
    if (this.selectedGrid > this.values.length - 1) {
      this.selectedGrid = 0;
    }
    if (this.selectedGrid < 0) {
      this.selectedGrid = this.values.length - 1;
    }
    if(this.selectedGrid === 4) {
      this.selectGrid(this.selectedGrid, 'Internal', 0 );
    } else if( this.selectedGrid === 1) {
      this.depositsChatTitle = 'Pending';
      this.selectGrid(this.selectedGrid, 'Pending');
    } else if( this.selectedGrid === 2) {
      this.withdrawalsChartTitle = 'Pending';
      this.selectGrid(this.selectedGrid, 'Pending');
    } else {
      this.selectGrid(this.selectedGrid);
    }
  };

  selectCart() {
    switch (this.selectedGrid) {
      case 0:
        this.handleCartBetsInfo();
        break;
      case 1:
        this.handleDepositsChart();
        break;
      case 2:
        this.handleWithdrawalsChart();
        break;
      case 3:
        this.handleCartPlayersInfo();
        break;
      case 4:
        this.handleCartProviderBets(this.selectedProviderGridName);
        break;
      case 5:
        this.handleDepositsNestedChart();
        break;
      case 6:
        this.handleWithdrawalsNestedChart();
        break;
    }
  }

  getPaymentResponse(responseObject, payment) {
    let nData = [];
    if (payment === 'Deposits') {
      this.depositsChart = [];
    }
    if (payment === 'Withdrawals') {
      this.withdrawalsChart = [];
    }
    responseObject.forEach((response) => {
      if (payment === 'Deposits') {
        const chartName = this.paymentStates.find(item => item.Id === response.Status)?.Name;
        this.depositsChart[chartName] = {
          dates: [],
          totalAmount: [],
          totalPlayersCount: [],
          totalRequestsCount: [],
        };
        response.DailyInfo.forEach((data) => {
          this.depositsChart[chartName].dates.push(this.datePipe.transform(data.Date, 'shortDate'));
          this.depositsChart[chartName].totalAmount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalAmount]);
          this.depositsChart[chartName].totalPlayersCount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalPlayersCount]);
          this.depositsChart[chartName].totalRequestsCount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalRequestsCount]);
        });
      }

      if (payment === 'Withdrawals') {
        const chartName = this.paymentStates.find(item => item.Id === response.Status)?.Name;
        this.withdrawalsChart[chartName] = {
          dates: [],
          totalAmount: [],
          totalPlayersCount: [],
          totalRequestsCount: [],
        };
        response.DailyInfo.forEach((data) => {
          this.withdrawalsChart[chartName].dates.push(this.datePipe.transform(data.Date, 'shortDate'));
          this.withdrawalsChart[chartName].totalAmount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalAmount]);
          this.withdrawalsChart[chartName].totalPlayersCount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalPlayersCount]);
          this.withdrawalsChart[chartName].totalRequestsCount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalRequestsCount]);
        });
      }

      response[payment].map((mappedItem) => {
        mappedItem.StatusName = this.paymentStates.find(item => item.Id === response.Status)?.Name;
        mappedItem.TPC = response?.TotalPlayersCount;
        mappedItem.Status = response?.Status;
        nData.push(mappedItem);
        return mappedItem;
      })
    })

    let groupedData = this.groupBy(nData, 'StatusName');

    groupedData.forEach((item) => {
      item.totals = {
        TotalAmount: 0,
        TotalDepositsCount: 0,
        TotalWithdrawalsCount: 0,
        Status: 0
      };
      item.pSystems = [];
      item.value.forEach((total) => {
        const paymentSystemName = total.PaymentSystemName;
        if (payment === 'Deposits' && !this.depositsItemChart[paymentSystemName]) {
          this.depositsItemChart[paymentSystemName] = {
            dates: [],
            totalAmount: [],
            totalPlayersCount: [],
            totalRequestsCount: [],
          };
        }

        if (payment === 'Withdrawals' && !this.withdrawalsItemChart[paymentSystemName]) {
          this.withdrawalsItemChart[paymentSystemName] = {
            dates: [],
            totalAmount: [],
            totalPlayersCount: [],
            totalRequestsCount: [],
          };
        }

        total.DailyInfo.forEach((data) => {
          if (payment === 'Deposits') {
            this.depositsItemChart[paymentSystemName].dates.push(this.datePipe.transform(data.Date, 'shortDate'));
            this.depositsItemChart[paymentSystemName].totalAmount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalAmount]);
            this.depositsItemChart[paymentSystemName].totalPlayersCount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalPlayersCount]);
            this.depositsItemChart[paymentSystemName].totalRequestsCount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalRequestsCount]);
          }
          if (payment === 'Withdrawals') {
            this.withdrawalsItemChart[paymentSystemName].dates.push(this.datePipe.transform(data.Date, 'shortDate'));
            this.withdrawalsItemChart[paymentSystemName].totalAmount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalAmount]);
            this.withdrawalsItemChart[paymentSystemName].totalPlayersCount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalPlayersCount]);
            this.withdrawalsItemChart[paymentSystemName].totalRequestsCount.push([this.datePipe.transform(data.Date, 'shortDate'), data.TotalRequestsCount]);
          }
        });

        item.totals.TotalAmount += total.TotalAmount;
        item.totals.TotalWithdrawalsCount += total.TotalWithdrawalsCount;
        item.totals.TotalDepositsCount += total.TotalDepositsCount;
        item.totals.TotalPlayersCount = total.TPC;
        item.totals.Status = total.Status;
        item.pSystems.push(total);
      })
    })
    return groupedData;
  }

  onCalendarFilter() {
    this.getDashboardApiCalls();
  }

  subscribeCart(): void {
    if(!this.chart)
    {
      if(this.options)
      {
        let chart = new Chart(this.options);
        this.chart = chart;
        chart.ref$.subscribe(data => {
          this.chartHref = data;
        });
      }
    }
    else
    {
      if(this.chartHref)
      {
        this.chartHref.update(this.options, true);
      }
    }
  }

  // private getXAxisByDate(type: string = 'day') {
  //   const result = [];
  //   const date1 = new Date(this.filteredData.FromDate);
  //   const date2 = new Date(this.filteredData.ToDate);
  //   const diff = date2.getTime() - date1.getTime();

  //   if (type === "day") {
  //     const days = Math.round(diff / 86400000);
  //     result.push(this.datePipe.transform(date1, "shortDate"));
  //     for (let i = 1; i < days; i++) {
  //       let d = new Date();
  //       d.setDate(date1.getDate() + i);
  //       result.push(this.datePipe.transform(d, "shortDate"));
  //     }
  //     result.push(this.datePipe.transform(date2, "shortDate"));
  //   }

  //   return result;

  // }

}
