import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from "@angular/material/core";
import { MatDialog } from '@angular/material/dialog';
import 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent,
  DragStoppedEvent,
  GetContextMenuItemsParams, GetRowIdFunc,
  GetRowIdParams,
  MenuItemDef
} from 'ag-grid-community';

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import { Paging } from 'src/app/core/models';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { AuthService, CommonDataService, LocalStorageService } from "../../../../../../core/services";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { SportsbookSignalRService } from "../../../services/signal-r/sportsbook-signal-r.service";
import { CustomTooltip } from 'src/app/main/components/grid-common/tooltip.component';
import { AVAILABLEBETCATEGORIES, BETAVAILABLESTATUSES, BETSTATUSES, BET_SELECTION_STATUSES } from "../../../../../../core/constantes/statuses";
import { GridRowModelTypes, OddsTypes, ModalSizes, GridMenuIds } from 'src/app/core/enums';
import { formattedNumber } from "../../../../../../core/utils";
import { syncColumnNestedSelectPanel, syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { Subscription } from "rxjs";
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

declare var window: any;
@Component({
  selector: 'app-by-bets',
  templateUrl: './by-bets.component.html',
  styleUrls: ['./by-bets.component.scss']
})
export class ByBetsComponent extends BasePaginatedGridComponent implements OnInit, OnDestroy {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  public subscription: Subscription = new Subscription();

  public availableStatuses = BETAVAILABLESTATUSES;

  public availableBetCategories = AVAILABLEBETCATEGORIES;

  public selectedItem = 'today';
  public partners = [];
  public partnersFilters = [];
  public betStatuses = BETSTATUSES;
  public selectionStatuses = BET_SELECTION_STATUSES
  private isPopupOpen = false;

  public genders = [
    { "Name": "Male", "Id": 1 },
    { "Name": "Female", "Id": 2 }
  ];

  public betTypesModel = [
    { "Name": this.translate.instant('Sport.Single'), "Id": 1 },
    { "Name": this.translate.instant('Sport.Multiple'), "Id": 2 },
    { "Name": this.translate.instant('Sport.System'), "Id": 3 },
    { "Name": this.translate.instant('Sport.Chain'), "Id": 4 },
    { "Name": this.translate.instant('Sport.Teaser'), "Id": 5 }

  ];

  public commentTypes: any[] = [];
  public availableBetCategoriesStatus: number = -1;
  public availableStatusesStatus: number = -1;
  public show = false;
  public path = "report/bets";
  public rowData = [];
  public rowData1 = [];
  public rowModelType1: string = GridRowModelTypes.CLIENT_SIDE;
  public isLiveUpdateOn: boolean;
  public isReconnected: boolean;

  public frameworkComponents = {
    selectRenderer: SelectRendererComponent,
    customTooltip: CustomTooltip,
    agDropdownFilter: AgDropdownFilter,
  };
  public oddsType: number;
  public fromDate = new Date();
  public toDate = new Date();
  private betCurrency: string = '';
  public tooltipShowDelay = 1500;
  public betsCount = 0;
  public betInfo = {
    SelectionCount: 0,
    SystemOutComeValue: null,
    TeaserId: null,
    Point: null,
    Info: null,
    Multiway: false
  };
  private totalCount: number;
  private totals = {
    totalBetAmount: 0,
    totalWinAmount: 0,
    totalProfit: 0
  };

  public filteredData: any;
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.Id;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private commonDataService: CommonDataService,
    private _signalR: SportsbookSignalRService,
    public dialog: MatDialog,
    private authService: AuthService,
    private ref: ChangeDetectorRef,
    public dateAdapter: DateAdapter<Date>,
    private localStorageService: LocalStorageService
  ) {

    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.defaultColDef = {
      width: 110,
      tooltipComponent: 'customTooltip',
      tooltipComponentParams: { color: '#C1D7E3;' },
      menuTabs: ['filterMenuTab', 'generalMenuTab'],
      resizable: true,
      sortable: true,
    };
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        checkboxSelection: true,

        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500', 'padding-left': '10px', },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Partners.PlatformId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalBetId',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return { color: 'white', backgroundColor: params.data.CategoryColor };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'SkillGames.PlayerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        onCellClicked: (event: CellClickedEvent) => this.goToPlayer(event),
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return { color: 'white', backgroundColor: params.data.CategoryColor, cursor: 'pointer' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Products.CategoryId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PlayerCategoryId',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return { color: 'white', backgroundColor: params.data.CategoryColor, cursor: 'pointer' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.Gender',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Gender',
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.genders,
        },
      },
      {
        headerName: 'Common.CountryCode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CountryCode',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset',],
          closeOnApply: true,
          filterOptions: this.partnersFilters,
        },
      },
      {
        headerName: 'Common.TypeName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeId',
        sortable: false,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.betTypesModel,
        },
      },
      {
        headerName: 'BetShops.BetShopId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopId',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'BetShops.BetShop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShop',
        resizable: true,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Clients.CashierId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CashierId',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Ip',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Ip',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.MatchState',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsLive',
        filter: false,
        cellRenderer: params => {
          let isLiv = params.data.IsLive;
          let show = isLiv ? 'Live' : 'Prematch';
          return `${show}`;
        },
        cellStyle: (params) => {
          if (params.node.rowPinned) {
            return { display: 'none' };
          }

          if (params.data.IsLive == true) {
            return { color: 'black', backgroundColor: '#BCE1BA', borderRadius: '4px' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.IsFreeBet',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsFreeBet',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.Coefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coefficient',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
        filter: 'agNumberColumnFilter',
        tooltipField: 'BetAmount',
        tooltipComponentParams: { color: '#ececec' },

        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: (params) => {
          if (params.node.rowPinned) {
            return `${formattedNumber(this.totals.totalBetAmount)} ${this.betCurrency}`;
          }

          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.BetAmount, '1.2-2');
          return `${data}`;
        },
      },
      {
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
        filter: 'agNumberColumnFilter',
        tooltipComponent: 'customTooltip',
        tooltipField: 'WinAmount',
        tooltipComponentParams: { color: '#ececec' },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: (params) => {
          if (params.node.rowPinned) {
            return `${formattedNumber(this.totals.totalWinAmount)}  ${this.betCurrency}`;
          }
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.WinAmount, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'Sport.ProfitAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProfitAmount',
        filter: 'agNumberColumnFilter',
        tooltipField: 'ProfitAmount',
        tooltipComponentParams: { color: '#ececec' },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.BonusWinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusWinAmount',
        filter: 'agNumberColumnFilter',
        tooltipField: 'BonusWinAmount',
        tooltipComponentParams: { color: '#ececec' },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.SelectionsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionsCount',
        filter: 'agNumberColumnFilter',
        tooltipField: 'SelectionsCount',
        tooltipComponentParams: { color: '#ececec' },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.Stake',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Stake',
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
        field: 'CurrencyId',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: false,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.betStatuses,
        },
        cellClass: params => {
          let state = params.data?.State;
          if (!params.data?.State) {
            return null;
          }

          return `status-${state.toLowerCase()}`;
        },
        cellStyle: (params) => {
          if (params.node.rowPinned) {
            return { display: 'none' };
          }
          if (params.data.State == true) {
            return { color: 'black', backgroundColor: '#BCE1BA', borderRadius: '4px' };
          } else if (params.data.State == "Waiting") {
            return { color: 'white', backgroundColor: '#ffb09c', borderRadius: '4px' };
          } else {
            return null;
          }

        }
      },
      {
        headerName: 'Payments.TicketNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TicketNumber',
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
        filter: 'agDateColumnFilter',
        cellRenderer: (params) => {
          if (params.node.rowPinned || params.data.BetDate === null) {
            return '';
          }

          let datePipe = new DatePipe("en-US");
          let time = datePipe.transform(params.data.BetDate, 'HH:mm:ss');
          let date = datePipe.transform(params.data.BetDate, 'mediumDate');

          return time && date ? `${time} ${date}` : '';
        },

        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.CalculationDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CalculationDate',
        filter: 'agDateColumnFilter',
        cellRenderer: (params) => {
          if (params.node.rowPinned || params.data.CalculationDate === null) {
            return '';
          }
          let datePipe = new DatePipe("en-US");
          let time = datePipe.transform(params.data.CalculationDate, 'HH:mm:ss');
          let date = datePipe.transform(params.data.CalculationDate, 'mediumDate');
          return time && date ? `${time} ${date}` : '';
        },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MatchId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.Competitors',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Competitors',
        resizable: true,
        filter: false,
        sortable: false,
      },
      {
        headerName: 'Sport.SportId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportId',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.Competition',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MarketName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketName',
        resizable: true,
        filter: false,
        sortable: false,
      },
      {
        headerName: 'Common.SelectionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionName',
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.SettlementInfo',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SettlementInfo',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.CommentTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CommentTypeId',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.CommentTypeColor !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.CommentTypeColor, borderRadius: '4px' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.CLVValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Value',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.CommentTypeColor !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.CommentTypeColor, borderRadius: '4px' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.Notes',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'HasNote',
        sortable: false,
        filter: false,
        cellRenderer: params => {
          let keyData = params.data.HasNote;
          let newButton = `<button class="button-view-1" data-action-type="add">Add Note</button>`;
          let newButton2 = `<button class="button-view-2" data-action-type="add">Add</button>
             <button class="button-view-2" data-action-type="view">View</button>`
          if (keyData === false) {
            return newButton;
          } else if (keyData === true) {
            return newButton2;
          }
        },
        cellStyle: function (params) {
          if (params.data.CommentTypeColor !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.CommentTypeColor };
          } else {
            return null;
          }
        }
      }
    ];
  }

  ngOnInit() {
    this.getPartners();
    this.gridStateName = 'report-by-bet-grid-state';
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;
    this.betCurrency = this.localStorageService.get('user')?.CurrencyId;
    this.getCommentTypes();
    this.setTime();
    this._signalR.init();
    this.mapPartnersFilters();
    this.adminMenuId = GridMenuIds.REPORT_BY_BETS;

    this.subscription = this._signalR.reConnectionState$.subscribe(isReconnected => {
      if (this.isLiveUpdateOn) {
        this.isReconnected = isReconnected;
        this.subscribeToUpdates();
      }
    })
  }
  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getCurrentPage();
  }

  onSelectBetCategory(event) {
    this.availableBetCategoriesStatus = event;
    this.getCurrentPage();
  }

  onSelectBetStatus(event) {
    this.availableStatusesStatus = event;
    this.getCurrentPage();
  }
  

  getPartners() {
    this.partners = this.commonDataService.partners.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
  }

  onSelectStatus(params) {
    this.changeBetSelectionStatus(params);
  }

  onSelectChange(params, val) {
    params.ResettleStatus = val;
  }

  isRowSelected() {
    return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length > 0;
  };

  isBetDeleted() {
    if (this.isRowSelected()) {
      return this.agGrid?.api.getSelectedRows()[0]['State'] == "Deleted"
    }
  };

  isWaiting() {
    return this.agGrid?.api.getSelectedRows()[0]['State'] == "Waiting";
  }

  isUncalculated() {
    return this.agGrid?.api.getSelectedRows()[0]['State'] == "Uncalculated";
  };

  changeBetSelectionStatus(request) {
    this.apiService.apiPost('markets/changebetselectionstatus', request).subscribe(response => {
      if (response.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: 'Status successfully updated', Type: "success" });
        // this.getCurrentPage();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: response.Description, Type: "error" });
      }
    })
  }

  getCommentTypes() {
    this.apiService.apiPost('commenttypes').subscribe(data => {
      if (data.Code === 0) {
        this.commentTypes = data.CommentTypes;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  goToFinishedMatchesMarket(ev) {
    const row = ev.data;
    let filter = {
      matchId: row.MatchId,
      PartnerId: 0
    }
    this.apiService.apiPost('matches/match', filter)
      .pipe(take(1))
      .subscribe(data => {
        let res = data.ResponseObject;

        if (res.Status == 1 || res.Status == 0) {
          const url = this.router.serializeUrl(this.router.createUrlTree(['main/sportsbook/matches/active-matches/all-active/active/markets'],
            {
              queryParams: {
                "partnerId": 0,
                "MatchId": row.MatchId,
                'number': row.MatchNumber,
                'name': row.SportName,
                'sportId': row.SportId
              }
            }));
          window.open(url, '_blank');
        } else {
          const url = this.router.serializeUrl(this.router.createUrlTree(['/main/sportsbook/matches/finished/finish/markets'],
            {
              queryParams: {
                "partnerId": 0,
                "finishId": row.MatchId,
                'number': row.MatchNumber,
                'name': row.SportName,
              }
            }));
          window.open(url, '_blank');
        }
      })
  }

  goToPlayer(event) {
    const id = event.data.PlayerId;
    const url = this.router.serializeUrl(this.router.createUrlTree(['main/sportsbook/players/player/main'],
      { queryParams: { "playerId": id } }));
    window.open(url, '_blank');
  }

  async addNotes(params) {
    const { SbAddNoteComponent } = await import('../../../../../components/sb-add-note/sb-add-note.component');
    const dialogRef = this.dialog.open(SbAddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: { CommentTypes: this.commentTypes, BetId: params.Id }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        if (this.gridApi) {
          const rowIdToUpdate = params.Id;
          const displayedRows = this.gridApi.getDisplayedRowCount();

          for (let rowIndex = 0; rowIndex < displayedRows; rowIndex++) {
            const rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);

            if (rowNode && rowNode.data && rowNode.data.Id === rowIdToUpdate) {
              rowNode.data.HasNote = true;
              rowNode.data.CommentTypeId = data.TypeId;
              rowNode.data.CommentTypeColor = data.Color;
              this.gridApi.redrawRows({ rowNodes: [rowNode] });
              break;
            }
          }
        }
      }
    });

  }

  async openNotes(params) {
    const { SbViewNoteComponent } = await import('../../../../../components/sb-view-note/sb-view-note.component');
    const dialogRef = this.dialog.open(SbViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: { CommentTypes: this.commentTypes, BetId: params.Id }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    });
  }

  async openUncalculatedBets(finishedMatches: { [key: string]: any }[]) {
    if (this.isPopupOpen) {
      return;
    }
    this.isPopupOpen = true;

    const uniqueData = [...finishedMatches];
    const { UcalculatedBetsComponent } = await import('./ucalculated-bets/ucalculated-bets.component');
    const dialogRef = this.dialog.open(UcalculatedBetsComponent, {
      width: ModalSizes.LARGE,
      data: uniqueData
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      this.isPopupOpen = false;
      if (data) {
        // logic here
      }
    });
  }

  public onRowClicked(event) {
    this.show = true;
    let row = event.data;
    this.apiService.apiPost('report/selections', { BetId: row.Id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.betInfo = {
            SelectionCount: 0,
            SystemOutComeValue: null,
            TeaserId: null,
            Point: null,
            Info: null,
            Multiway: false
          }
          this.betsCount = 0;

          for (let i = 0; i < data.Selections.length; i++) {
            data.Selections[i].Competitors = data.Selections[i].Competitors.join('-');
            data.Selections[i].ResettleStatus = data.Selections[i].SelectionStatus;
          }
          this.rowData1 = data.Selections;
          this.rowData1.forEach(match => {
            if (match.ForcedChosen) {
              this.betsCount++;
            }
            match['StatusName'] = this.betStatuses.find((status) => status.Id == match.SelectionStatus)?.Name;
          })
          row.Info = !row.Info ? '' : row.Info;
          row.SystemOutCountValue = row.SystemOutCounts === null ? '' : row.SystemOutCounts + '/' + data.Selections.length;
          this.betInfo.Info = row.Info
          if (row?.SystemOutCounts) {
            let numberArray = row?.SystemOutCounts;
            const dataArray: number[][] = JSON.parse(numberArray);
            const extractedArray: number[] | undefined = dataArray[0];
            if (Array.isArray(extractedArray)) {
              const modifiedArray: number[] = extractedArray.map(element => element);
              numberArray = modifiedArray;
            }
            numberArray = numberArray.map(num => num + '/' + data.Selections.length);
            this.betInfo.SystemOutComeValue =
              row?.SystemOutCounts === null ? '' : numberArray;
          }
          this.betInfo.Multiway = data.Selections.some((selection, index, arr) => {
            return arr.slice(index + 1).some(nextSelection => nextSelection.MatchId === selection.MatchId);
          });
          this.betInfo.SelectionCount = data.Selections.length;
          this.betInfo.TeaserId = row.TeaserId;
          this.betInfo.Point = row.Point;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })

    if (event.event.target !== undefined) {
      let data = event.data;
      let actionType = event.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "add":
          return this.addNotes(data);
        case "view":
          return this.openNotes(data);
      }
    }
  }

  showHide() {
    this.show = !this.show;
  }

  calculateBet() {
    const row = this.agGrid.api.getSelectedRows()[0];
    this.apiService.apiPost('report/calculatebet', { "BetId": row.Id, })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getRowById(row.Id);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  recalculateBet() {
    let rows = this.rowData1;
    this.apiService.apiPost('report/recalculatebet', { "Selections": rows })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getRowById(rows['BetId'])
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  getRowById(id) {
    const paging = new Paging();
    paging.PageIndex = this.paginationPage - 1;
    paging.PageSize = Number(this.cacheBlockSize);
    paging.LiveStatus = this.availableStatusesStatus;
    paging.BetCategory = this.availableBetCategoriesStatus;
    paging.FromDate = this.fromDate;
    paging.ToDate = this.toDate;
    paging.Ids = {
      "ApiOperationTypeList": [
        {
          "OperationTypeId": 1,
          "DecimalValue": id,
          "IntValue": id
        }
      ],
      "IsAnd": true
    }

    this.apiService.apiPost('report/bets', paging)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const bet = data.Objects[0];
          this.mapResponseData(bet);
          const displayedRows = this.gridApi.getDisplayedRowCount();
          const rowIdToUpdate = bet.Id;
          for (let rowIndex = 0; rowIndex < displayedRows; rowIndex++) {
            const rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);

            if (rowNode && rowNode.data && rowNode.data.Id === rowIdToUpdate) {
              rowNode.data.State = bet.State;
              this.gridApi.redrawRows({ rowNodes: [rowNode] });
              break;
            }
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  updateRow(id) {

  }

  resendBet() {
    let rows = this.rowData1;
    this.apiService.apiPost('report/resendbet', { Selections: rows })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  acceptBet() {
    const _id = this.agGrid.api.getSelectedRows()[0]['Id'];
    this.apiService.apiPost('report/acceptbet', { BetIds: [_id] })
      .pipe(take(1))
      .subscribe(res => {
        if (res.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: res.Description, Type: "success" });
          this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
        } else {
          SnackBarHelper.show(this._snackBar, { Description: res.Description, Type: "error" });
        }
      })
  }

  async rejectBet() {
    const _id = this.agGrid.api.getSelectedRows()[0]['Id'];
    const path = "rejectbet";
    const message = "Are you sure you want to reject the bet " + _id + "?"
    const { DeleteBetComponent } = await import('./delete-bet/delete-bet.component');
    const dialogRef = this.dialog.open(DeleteBetComponent, {
      width: ModalSizes.MEDIUM,
      data: { CommentTypes: this.commentTypes, Message: message, Path: path, BetId: _id }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      }
    });
  }

  async deleteBet() {
    const _id = this.agGrid.api.getSelectedRows()[0]['Id'];
    const path = "deletebet";
    const message = "Are you sure you want to delete the bet " + _id + "?";
    const { DeleteBetComponent } = await import('./delete-bet/delete-bet.component');
    const dialogRef = this.dialog.open(DeleteBetComponent, {
      width: ModalSizes.MEDIUM,
      data: { CommentTypes: this.commentTypes, Message: message, Path: path, BetId: _id }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      }
    });
  }

  toggleLiveUpdate(event) {
    this.isLiveUpdateOn = !event;

    console.log(this.isLiveUpdateOn, "isLiveUpdateOn");
    
    if (!this.isLiveUpdateOn) {
      
      this.subscribeToUpdates();
      console.log("subscribing to bets");
    } else {
      
      this.unSubscribeFromUpdates();
      console.log("unsubscribing from bets");
    }
  }

  go() {
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnNestedSelectPanel();
    syncColumnSelectPanel();
    syncColumnReset();
    this.gridApi = params.api;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onDragStopped(event: DragStoppedEvent) {
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.LiveStatus = this.availableStatusesStatus;
        paging.BetCategory = this.availableBetCategoriesStatus;
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        this.changeFilerName(params.request.filterModel, ['ExternalBetId'], ['PlatformId']);
        this.setSort(params.request.sortModel, paging, "OrderByDescending");
        this.setFilterDropdown(params, ['State', 'PartnerName']);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;

        this.apiService.apiPost('report/bets', paging)
          .pipe(take(1))
          .subscribe(ResponseObject => {
            if (ResponseObject.Code === 0) {

              const mappedRows = ResponseObject.Objects;
              mappedRows.map((bet) => {
                this.mapResponseData(bet);
                return bet;
              });
              this.totals.totalBetAmount = ResponseObject.TotalBetAmount;
              this.totals.totalWinAmount = ResponseObject.TotalWinAmount;
              this.totals.totalProfit = ResponseObject.TotalProfit;
              this.gridApi?.setPinnedBottomRowData([{
                // BetAmount: `${formattedNumber(this.totals.totalBetAmount)} ${this.betCurrency}`,
                // WinAmount: `${formattedNumber(this.totals.totalWinAmount)}  ${this.betCurrency}`,
                ProfitAmount: `${formattedNumber(this.totals.totalProfit)} (${(this.totals.totalProfit / this.totals.totalBetAmount * 100).toFixed(2)}%) ${this.betCurrency}`,
              }
              ]);
              window.rowDataServerSide = ResponseObject.Objects;
              this.totalCount = ResponseObject.TotalCount;
              params.success({ rowData: ResponseObject.Objects, rowCount: this.totalCount });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: ResponseObject.Description, Type: "error" });
            }
          });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  private subscribeToUpdates() {
    const user = this.authService.getUser;
    const data = {
      Token: user.Token,
      UserId: user.UserId,
      TimeZone: this.configService.timeZone,
      LanguageId: localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang'),
      CurrencyId: user.CurrencyId,
    };

    let subscribeRequest = Object.assign(data, this.filteredData);
    this._signalR.connection.on('onBet', this.onBet);
    this._signalR.connection.on('onFinishedMatch', this.onFinishedMatch);
    this._signalR.connection.invoke('SubscribeToBets', subscribeRequest)
      .then(() => {
        this.isLiveUpdateOn = true;
        SnackBarHelper.show(this._snackBar, { Description: 'You have successfully subscribed to the live event.', Type: "success" });
      })
      .catch((err) => {
        SnackBarHelper.show(this._snackBar, { Description: "You have encountered an error while trying to subscribe to the live event.", Type: "error" });
      });
  }

  private unSubscribeFromUpdates() {
    this._signalR.connection.off('onBet', this.onBet);
    this._signalR.connection.invoke('UnSubscribeFromBets')
      .then(() => {
        this.isLiveUpdateOn = false;
        console.log("unsubscribe from bets");
      })
      .catch((err) => {
        console.log("unsubscribe from bets error");
      });
  }

  onFinishedMatch = (data) => {
    this.openUncalculatedBets(data).then(() => { });
  }

  onBet = (bet) => {
    this.mapResponseData(bet);
    this.totalCount += 1;
    this.totals.totalBetAmount = this.totals.totalBetAmount + bet.BetAmount;
    this.totals.totalWinAmount = this.totals.totalWinAmount + bet.WinAmount;
    this.totals.totalProfit = this.totals.totalProfit + bet.ProfitAmount;

    this.gridApi?.setPinnedBottomRowData([{
      BetAmount: `${formattedNumber(this.totals.totalBetAmount)} ${this.betCurrency}`,
      WinAmount: `${formattedNumber(this.totals.totalWinAmount)}  ${this.betCurrency}`,
      ProfitAmount: `${formattedNumber(this.totals.totalProfit)} (${(this.totals.totalProfit / this.totals.totalBetAmount * 100).toFixed(2)}%) ${this.betCurrency}`
    }]);
    this.gridApi.applyServerSideTransaction({addIndex:0,add:[bet]});
    this.playAlert();
  }

  mapResponseData(bet) {
    bet.Competition = bet.CompetitionName;
    bet['Gender'] = this.genders.find((gender) => gender.Id == bet.Gender)?.Name;
    bet['TypeId'] = this.betTypesModel.find((betType) => betType.Id == bet.TypeId)?.Name;
    bet['State'] = this.betStatuses.find((State) => State.Id == bet.State)?.Name;
    bet['CommentTypeColor'] = this.commentTypes.find((comment) => comment.Id == bet.CommentTypeId)?.Color;
    bet['CommentTypeName'] = this.commentTypes.find((comment) => comment.Id == bet.CommentTypeId)?.Name;
    bet['SystemOutCountValue'] = bet.SystemOutCounts ? '' : bet.SystemOutCounts + '/...';
    bet['Competitors'] = bet['Competitors'].join("-");
    bet['Info'] = bet.Info ? (bet.Info) : '';
    bet.CalculationDate = bet.CalculationDate ? bet.CalculationDate : '';
  }

  playAlert() {
    let sound = new Audio("assets/sound/Messenger_Facebook.mp3");
    sound.addEventListener("canplaythrough", (event) => {
      sound.play();
    });
  }

  mapPartnersFilters(): void {
    this.partnersFilters.push("empty");
    this.partners.forEach(field => {
      this.partnersFilters.push({
        displayKey: field.Name,
        displayName: field.Name,
        predicate: (_,) => false,
        numberOfInputs: 0,
      });
    })
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  onBlockMatch(params): void {
    const row = params.data;
    if (row.StatusName != "Uncalculated") return
    const data = {
      MarketId: row.MarketId,
      MatchId: row.MatchId,
      IsBlocked: true
    };

    this.apiService.apiPost('markets/updatemarket', data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.agGrid.api.getColumnDef('save').cellRendererParams.isDisabled = true;
          SnackBarHelper.show(this._snackBar, { Description: "Blocked", Type: "succses" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getContextMenuItemsForBets(params: GetContextMenuItemsParams): (string | MenuItemDef)[] {
    const result: (string | MenuItemDef)[] = [
      'copy',
    ];
    return result;
  }

  exportToCsv() {
    this.apiService.apiPost('report/exportbets',  {...this.filteredData, adminMenuId: this.adminMenuId}).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        let iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.configService.defaultOptions.SBApiUrl + '/' + data.ResponseObject.ExportedFilePath);
        iframe.setAttribute("style", "display: none");
        document.body.appendChild(iframe);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  exportMatchGrid() {
    this.apiService.apiPost('report/exportbetselections',  {...this.filteredData, adminMenuId: this.adminMenuId}).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        let iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.configService.defaultOptions.SBApiUrl + '/' + data.ResponseObject.ExportedFilePath);
        iframe.setAttribute("style", "display: none");
        document.body.appendChild(iframe);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }


  onExportMatchGrid() {
    this.apiService.apiPost('report/exportbets',  {...this.filteredData, adminMenuId: this.adminMenuId}).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        let iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.configService.defaultOptions.SBApiUrl + '/' + data.ResponseObject.ExportedFilePath);
        iframe.setAttribute("style", "display: none");
        document.body.appendChild(iframe);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.subscription.unsubscribe();
    this.unSubscribeFromUpdates();
  }

}

