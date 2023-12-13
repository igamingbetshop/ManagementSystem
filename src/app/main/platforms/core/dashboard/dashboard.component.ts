import { Component } from '@angular/core';
import { CommonDataService, ConfigService } from "../../../../core/services";
import { CoreApiService } from "../services/core-api.service";
import { Controllers, Methods } from "../../../../core/enums";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { Chart } from "angular-highcharts";
import { DateTimeHelper } from "../../../../core/helpers/datetime.helper";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public selectedItem = 'today';
  public selectedGrid = 0;
  public fromDate = new Date();
  public toDate = new Date();
  public filteredData;
  public options: any;
  public partners = [];
  public partnerId;
  public betsInfo;
  public deposits = [];
  public depositsGroupedData = [];
  public withdrawals;
  public playersInfo;
  public providerBets;
  public providers;
  public pbt;
  public values = [[], [], [], [], []];
  public selectedGridName = '';
  public gridNames = ['Dashboard.PlacedBets', 'Dashboard.Deposits', 'Dashboard.Withdrawals', 'Dashboard.Players', 'Dashboard.BetsByProviders'];
  public paymentStates = [];
  public haveNotPermissionBets = '';
  public haveNotPermissionDeposits = '';
  public haveNotPermissionWithdarwals = '';
  public chart: Chart;
  public filteredStates = [];

  public cartTypes = [
    { id: 'Common.Line', value: 'line' },
    { id: 'Common.Spline', value: 'spline' },
    { id: 'Common.Area', value: 'area' },
    { id: 'Common.Areaspline', value: 'areaspline' },
    { id: 'Common.Column', value: 'column' },
    { id: 'Common.Bar', value: 'bar' },
  ];

  constructor(
    public commonDataService: CommonDataService,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    private translate: TranslateService,
    public dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.toDate = new Date(this.toDate.setDate(this.toDate.getDate() + 1));
    this.getGameProviders();
    this.getPaymentRequestStatesEnum();
    this.startDate();
    this.getDashboardApiCalls();
    this.selectedGridName = 'Dashboard.PlacedBets';
    this.setCart();
  }

  getDashboardApiCalls() {
    this.getBetsInfo();
    this.getDeposits();
    this.getWithdrawals();
    this.getPlayersInfo();
    this.getProviderBets();
  }

  setCart(): void {
    this.options = {
      chart: { type: 'column' },
      title: { text: '' },
      xAxis: { categories: [] },
      credits: { enabled: false },
      series: [],
    };
    this.subscribeCart();
  }

  changeCartType(cartType: string) {
    this.options.chart = { type: cartType };
    this.subscribeCart();
  }

  getGameProviders() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.providers = data.ResponseObject;
        }  else {
          this.providers = [];
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: 'error'});
        }
      });
  }

  getPaymentRequestStatesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_PAYMENT_REQUEST_STATES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.paymentStates = data.ResponseObject;
          this.filteredStates = this.paymentStates.map(state => state.Id);
        }   else {
          this.paymentStates = [];
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: 'error'});
        }
      });
  }

  startDate(): void {
    DateTimeHelper.startDate();
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
  }

  selectTime(time) {
    DateTimeHelper.selectTime(time);
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
    this.filteredData = this.getFilteredDate();
    this.selectedItem = time;
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
    this.filteredData = this.getFilteredDate();

    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
      Controllers.DASHBOARD, Methods.GET_BETS_INFO).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.betsInfo = data.ResponseObject;
          this.selectedGrid = 0;
          this.selectedGridName = 'Placed Bets';
          this.handleCartBetsInfo();
        }   else {
          this.betsInfo = [];
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: 'error'});
        }
      });
  }

  handleCartBetsInfo() {
    this.options.xAxis = {
      categories: [
        this.translate.instant('Dashboard.TotalBets'),
        this.translate.instant('Dashboard.TotalBetsFromMobile'),
        this.translate.instant('Dashboard.TotalBetsFromWebsite'),
        this.translate.instant('Dashboard.TotalBetsFromWap')]
    };
    this.options.title.text = this.translate.instant('Dashboard.PlacedBets');
    this.options.series = [
      { type: undefined, name: this.translate.instant('Dashboard.Amount'), data: [this.betsInfo.TotalBetsAmount, this.betsInfo.TotalBetsFromMobile, this.betsInfo.TotalBetsFromWebSite, this.betsInfo.TotalBetsFromWap] },
      { type: undefined, name: this.translate.instant('Dashboard.GGR'), data: [this.betsInfo.TotalGGR, this.betsInfo.TotalGGRFromMobile, this.betsInfo.TotalGGRFromWebSite, this.betsInfo.TotalGGRFromWap] },
      { type: undefined, name: this.translate.instant('Partners.Count'), data: [this.betsInfo.TotalBetsCount, this.betsInfo.TotalBetsCountFromMobile, this.betsInfo.TotalBetsCountFromWebSite, this.betsInfo.TotalPlayersCountFromWap] },
      { type: undefined, name: this.translate.instant('Dashboard.Players'), data: [this.betsInfo.TotalPlayersCount, this.betsInfo.TotalPlayersCountFromMobile, this.betsInfo.TotalPlayersCountFromWebSite, this.betsInfo.TotalPlayersCountFromWebSite] }
    ];

    this.subscribeCart();
  }

  getDeposits() {
    this.filteredData = this.getFilteredDate();
    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
      Controllers.DASHBOARD, Methods.GET_DEPOSITS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.deposits = this.getPaymentResponse(data.ResponseObject, 'Deposits');          
        } else {
          this.deposits = [];
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  handleCartPayment(payment, title: string) {
    payment = payment.filter(item => {
      const hasData = item.value.filter(value => this.filteredStates.includes(value.Status));
      return hasData.length > 0;
    });

    this.options.xAxis = {
      categories: payment.map(deposit => {
        return deposit.pSystems.map(system => system['PaymentSystemName'] + ' (' + deposit.key + ')');
      }).reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
    };

    this.options.title.text = title;
    const series = [
      { type: undefined, name: this.translate.instant('Common.TotalAmount'), data: [], KeyName: "TotalAmount" },
      { type: undefined, name: this.translate.instant('Segments.TotalDepositsCount' || 'Segments.TotalWithdrawalsCount' ), data: [], KeyName: "TotalAmount" },
      { type: undefined, name: this.translate.instant('Dashboard.TotalPlayersCount'), data: [], KeyName: "TotalAmount" },
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
    this.filteredData = this.getFilteredDate();

    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
      Controllers.DASHBOARD, Methods.GET_WITHDRAWALS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.withdrawals = this.getPaymentResponse(data.ResponseObject, 'Withdrawals');         
        } else {
          this.withdrawals = [];
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getPlayersInfo() {
    this.filteredData = this.getFilteredDate();
    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
      Controllers.DASHBOARD, Methods.GET_PLAYERS_INFO).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.playersInfo = data.ResponseObject;
        }  else {
          this.playersInfo = [];
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  handleCartPlayersInfo() {
    this.options.xAxis = { categories: [''] };
    this.options.title.text = this.translate.instant('Dashboard.Players');
    this.options.series = [
      { type: undefined, name: this.translate.instant('Dashboard.Visitors'), data: [this.playersInfo.VisitorsCount] },
      { type: undefined, name: this.translate.instant('Dashboard.Signups'), data: [this.playersInfo.SignUpsCount] },
      { type: undefined, name: this.translate.instant('Dashboard.Returns'), data: [this.playersInfo.ReturnsCount] },
      { type: undefined, name: this.translate.instant('Segments.Bonus'), data: [this.playersInfo.TotalBonusAmount] },
      { type: undefined, name: this.translate.instant('Sport.Cashout'), data: [this.playersInfo.TotalCashoutAmount] },
      { type: undefined, name: this.translate.instant('Dashboard.AverageBet'), data: [this.playersInfo.AverageBet] },
      { type: undefined, name: this.translate.instant('Dashboard.MaxBet'), data: [this.playersInfo.MaxBet] },
      { type: undefined, name: this.translate.instant('Dashboard.MaxWin'), data: [this.playersInfo.MaxWin] },
    ];

    this.subscribeCart();
  }

  getProviderBets() {
    this.filteredData = this.getFilteredDate();

    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
      Controllers.DASHBOARD, Methods.GET_PROVIDER_BETS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {

          this.providerBets = data.ResponseObject.Bets.map((items) => {
            items.ProviderName = this.providers.find((item => item.Id === items.ProviderId))?.Name;
            return items;
          });
          this.pbt = {
            ProviderName: 'total',
            TotalBetsAmount: 0,
            TotalBetsCount: 0,
            TotalGGR: 0,
            TotalNGR: 0,
            TotalPlayersCount: data.ResponseObject.TotalPlayersCount,
            TotalBetsAmountFromInternet: 0,
            TotalBetsAmountFromBetShop: 0,
            TotalWinsAmount: 0
          };

          this.providerBets.forEach((pb) => {
            this.pbt.TotalBetsAmount += pb.TotalBetsAmount;
            this.pbt.TotalBetsAmountFromBetShop += pb.TotalBetsAmountFromBetShop;
            this.pbt.TotalBetsAmountFromInternet += pb.TotalBetsAmountFromInternet;
            this.pbt.TotalBetsCount += pb.TotalBetsCount;
            this.pbt.TotalGGR += pb.TotalGGR;
            this.pbt.TotalNGR += pb.TotalNGR;
            this.pbt.TotalWinsAmount += pb.TotalWinsAmount;
          });
        }  else {
          this.providerBets = [];
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  handleCartProviderBets() {
    this.options.xAxis.categories = this.providerBets.map((items) => [items.ProviderName]);
    this.options.title.text = this.translate.instant('Dashboard.BetsByProviders');
    this.options.series = [];
    this.options.series = [
      { type: undefined, name: this.translate.instant('Dashboard.BetsAmount'), data: this.providerBets.map((items) => [items.TotalBetsAmount]) },
      {
        type: undefined,
        name: this.translate.instant('Dashboard.BetShopBetsAmount'),
        data: this.providerBets.map((items) => [items.TotalBetsAmountFromBetShop])
      },
      {
        type: undefined,
        name: this.translate.instant('Dashboard.InternetBetsAmount'),
        data: this.providerBets.map((items) => [items.TotalBetsAmountFromInternet])
      },
      { type: undefined, name: this.translate.instant('Segments.TotalBetsCount'), data: this.providerBets.map((items) => [items.TotalBetsCount]) },
      { type: undefined, name: this.translate.instant('Dashboard.TotalGGR'), data: this.providerBets.map((items) => [items.TotalGGR]) },
      { type: undefined, name: this.translate.instant('Dashboard.TotalPlayersCount'), data: this.providerBets.map((items) => [items.TotalPlayersCount]) }
    ];

    this.subscribeCart();
  }

  onPartnerChange(partnerId: number) {
    this.partnerId = partnerId;
    this.getDashboardApiCalls();
  }

  onStateChange(values: number[]): void {
    this.filteredStates = values;
    if (this.selectedGrid === 1) {
      this.handleCartPayment(this.deposits, 'Deposits');
    } else {
      this.handleCartPayment(this.withdrawals, 'Withdrawals');
    }
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

  selectGrid(index) {
    let data = this.values[index];
    this.selectedGridName = this.gridNames[index];
    this.selectedGrid = index;
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
    this.selectGrid(this.selectedGrid);
  };

  selectCart() {

    switch (this.selectedGrid) {
      case 0:
        this.handleCartBetsInfo();
        break;
      case 1:
        this.handleCartPayment(this.deposits, 'Deposits');        
        break;
      case 2:
        this.handleCartPayment(this.withdrawals, 'Withdrawals');        
        break;
      case 3:
        this.handleCartPlayersInfo();
        break;
      case 4:
        this.handleCartProviderBets();
        break;
    }
  }

  getPaymentResponse(responseObject, payment) {
    let nData = [];
    responseObject.forEach((response) => {
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
        TotalWithdrawalsCount: 0
      };
      item.pSystems = [];
      item.value.forEach((total) => {        
        item.totals.TotalAmount += total.TotalAmount;
        item.totals.TotalWithdrawalsCount += total.TotalWithdrawalsCount;
        item.totals.TotalDepositsCount += total.TotalDepositsCount;
        item.totals.TotalPlayersCount = total.TPC;
        item.pSystems.push(total);        
      })
    })

    return groupedData;
  }

  onCalendarFilter() {
    this.getDashboardApiCalls();
  }

  subscribeCart(): void {
    let chart = new Chart(this.options);
    this.chart = chart;
    chart.ref$.subscribe();
  }

}
