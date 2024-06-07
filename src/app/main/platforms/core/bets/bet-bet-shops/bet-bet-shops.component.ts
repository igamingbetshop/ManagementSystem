import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import 'ag-grid-enterprise';
import { CommonDataService } from 'src/app/core/services/common-data.service';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { Paging } from 'src/app/core/models';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { AgGridAngular } from 'ag-grid-angular';
import { DatePipe } from '@angular/common';
import { SnackBarHelper } from '../../../../../core/helpers/snackbar.helper';
import { DateAdapter } from '@angular/material/core';
import { OddsTypePipe } from '../../../../../core/pipes/odds-type.pipe';
import { LocalStorageService } from '../../../../../core/services';
import { Controllers, Methods, OddsTypes, ModalSizes, ObjectTypes, GridMenuIds } from 'src/app/core/enums';
import { formattedNumber } from "../../../../../core/utils";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import {ExportService} from "../../services/export.service";
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-bet-bet-shops',
  templateUrl: './bet-bet-shops.component.html',
  styleUrls: ['./bet-bet-shops.component.scss']
})
export class BetBetShopsComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  public clientData = {};
  public rowData = [];
  public DetailRowData;
  public helpData;
  public nestedFrameworkComponents = {
    numericEditor: NumericEditorComponent,
    textRditor: TextEditorComponent,
  };
  public rowClassRules;
  private detailGridParams: any;
  public betTypes = [];
  public gameProviders = [];
  public documentStates = [];
  public partners: any[] = [];
  public betShopGroups: any[] = [];

  public partnerId = null;
  public betshopId = null;

  public Currency;
  public totalBetAmount;
  public TotalWinAmount;
  public TotalProfit;
  public selectedItem = 'today';
  private oddsType: number;
  public fromDate;
  public toDate;

  public detailCellRendererParams: any = {
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
          headerName: 'Common.EventDate',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'EventDate',
          filter: 'agDateColumnFilter',
          resizable: true,
          cellRenderer: function (params) {
            if (params.node.rowPinned) {
              return '';
            }
            let datePipe = new DatePipe('en-US');
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
          headerName: 'Sport.MarketName',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MarketName',
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
          headerName: 'Common.Unit',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'UnitName',
          resizable: true,
          filter: false,
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
          headerName: 'Sport.CompetitionName',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'CompetitionName',
          resizable: true,
          filter: false,
        },

      ],
      onGridReady: params => {
      },
    },

    getDetailRowData: params => {
      if (params) {
        const row = params.data;
        this.apiService.apiPost(this.configService.getApiUrl, row.BetDocumentId,
          true, Controllers.REPORT, Methods.GET_BET_INFO)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.DetailRowData = data.ResponseObject;
              params.data._Barcode = data.ResponseObject.Barcode;
              params.data._Coefficient = data.ResponseObject.Coefficient;
              if (params.data._isUpdated != true) {
                this.gridApi.redrawRows({ rowNodes: [params.node] });
              }
              params.data._isUpdated = true;
              params.successCallback(data.ResponseObject.BetSelections);
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
            }
          });
      }

    },

    refreshStrategy: 'everything',
    template: params => {
      const barcode = params?.data?._Barcode;
      const coefficient = params?.data?._Coefficient;
      return `
        <div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box; overflow-y: auto">
          <div style="font-weight: 700; font-size: 24px">Information</div>
          <div style="height: 10%; font-size: 16px; color: #076192">Amount: ${params.data.BetAmount?.toFixed(2)}</div>
          <div style="height: 10%; font-size: 16px; color: #076192">Barcode: ${barcode}</div>
          <div style="height: 10%; font-size: 16px; color: #076192">Bet Date: ${params.data.BetDate}</div>
          <div style="height: 10%; font-size: 16px; color: #076192">Coefficient: ${coefficient}</div>

          <div style="height: 10%; margin-bottom: 15px; display: flex; justify-content: center; font-weight: 700; font-size: 24px";>Selections</div>
          <div ref="eDetailGrid" style="height: 90%;"></div>
        </div>`
    }

  };


  constructor(
    protected injector: Injector,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>,
    private localStorageService: LocalStorageService,
    private exportService:ExportService
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.BET_SHOPS;
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetDocumentId',
        resizable: true,
        sortable: true,
        minWidth: 120,
        cellRenderer: 'agGroupCellRenderer',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Products.ExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetExternalTransactionId',
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
        headerName: 'Products.Product',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        cellStyle: { cursor: 'pointer' },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'BetShops.BetShop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        cellStyle: { cursor: 'pointer' },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'BetShops.BetShopId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopId',
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
        headerName: 'Clients.CashDeskId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CashDeskId',
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
        headerName: 'Clients.CashierId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CashierId',
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
        headerName: 'Clients.ProductId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductId',
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
        headerName: 'Partners.Provider',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderId',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.Round',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RoundId',
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
        headerName: 'Clients.BetType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetTypeId',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.PossibleWin',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PossibleWin',
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
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
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
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
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
        headerName: 'Payments.TicketNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TicketNumber',
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
        headerName: 'Common.BetDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetDate',
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: function (params) {
          if (params.node.rowPinned) {
            return '';
          }
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.BetDate, 'medium');
          return `${dat}`;
        },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.WinDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinDate',
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: function (params) {
          if (params.node.rowPinned) {
            return '';
          }
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.WinDate, 'medium');
          return `${dat}`;
        },
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
        minWidth: 140,
        filter: false,
        cellRenderer: params => {
          let keyData = params.data.HasNote;
          let newButton = `<button class="button-view-1" data-action-type="add">Add Note</button>`;
          let newButton2 = `<button class="button-view-2" data-action-type="add">Add</button>
             <button class="button-view-2" data-action-type="view">View</button>`;
          if (keyData === false) {
            return newButton;
          } else if (keyData === true) {
            return newButton2;
          }
        }
      },
    ];
    this.rowClassRules = {
      'bets-status-2': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === 'Won' || numSickDays === 'Approved';
      },
      'bets-status-1': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === 'Lost';
      },
      'bets-status-3': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === 'Deleted';
      },
    };
  }

  ngOnInit() {
    this.setTime();
    this.gridStateName = 'bets-betshop-bets-grid-state';
    this.partners = this.commonDataService.partners;
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;
    this.Currency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    this.GetBetshopGroups();
    this.GetDocumentState();
    this.GetBetTypes();
    this.GetProviders();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  GetProviders() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gameProviders = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  GetBetshopGroups() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_BET_SHOP_GROUPS_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.betShopGroups = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  GetDocumentState() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_DOCUMENT_STATES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.documentStates = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  GetBetTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_CREDIT_DOCUMENT_TYPES_ENUME)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.betTypes = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });      //GET_CREDIT_DOCUMENT_TYPES_ENUME
        }
      });
  }


  onBetshioChange(value) {
    this.betshopId = null;
    this.betshopId = value;
    this.getCurrentPage();
  }

  getDateTime(): Date {
    const dateTime = new Date();
    dateTime.setHours(0);
    dateTime.setMinutes(0);
    dateTime.setSeconds(0);
    dateTime.setMilliseconds(0);
    return dateTime;
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

  onRowGroupOpened(params) {

    // const row = params.data;
    //     this.apiService.apiPost(this.configService.getApiUrl, row.BetDocumentId,
    //       true, Controllers.REPORT, Methods.GET_BET_INFO)
    //       .pipe(take(1))
    //       .subscribe(data => {
    //       if(data.ResponseCode === 0)
    //       {
    //         this.helpData = data.ResponseObject;
    //       }
    //     });

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

  async addNotes(params) {
    const { AddNoteComponent } = await import('../../../../components/add-note/add-note.component');
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: { ObjectId: params.BetDocumentId, ObjectTypeId: ObjectTypes.Document }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    });
  }

  async openNotes(params) {
    const { ViewNoteComponent } = await import('../../../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: { ObjectId: params.BetDocumentId, ObjectTypeId: ObjectTypes.Document, Type: 1 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    });
  }

  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute('data-action-type');

      switch (actionType) {
        case 'add':
          return this.addNotes(data);
        case 'view':
          return this.openNotes(data);
      }
    }
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        let paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.PartnerId = this.partnerId;
        paging.BetShopGroupId = this.betshopId;

        paging.BetDateFrom = this.fromDate;
        paging.BetDateBefore = this.toDate;
        this.clientData = paging;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        if (window['searchData']) {
          paging = this.getQuickFindData(paging);
        }

        this.getBetShopBets(paging, params);
      },
    };
  }

  getQuickFindData(paging: Paging): Paging {
    const searchData = window['searchData'];
    paging.Ids = {
      IsAnd: true,
      ApiOperationTypeList: [{
        OperationTypeId: 1,
        IntValue: Number(searchData.value)
      }]
    };
    paging.BetDateFrom = new Date('1975,1,1 0:0:0');
    window['searchData'] = '';
    return paging;
  }

  getBetShopBets(paging: Paging, params): void {
    this.apiService.apiPost(this.configService.getApiUrl, paging,
      true, Controllers.REPORT, Methods.GET_BET_SHOP_BETS_DASHBOARD)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          const mappedRows = data.ResponseObject.Entities;
          mappedRows.forEach((payment) => {
            let PartnerName = this.partners.find((item) => {
              return item.Id == payment.PartnerId;
            });
            if (PartnerName) {
              payment['PartnerId'] = PartnerName.Name;
            }
            let GameProviderName = this.gameProviders.find((item) => {
              return item.Id == payment.GameProviderId;
            });
            if (GameProviderName) {
              payment['GameProviderId'] = GameProviderName.Name;
            }
            let StateName = this.documentStates.find((item) => {
              return item.Id == payment.State;
            });
            if (StateName) {
              payment['State'] = StateName.Name;
            }
            let BetTypeName = this.betTypes.find((item) => {
              return item.Id == payment.BetTypeId;
            });
            if (BetTypeName) {
              payment['BetTypeId'] = BetTypeName.Name;
            }
          });

          this.totalBetAmount = data.ResponseObject.TotalBetAmount;
          this.TotalWinAmount = data.ResponseObject.TotalWinAmount;
          this.TotalProfit = data.ResponseObject.TotalProfit;

          this.gridApi?.setPinnedBottomRowData([{
            Profit: `${formattedNumber(this.TotalProfit)} ${this.Currency}`,
            BetAmount: `${formattedNumber(this.totalBetAmount)} ${this.Currency}`,
            WinAmount: `${formattedNumber(this.TotalWinAmount)} ${this.Currency}`,
          }
          ]);

          params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => {
      this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
    }, 0);
  }

  exportToCsv() {
    this.exportService.exportToCsv( Controllers.REPORT, Methods.EXPORT_BET_SHOP_BETS, { ...this.clientData, adminMenuId: this.adminMenuId });
  }
}
