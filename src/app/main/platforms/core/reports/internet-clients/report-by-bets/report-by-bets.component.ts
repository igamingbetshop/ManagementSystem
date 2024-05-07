import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService, LocalStorageService } from "../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { Paging } from "../../../../../../core/models";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { AgBooleanFilterComponent } from "../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../components/grid-common/checkbox-renderer.component";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { OddsTypePipe } from "../../../../../../core/pipes/odds-type.pipe";
import { Controllers, Methods, OddsTypes, ModalSizes, GridMenuIds } from 'src/app/core/enums';
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { ExportService } from "../../../services/export.service";

@Component({
  selector: 'app-report-by-bets',
  templateUrl: './report-by-bets.component.html',
  styleUrls: ['./report-by-bets.component.scss']
})
export class ReportByBetsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('agGrid1') agGrid1: AgGridAngular;
  public rowData = [];
  public rowData1 = [];
  public columnDefs1;
  public gameId: string | null = null;
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public partners = [];
  public partnerId;
  public providers = [];
  public deviceTypes = [];
  public categories = [];
  public status = [];
  public show = false;
  public filteredData;
  public detailCellRendererParams: any;
  public masterDetail;
  public detailsInline;
  public nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
  };
  public rowClassRules;
  public playerCurrency;
  public selectedItem = 'today';
  TotalWinAmount;
  TotalBetAmount;
  TotalProfit;
  Currency;
  private oddsType: number;

  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
    private exportService: ExportService,
    protected injector: Injector,
    private localStorageService: LocalStorageService) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_BET;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetDocumentId',
        sortable: true,
        resizable: true,
        cellRenderer: 'agGroupCellRenderer',
        filter: 'agNumberColumnFilter',
        minWidth: 130,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500', 'padding-left': '10px', },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientUserName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.NameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientFirstName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellRenderer: params => {
          let div = document.createElement('div');
          if (params.node.rowPinned) {
            return '';
          } else if (params.data.ClientFirstName !== null || params.data.ClientLastName !== null) {
            div.innerHTML = `<a href="main/platform/clients/client/main?clientId=${params.data.ClientId}">${params.data.ClientFirstName + ' ' + params.data.ClientLastName}</a>`;
            return div;
          }
        },
      },
      {
        headerName: 'Clients.ProductId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Products.ProductName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.ProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Currencies.CurrencyName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Round',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Round',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Device',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DeviceTypeId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.ClientCategoryId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientCategoryId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Dashboard.GGR',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GGR',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.ClientIp',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientIp',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.Country',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Country',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'BetShops.BetTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetTypeId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.PossibleWin',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PossibleWin',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        // valueFormatter: params => params.data.PossibleWin.toFixed(2),
      },
      {
        headerName: 'Common.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        // valueFormatter: params => params.data.BetAmount.toFixed(2),
      },
      {
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        // valueFormatter: params => params.data.BetAmount.toFixed(2),
      },
      {
        headerName: 'Common.BetDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetDate',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.BetDate, 'medium');
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Sport.Profit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Profit',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.Rake',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Rake',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.BonusWinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusWinAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.OriginalBonusWinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OriginalBonusWinAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.BonusId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.Notes',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        sortable: false,
        minWidth: 130,
        filter: false,
        cellRenderer: params => {
          let keyData = params.data.HasNote;
          let addNotes = this.translate.instant('Clients.AddNote') as String;
          let add = this.translate.instant('Common.Add') as String;
          let view = this.translate.instant('Common.View') as String;

          let newButton =
            `<button class="button-view-1" data-action-type="add">${addNotes}</button>`;
          let newButton2 = `<button class="button-view-2" data-action-type="add">${add}</button>
             <button class="button-view-2" data-action-type="view">${view}</button>`
          if (keyData === false) {
            return newButton;
          } else if (keyData === true) {
            return newButton2;
          }
        }
      },
    ]
    this.columnDefs1 = [
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Login.Login',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Login',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Dashboard.TotalBets',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBets',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.TotalWin',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWin',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.TotalBets',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBets',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Currency',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Dashboard.GGR',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GGR',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Balance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Balance',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.MaxBet',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxBet',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.#TotalDeposits',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalDeposits',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.TotalDeposits',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalDeposits',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.#TotalWithdrawals',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWithdrawals',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.TotalWithdrawals',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWithdrawals',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
    ]
    this.masterDetail = true;
    this.detailCellRendererParams = {
      detailGridOptions: {
        rowHeight: 47,
        defaultColDef: {
          sortable: true,
          filter: true,
          flex: 1,
        },
        components: this.nestedFrameworkComponents,
        columnDefs: [
          {
            headerName: 'Common.EventDate',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'EventDate',
            sortable: true,
            resizable: true,
            cellRenderer: function (params) {
              let datePipe = new DatePipe("en-US");
              let dat = datePipe.transform(params.data.EventDate, 'medium');
              if (params.node.rowPinned) {
                return ''
              } else {
                return `${dat}`;
              }
            },
          },
          {
            headerName: 'Sport.SportName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SportName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.CompetitionName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'CompetitionName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.RegionName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'RegionName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.MarketName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MarketName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.Status',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Status',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.MarketTypeId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MarketTypeId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.MatchId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MatchId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.Round',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'RoundId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Segments.SelectionId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SelectionId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.SelectionName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SelectionName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.Unit',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'UnitName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.Coefficient',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Coefficient',
            sortable: true,
            resizable: true,
            cellRenderer: (params) => {
              const oddsTypePipe = new OddsTypePipe();
              let data = oddsTypePipe.transform(params.data.Coefficient, this.oddsType);
              return `${data}`;
            }
          },
          {
            headerName: 'Sport.MatchState',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'IsLive',
            sortable: true,
            resizable: true,
            cellRenderer: params => {
              var a = document.createElement('div');
              if (params.data.IsLive === true) {
                a.innerHTML = 'Live'
              } else {
                a.innerHTML = 'Prematch'
              }
              return a;
            },
          },
          {
            headerName: 'Common.State',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'State',
            sortable: true,
            resizable: true,
          },
        ],
        onGridReady: params => {
        },
      },
      getDetailRowData: params => {
        if (params) {
          this.apiService.apiPost(this.configService.getApiUrl, params.data.BetDocumentId, true,
            Controllers.REPORT, Methods.GET_BET_INFO).pipe(take(1)).subscribe(data => {
              const nestedRowData = data.ResponseObject.BetSelections
              this.detailsInline = data.ResponseObject
              params.successCallback(nestedRowData);
            })
        }
      },
      template: params => {
        const information = this.translate.instant('Common.Information') as String;
        const amount = this.translate.instant('Clients.Amount') as String;
        const barcode = this.translate.instant('Payments.Barcode') as String;
        const betDate = this.translate.instant('Common.BetDate') as String;
        const coefficient = this.translate.instant('Sport.Coefficient') as String;
        return `<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box; overflow-y: auto">
                   <div style="font-weight: 700; font-size: 24px">${information}</div>
                  <div style="height: 10%; font-size: 16px; color: #076192">${amount}: ${this.detailsInline?.Amount.toFixed(2)}</div>
                  <div style="height: 10%; font-size: 16px; color: #076192">${barcode}: ${this.detailsInline?.Barcode}</div>
                  <div style="height: 10%; font-size: 16px; color: #076192">${betDate}: ${this.detailsInline?.BetDate}</div>
                  <div style="height: 10%; font-size: 16px; color: #076192">${coefficient}: ${this.detailsInline?.Coefficient}</div>
                  <div ref="eDetailGrid" style="height: 90%;"></div>
               </div>`
      }
    }
    this.rowClassRules = {
      'bets-status-2': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === 2 || numSickDays === 5 || numSickDays === 7;
      },
      'bets-status-1': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === 3;
      },
      'bets-status-3': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === 4;
      },
    };
  }

  ngOnInit(): void {
    this.setTime();
    this.gameId = this.route.snapshot.queryParamMap.get('gameId');
    this.partners = this.commonDataService.partners;
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;
    this.getStates();
    this.getCategoryEnum();
    this.getProviders();
    this.getDeviceTypes();
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    if (event.partnerId) {
      this.partnerId = event.partnerId;
    } else {
      this.partnerId = null;
    }
    this.getCurrentPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());

    const gameId = this.route.snapshot.queryParams['gameId'];
    if (gameId) {
      const filterModel = {
        type: 'equals',
        filter: gameId.toString(),
      };

      const productIdColumn = this.columnDefs.find((colDef) => colDef.field === 'ProductId');
      if (productIdColumn) {
        this.gridApi.setFilterModel({ ProductId: filterModel });
      }
    }

  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PartnerId = this.partnerId;
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.BetDateFrom = this.fromDate;
        paging.BetDateBefore = this.toDate;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.REPORT, Methods.GET_INTERNET_BETS_REPORT_PAGING).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Bets.Entities;
              mappedRows.forEach((items) => {
                let ProviderName = this.providers.find((partner) => {
                  return partner.Id == items.GameProviderId;
                })
                if (ProviderName) {
                  items['GameProviderId'] = ProviderName.Name;
                }
                let DeviceTypeName = this.deviceTypes.find((device) => {
                  return device.Id == items.DeviceTypeId;
                })
                if (DeviceTypeName) {
                  items['DeviceTypeId'] = DeviceTypeName.Name;
                }
                let StateName = this.status.find((state) => {
                  return state.Id == items.State;
                })
                if (StateName) {
                  items['State'] = StateName.Name;
                }
                let ClientCategoryName = this.categories.find((cat) => {
                  return cat.Id == items.ClientCategoryId;
                })
                if (ClientCategoryName) {
                  items['ClientCategoryId'] = ClientCategoryName.Name;
                }
              })
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Bets.Count });
              this.gridApi?.setPinnedBottomRowData([{
                PossibleWin: `${(data.ResponseObject.TotalPossibleWinAmount.toFixed(2))} ${this.playerCurrency}`,
                BetAmount: `${(data.ResponseObject.TotalBetAmount.toFixed(2))} ${this.playerCurrency}`,
                WinAmount: `${(data.ResponseObject.TotalWinAmount.toFixed(2))} ${this.playerCurrency}`
              }
              ]);
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
              params.success({ rowData: [], rowCount: 0 });
              this.gridApi?.setPinnedBottomRowData([{
                PossibleWin: 0,
                BetAmount: 0,
                WinAmount: 0,
              }
              ]);
            }
          });
      },
    };
  }

  createServerSideDatasource1() {
    return {
      getRows: (params) => {

        const paging = new Paging();
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
          paging.SkipCount = this.paginationPage - 1;
          paging.TakeCount = Number(this.cacheBlockSize);
          paging.BetDateFrom = this.fromDate;
          paging.BetDateBefore = this.toDate;
        } else {
          paging.SkipCount = this.paginationPage - 1;
          paging.TakeCount = Number(this.cacheBlockSize);
          paging.BetDateFrom = this.fromDate;
          paging.BetDateBefore = this.toDate;
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.REPORT, Methods.GET_INTERNET_BETS_BY_CLIENT_REPORT_PAGING).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              params.success({ rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  getByPartnerData(event) {
    this.partnerId = event;
    this.gridApi?.setServerSideDatasource(this.createServerSideDatasource());
    // this.gridApi?.setServerSideDatasource(this.createServerSideDatasource1());
  }

  showHideGrid() {
    this.show = !this.show;
    this.gridApi?.setServerSideDatasource(this.createServerSideDatasource1());
  }

  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "add":
          return this.addNotes(data);
        case "view":
          return this.openNotes(data);
      }
    }
  }

  async addNotes(params) {
    const { AddNoteComponent } = await import('../../../../../components/add-note/add-note.component');
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: { ObjectId: params.BetDocumentId, ObjectTypeId: 12 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.gridApi?.setServerSideDatasource(this.createServerSideDatasource());
        this.gridApi?.setServerSideDatasource(this.createServerSideDatasource1());
      }
    });
  }

  async openNotes(params) {
    const { ViewNoteComponent } = await import('../../../../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: { ObjectId: params.BetDocumentId, ObjectTypeId: 12, Type: 1 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) { }
    });
  }

  onRowGroupOpened(params) {
    if (params.node.expanded) {
      this.gridApi.forEachNode(function (node) {
        if (
          node.expanded &&
          node.id !== params.node.id &&
          node.uiLevel === params.node.uiLevel
        ) {
          node.setExpanded(false);
        }
      });
    }
  }

  getDeviceTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CREDIT_DOCUMENT_TYPES_ENUME).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.deviceTypes = data.ResponseObject;
        }
      });
  }

  getStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_DOCUMENT_STATES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.status = data.ResponseObject;
        }
      });
  }

  getProviders() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.providers = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getCategoryEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CLIENT_CATEGORIES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.categories = data.ResponseObject;
        }
      });
  }

  onGridReady1(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource1());
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  exportToCsv() {
    delete this.filteredData.StartDate;
    delete this.filteredData.EndDate;
    this.exportService.exportToCsv(Controllers.REPORT, Methods.EXPORT_INTERNET_BET, { ...this.filteredData, adminMenuId: this.adminMenuId });
  }


}
