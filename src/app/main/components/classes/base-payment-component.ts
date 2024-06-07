import { Directive, inject, Injector, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";

import { BasePaginatedGridComponent } from "./base-paginated-grid-component";
import { CommonDataService, LocalStorageService } from 'src/app/core/services';
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from 'rxjs/operators';
import { MatDialog } from "@angular/material/dialog";
import 'ag-grid-enterprise';

import { Paging } from 'src/app/core/models';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { CoreApiService } from "../../platforms/core/services/core-api.service";
import { AgGridAngular } from "ag-grid-angular";
import { SnackBarHelper } from "../../../core/helpers/snackbar.helper";
import { Controllers, Methods, OddsTypes, ModalSizes, ObjectTypes } from "src/app/core/enums";
import { formattedNumber } from "../../../core/utils";
import { syncColumnReset, syncColumnSelectPanel, syncPaginationWithBtn } from "src/app/core/helpers/ag-grid.helper";
import { AgDropdownFilter } from "../grid-common/ag-dropdown-filter/ag-dropdown-filter.component";
import { AgDateTimeFilter } from "../grid-common/ag-date-time-filter/ag-date-time-filter.component";
import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-enterprise";
import { CellClickedEvent } from "ag-grid-community";
import { DateHelper } from "../partner-date-filter/data-helper.class";
import { ExportService } from "../../platforms/core/services/export.service";

@Directive()
export class BasePaymentComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public clientId: number;
  public hasNote: boolean = false;
  public partners: any[] = [];
  public paymentStatus: any[] = [];
  public frameworkComponents;
  public filteredData;
  private PartnerId;
  public selectedItem = 'today';
  private urlSegment: string = '';
  private type: number = 0;
  public paymentVerified;
  public payment;
  public paymentInfo;
  public partnerName;
  columnDefs = [];

  protected commonDataService: CommonDataService;
  protected localStorageService: LocalStorageService;
  protected activateRoute: ActivatedRoute;
  protected _snackBar: MatSnackBar;
  public dialog: MatDialog;
  protected apiService: CoreApiService;
  public rowClassRules;
  public fromDate = new Date();
  public toDate = new Date();
  public oldData;
  private playerCurrency: string;
  private paymentSystems = [];

  private detailGridParams: any;
  public DetailRowData = [];
  private oddsType: number;
  public defaultColDef = {
    flex: 1,
    sortable: true,
    editable: false,
    filter: 'agTextColumnFilter',
    resizable: true,
    unSortIcon: false,
    copyHeadersToClipboard: true,
    menuTabs: [
      'filterMenuTab',
      'generalMenuTab',
    ],
    cellStyle: function (params) {
      if (params.data.Status == 8) {
        return { color: 'white' };
      } else {
        return null;
      }
    }
  };

  public detailCellRendererParams: any = {
    getDetailRowData: params => {

      if (params) {
        const row = params.data;
        this.apiService.apiPost(this.configService.getApiUrl, row.Id, true, Controllers.PAYMENT, Methods.GET_PAYMENT_REQUEST_BY_ID)
          .pipe(take(1)).subscribe((data) => {
            if (data.ResponseCode === 0) {
              this.DetailRowData = data.ResponseObject.PaymentRequest;
              this.paymentVerified = data.ResponseObject;
              this.payment = data.ResponseObject.PaymentRequest;
              params.data.HelpData = this.DetailRowData ? data.ResponseObject.PaymentRequest : null;
              params.data._Barcode = data.ResponseObject.PaymentRequest.Barcode;
              params.successCallback(this.DetailRowData);
              if (!this.detailGridParams.data.updated) {
                this.detailGridParams.data.updated = true;
                this.detailGridParams.api.redrawRows();
              }
              params.data._isUpdated = true;
              params.successCallback(data.ResponseObject.BetSelections);
            } else {
              params.successCallback(undefined);
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    },
    refreshStrategy: 'everything',
    template: params => {

      if (!this.detailGridParams) {
        this.detailGridParams = params;
      }
      const isEmpty = !params.data.HelpData ? "flex" : "none";
      const hasData = !!params.data.HelpData ? "block" : "none";
      const barcode = params?.data?._Barcode || '';

      const info = this.concatObject(Object.entries(JSON.parse(params.data.Info)).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {}))
      const parameters = this.concatObject((this.payment?.ParsedParameters))

      return `
      <div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box; overflow-y: auto">
      <div style="display: ${isEmpty}; height: 10%; color: #000; margin-bottom: 15px; justify-content: center; font-weight: 700; font-size: 24px">No information</div>
      <div style="height: 100%; display: ${hasData}">
        <div style="font-weight: 700; font-size: 24px; padding-bottom: 12px">Information:</div>
        <div style="height: 10%; font-size: 16px; color: #076192">Barcode: ${barcode}</div>
        <div style="height: 10%; font-size: 16px; color: #076192">Document Verified: ${this.paymentVerified?.ClientDocumentVerified}</div>
        <div style="height: 10%; font-size: 16px; color: #076192">Email Verified: ${this.paymentVerified?.ClientEmailVerified}</div>
        <div style="height: 10%; font-size: 16px; color: #076192"  >Info: ${info}</div>
        <div style="height: 10%; font-size: 16px; color: #076192">Cashe Code: ${this.payment?.CashCode}</div>
        <div style="height: 10%; font-size: 16px; color: #076192">Mobile Number Verified: ${this.paymentVerified?.ClientMobileVerified}</div>
        <div style="height: 10%; font-size: 16px; color: #076192">Parameters: ${parameters} </div>
        <div ref="eDetailGrid"  style="display: none"></div>
      </div>
    </div>`
    }
  };
  private exportService = inject(ExportService);

  constructor(
    protected injector: Injector,
  ) {
    super(injector)
    this.rowClassRules = {
      'status-approved': (params) => params.data?.StateId == 8,
      'status-approved-manually': (params) => params.data?.StateId == 12,
      'status-cancelled': (params) => params.data?.StateId == 2,
      'status-confirmed': (params) => params.data?.StateId == 7,
      'status-declined': (params) => params.data?.StateId == 6,
      'status-deleted': (params) => params.data?.StateId == 11,
      'status-failed': (params) => params.data?.StateId == 9,
      'status-frozen': (params) => params.data?.StateId == 4,
      'status-in-process': (params) => params.data?.StateId == 3,
      'status-pay-pending': (params) => params.data?.StateId == 10,
      'status-pending': (params) => params.data?.StateId == 1,
      'status-waiting-for-kyc': (params) => params.data?.StateId == 5
    };
    this.commonDataService = injector.get(CommonDataService);
    this._snackBar = injector.get(MatSnackBar);
    this.apiService = injector.get(CoreApiService);
    this.dialog = injector.get(MatDialog);
    this.localStorageService = injector.get(LocalStorageService);
    this.activateRoute = injector.get(ActivatedRoute),

      this.frameworkComponents = {
        agBooleanColumnFilter: AgBooleanFilterComponent,
        agDropdownFilter: AgDropdownFilter,
        agDateTimeFilter: AgDateTimeFilter
      }
  }

  ngOnInit() {
    this.getpaymentRequestStates();
    this.getPaymentSystems();
    this.setTime();
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.urlSegment = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
    this.type = this.urlSegment == 'withdrawals' ? 1 : this.urlSegment == 'deposits' ? 2 : null;
    this.gridStateName = `${this.urlSegment}-grid-state`;
    this.partners = this.commonDataService.partners;
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  getpaymentRequestStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_PAYMENT_REQUEST_STATES_ENUM)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.paymentStatus = data.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);;
        }
      })
  }

  getPaymentSystems() {
    this.apiService.apiPost(this.configService.getApiUrl, { IsActive: true }, true, Controllers.PAYMENT, Methods.GET_PAYMENT_SYSTEMS)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.paymentSystems = data.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);;
          this.initColumnDefs();
        }
      })
  }

  initColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        tooltipField: 'Id',
        minWidth: 60,
        cellRenderer: 'agGroupCellRenderer',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        suppressColumnsToolPanel: false,
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.ClientEmail',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Email',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
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
        field: 'FirstName',
        minWidth: 140,
        cellRenderer: (params) => {
          const note = `<mat-icon data-action-type="view-note" class="mat-icon material-icons" style="font-size: 18px; width: 18px; height: 20px; vertical-align: middle"> ${params.data.ClientHasNote ? 'folder' : 'folder_open'}</mat-icon>`;
          const names = `<span data-action-type="view-name">${params.data.FirstName} ${params.data.LastName}</span>`;
          return (params.data.FirstName && params.data.LastName) ? `${note} ${names}` : '';
        },
        filter: false,
      },
      {
        headerName: 'Common.CreatorNameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserFirstName',
        hide: true,
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          if (params.data.CreatorFirstName == null) { params.data.CreatorFirstName = ''; }
          if (params.data.CreatorLastName == null) { params.data.CreatorLastName = ''; }
          return `${params.data.CreatorFirstName} ${params.data.CreatorLastName}`;
        },
        filter: false,
        cellStyle: function (params) {
          if (params.node.rowPinned) {
            return { display: 'none' };
          }
          if (params.data.Status == 8) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.Group',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryId',
        hide: true,
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Products.ExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Amount',
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
        headerName: 'Clients.ConvertedAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ConvertedAmount',
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
        headerName: 'Clients.FinalAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FinalAmount',
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
        headerName: 'Clients.CommissionPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CommissionPercent',
        sortable: false,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.CommissionAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CommissionAmount',
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
        headerName: 'Clients.FinalAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FinalAmount',
        sortable: false,
        resizable: true,
        filter: false,
        cellRenderer: (params) => {
          return (params.data.Amount && params.data.CommissionAmount) ? `${params.data.Amount - params.data.CommissionAmount}` : " ";
        },
      },
      {
        headerName: 'BetShops.BetShopId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopId',
        sortable: true,
        resizable: true,
        hide: true,
        filter: false,
      },
      {
        headerName: 'Clients.CashDeskId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CashDeskId',
        sortable: true,
        resizable: true,
        hide: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.BetShopName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopName',
        sortable: true,
        resizable: true,
        hide: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.Currency',
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
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.PaymentSystemName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystemName',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.paymentSystems
        },
      },
      {
        headerName: 'Clients.SegmentName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SegmentName',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.AffiliatePlatformId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AffiliatePlatformId',
        sortable: true,
        resizable: true,
        hide: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.AffiliateId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AffiliateId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.stateOptions
        },
      },
      {
        headerName: 'Payments.BankName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BankName',
        filter: false,
        sortable: false,
      },
      {
        headerName: 'Clients.CardNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CardNumber',
        sortable: false,
        filter: false
      },
      {
        headerName: 'Common.CardType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CardType',
        sortable: false,
        filter: false
      },
      {
        headerName: 'Common.TransactionIp',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TransactionIp',
        sortable: false,
        filter: false
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.paymentStatus
        },
      },
      {
        headerName: 'Payments.DepositCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DepositCount',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return dat ? `${dat}` : '';
        }
      },
      {
        headerName: 'Clients.Country',
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
        headerName: 'Partners.LastUpdate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return dat ? `${dat}` : '';
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
             <button class="button-view-2" data-action-type="view">View</button>`
          if (keyData === false) {
            return newButton;
          } else if (keyData === true) {
            return newButton2;
          }
        }
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        filter: false,
        cellRenderer: params => {

          if (params.node.rowPinned) {
            return '';
          }
          return `<i style="color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
            visibility
          </i>`;
        },
        onCellClicked: (event: CellClickedEvent) => this.toRedirectPayment(event),
      },
    ]
  }

  toRedirectPayment(params) {
    const row = params.data;
    this.router.navigate([`/main/platform/payments/${this.urlSegment}/paymentrequests`], {
      queryParams: { paymentId: row.Id, type: row.Type, paymentSystemName: row.PaymentSystemName }
    });
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.PartnerId = event.partnerId;
    this.type = this.urlSegment == 'withdrawals' ? 1 : this.urlSegment == 'deposits' ? 2 : null;
    this.getCurrentPage();
  }

  go() {
    this.getCurrentPage();
  }

  noteChange(bool) {
    this.hasNote = bool;
    this.go();
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi = params.api;
    syncColumnSelectPanel();
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.partnerId = this.PartnerId;
        this.type = this.urlSegment == 'withdrawals' ? 1 : this.urlSegment == 'deposits' ? 2 : null;
        paging.Type = this.type;
        paging.HasNote = this.hasNote;
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        this.changeFilerName(params.request.filterModel,
          ['PaymentSystemName'], ['PaymentSystemId']);
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData,
          true, Controllers.PAYMENT, Methods.GET_PAYMENT_REQUESTS_PAGING).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.PaymentRequests.Entities
              mappedRows.map((items) => {
                items.CategoryId = items.GroupId;
                items.PartnerId = this.commonDataService.partners?.find((partner) => partner.Id == items.PartnerId)?.Name;
                items.StateId = items.State;
                items.State = this.paymentStatus.find((status) => status.Id == items.State)?.Name;
                items.PaymentSystemName = this.paymentSystems.find((system) => system.Id == items.PaymentSystemId)?.Name;
                return items;
              });
              this.oldData = mappedRows;
              this.gridApi?.setPinnedBottomRowData([{
                Amount: `${formattedNumber(data.ResponseObject.PaymentRequests.TotalAmount)} ${this.playerCurrency}`,
                FinalAmount: data.ResponseObject.PaymentRequests.TotalFinalAmount ? `${formattedNumber(data.ResponseObject.PaymentRequests.TotalFinalAmount)} ${this.playerCurrency}` : "",
                UserName: `${data.ResponseObject.PaymentRequests.TotalUniquePlayers?.toFixed(0)}`,
              }
              ]);

              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.PaymentRequests.Count });

            } else if (data.ResponseCode === 21) {
              params.success({ rowData: this.oldData, rowCount: this.oldData.length });
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
            else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  async addNotes(params) {
    const { AddNoteComponent } = await import('../../components/add-note/add-note.component');
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: { ObjectId: params.Id, ObjectTypeId: ObjectTypes.PaymentRequest }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.type = this.urlSegment == 'withdrawals' ? 1 : this.urlSegment == 'deposits' ? 2 : null;
        this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      }
    });
  }

  async openNotes(dataId: number, ObjectType: number) {
    const { ViewNoteComponent } = await import('../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: { ObjectId: dataId, ObjectTypeId: ObjectType, Type: 1 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {

      }
    });
  }

  public onRowClicked(event) {
    if (event.event.target !== undefined) {
      let data = event.data;
      let actionType = event.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "add":
          return this.addNotes(data);
        case "view":
          return this.openNotes(data.Id, ObjectTypes.PaymentRequest);
      }
    }
  }

  public onRowClicked2(event) {
    if (event.event.target !== undefined) {
      let data = event.data;
      let actionType = event.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "view-name":
          return this.goToClient(event);
        case "view-note":
          return this.openNotes(data.ClientId, ObjectTypes.Client);
      }
    }
  }

  goToClient(event) {
    const rowData = event.data;
    this.router.navigate(['main/platform/clients/all-clients/client/main'], { queryParams: { "clientId": rowData.ClientId } });
  }

  exportToCsv() {
    this.exportService.exportToCsv(Controllers.PAYMENT, Methods.EXPORT_DEPOSIT_PAYMENT_REQUESTS, {
      ...this.filteredData,
      adminMenuId: this.adminMenuId
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

  isRowSelected() {
    return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length === 0;
  };

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
  }

  getContextMenuItems(params: GetContextMenuItemsParams): (string | MenuItemDef)[] {
    const segment = params.node.data.Type == 1 ? 'withdrawals' : params.node.data.Type == 2 ? 'deposits' : null;
    return [
      {
        name: `Open  ${params.node.data.UserName}`,
        action: () => {
          const url = `/main/platform/clients/all-clients/client/main?clientId=${params.node.data.ClientId}`;
          window.open(url, '_blank');
        },
      },
      'copy'
    ];
  }

  concatObject(obj) {
    let strArray = [];
    for (let prop in obj) {
      strArray.push(prop + ":\t" + obj[prop]);
    }
    return strArray.join("\n");
  }
}
