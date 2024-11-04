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
import { formatDateTime, formattedNumber } from 'src/app/core/utils';

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
  fromDate: any;
  public toDate: any;
  public clientData = {};
  public partners = [];
  public partnerId;
  public providers = [];
  public deviceTypes = [];
  public categories = [];
  public status = [];
  public show = false;
  public filteredData;

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
  private detailGridParams: any;
  nestedColumnDefs = [];
  DetailRowData = [];
  detailCellRendererParams: any = {
    detailGridOptions: {
      rowHeight: 47,
      defaultColDef: {
        sortable: true,
        filter: true,
        flex: 1,
      },
      components: this.nestedFrameworkComponents,
      columnDefs: this.nestedColumnDefs,
    },

    getDetailRowData: params => {
      if (params && params.data.ProductName == 'Sportsbook') {
        this.setSportsbookColumnDefs();
      }

      if (params && params.data.ProviderName == "Evolution") {
        this.setEvalutionColumnDefs();
      }

      if (params &&  params?.data.ProductName == "pregame") {
        this.setBGGamesColdefs();
      }

      if ((params?.data?.ProductName == 'Sportsbook') || (params?.data?.ProviderName == "Evolution") || (params?.data.ProductName == "pregame")) {
        const row = params.data;
        this.apiService.apiPost(this.configService.getApiUrl, row.BetDocumentId,
          true, Controllers.REPORT, Methods.GET_BET_INFO)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.DetailRowData = data.ResponseObject;
              params.data.HelpData = this.DetailRowData ? data.ResponseObject : null;
              params.data.DealerId = data.ResponseObject?.DealerId;
              params.data.DealerName = data.ResponseObject?.DealerName;
              params.data.TableID = data.ResponseObject?.TableID;
              params.data.TableName = data.ResponseObject?.TableName;
              params.data.RoundId = data.ResponseObject?.RoundId;
              params.data.RoundDuration = data.ResponseObject?.RoundDuration;
              params.data.RoundDateTime = data.ResponseObject?.RoundDateTime;
              params.data._Result = data.ResponseObject?.Result;
              if (params.data._isUpdated != true) {
                this.gridApi.redrawRows({ rowNodes: [params.node] });
              }
              params.data._isUpdated = true;
              if (params && params.data.ProductName == 'Sportsbook') {
                params.successCallback(data.ResponseObject?.BetSelections);
              } else if (params && params.data.ProviderName == "Evolution") {
                let result: any = [];
                if (data.ResponseObject) {
                  result = data.ResponseObject?.Results?.Participants[0][0]?.bets;
                }
                params.successCallback(result);
              } else if (params?.data.ProductName == "pregame") {
                params.successCallback(data.ResponseObject?.events);
              }

            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
              params.successCallback(undefined);
            }
          });
      }
    },
    refreshStrategy: 'everything',
    template: params => {
      if (!this.detailGridParams || this.detailGridParams.data.BetDocumentId != params.data.BetDocumentId) {
        this.detailGridParams = params;
      }

      const isEmpty = !params.data.HelpData ? "flex" : "none";
      const hasData = !!params.data.HelpData ? "block" : "none";
      const isSportsbook = params.data.ProductName == 'Sportsbook' ? "block" : "none";
      const isEvolution = params.data.ProviderName == 'Evolution' ? "block" : "none";

      const amount = params.data.HelpData?.BetAmount ? params.data.HelpData.BetAmount.toFixed(2) : '';
      const betDate = params.data.HelpData?.BetDate ? params.data.HelpData?.BetDate : '';
      const coefficient = params.data.HelpData?.Coefficient ? params.data.HelpData?.Coefficient : '';

      const dealerId = params.data.DealerId ? params.data.DealerId : '';
      const dealerName = params.data.DealerName ? params.data.DealerName : '';
      const TableID = params.data.TableID ? params.data.TableID : '';
      const TableName = params.data.TableName ? params.data.TableName : '';
      const roundId = params.data.RoundId ? params.data.RoundId : '';
      const roundDuration = params.data.RoundDuration ? params.data.RoundDuration : '';
      const roundDateTime = params.data.RoundDateTime ? params.data.RoundDateTime : '';
      const _Info = params.data?.HelpData?.Results?.Info ? JSON.stringify(params.data?.HelpData?.Results?.Info, null, 4) : '';
      let info = '';
      if (_Info) {
        info = _Info.replace(/{|}/g, '')
      }

      return `
        <div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box; overflow-y: auto">
          <div style="display: ${isEmpty}; height: 10%; color: #000; margin-bottom: 15px; justify-content: center; font-weight: 700; font-size: 24px">No information</div>
          <div style="height: 100%; display: ${hasData}">
            <div style="font-weight: 700; font-size: 24px; margin-bottom: 8px">Information</div>
            <div style="height: 10%; display: ${isSportsbook}; font-size: 16px; color: #076192">Amount: ${amount}</div>
            <div style="height: 10%; display: ${isSportsbook}; font-size: 16px; color: #076192">Bet Date: ${betDate}</div>
            <div style="height: 10%; display: ${isSportsbook}; font-size: 16px; color: #076192">Coefficient: ${coefficient}</div>

            <div style="display: ${isEvolution}">
              <div style="height: 10%; font-size: 16px; color: #076192">Dealer Id: ${dealerId}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Dealer Name: ${dealerName}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Table Id: ${TableID}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Table Name: ${TableName}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Round Id: ${roundId}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Round Duration: ${roundDuration}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Round Date Time: ${roundDateTime}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Info: ${info}</div>
            </div>

            <div style="height: 100%;">
              <div style="height: 10%; color: #000; margin-bottom: 15px; display: flex; justify-content: center; font-weight: 700; font-size: 24px">Selections</div>
              <div ref="eDetailGrid" style="height: 85%; "></div>
            </div
          </div>
        </div>`
    }
  };

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
        headerName: 'Clients.BonusAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusAmount',
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
    this.fromDate = formatDateTime(fromDate);
    this.toDate = formatDateTime(toDate);    
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.partnerId = event.partnerId ? event.partnerId : null;
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
                PossibleWin: `${formattedNumber(data.ResponseObject.TotalPossibleWinAmount)} ${this.playerCurrency}`,
                BetAmount: `${formattedNumber(data.ResponseObject.TotalBetAmount)} ${this.playerCurrency}`,
                WinAmount: `${formattedNumber(data.ResponseObject.TotalWinAmount)} ${this.playerCurrency}`,
                Profit: `${formattedNumber(data.ResponseObject.TotalProfit)} ${this.playerCurrency}`,
                BonusWinAmount: `${formattedNumber(data.ResponseObject.TotalBonusWinAmount)} ${this.playerCurrency}`,
                BonusAmount: `${formattedNumber(data.ResponseObject.TotalBonusBetAmount)} ${this.playerCurrency}`,

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

  setEvalutionColumnDefs() {
    this.nestedColumnDefs.length = 0;
    this.nestedColumnDefs.push({
      headerName: 'Payments.TransactionId',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'transactionId',
      resizable: true,
      filter: false,
    },
      {
        headerName: 'Common.Code',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'code',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.Stake',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'stake',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.Payout',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'payout',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.PlacedOn',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'placedOn',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Bonuses.Description',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'description',
        resizable: true,
        filter: false,
      },);
  }

  setSportsbookColumnDefs() {
    this.nestedColumnDefs.length = 0;
    this.nestedColumnDefs.push({
      headerName: 'Common.EventDate',
      field: 'EventDate',
      filter: 'agDateColumnFilter',
      resizable: true,
      cellRenderer: function (params) {
        if (params.node.rowPinned) {
          return '';
        }
        let datePipe = new DatePipe("en-US");
        let dat = datePipe.transform(params.data.EventDate, 'medium');
        return `${dat}`;
      },
    },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.RegionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.MarketName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.MatchId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'VirtualGames.RoundId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RoundId',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Segments.SelectionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionId',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.SelectionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.UnitName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UnitName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.Coefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coefficient',
        resizable: true,
        filter: false,
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
        resizable: true,
        filter: false,
        cellRenderer: params => {
          let isLiv = params.data.IsLive;
          let show = isLiv ? 'Live' : 'Prematch';
          return `${show}`;
        }
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        filter: false,
      },
    )
  }

  setBGGamesColdefs() {
    this.nestedColumnDefs.length = 0;
    this.nestedColumnDefs.push({
      headerName: 'Common.Name',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'name',
      resizable: true,
      filter: false,
    },
      {
        headerName: 'Common.SelName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'selName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.OddName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'oddName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.OddValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'oddValue',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.EventTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'extra.eventTime',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.EventScore',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'extra.eventScore',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Bonuses.TimeAddedToBetslip',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'extra.timeAddedToBetslip',
        resizable: true,
        filter: false,
      }
    );
  }


}
