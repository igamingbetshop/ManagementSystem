import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes} from "../../../../../../../core/enums";
import {ColDef} from "ag-grid-community";
import {AgBooleanFilterComponent} from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {ButtonRendererComponent} from "../../../../../../components/grid-common/button-renderer.component";
import {NumericEditorComponent} from "../../../../../../components/grid-common/numeric-editor.component";
import {CheckboxRendererComponent} from "../../../../../../components/grid-common/checkbox-renderer.component";
import 'ag-grid-enterprise';
import {MatDialog} from "@angular/material/dialog";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {OpenerComponent} from "../../../../../../components/grid-common/opener/opener.component";
import {TextEditorComponent} from "../../../../../../components/grid-common/text-editor.component";
import {take} from "rxjs/operators";
import {Paging} from "../../../../../../../core/models";
import {DatePipe} from "@angular/common";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";
import {syncColumnSelectPanel, syncNestedColumnReset, syncPaginationWithoutBtn} from "../../../../../../../core/helpers/ag-grid.helper";
import {DateTimeHelper} from "../../../../../../../core/helpers/datetime.helper";
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawals.component.html',
  styleUrls: ['./withdrawals.component.scss']
})
export class WithdrawalsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  clientId: number;
  rowData = [];
  fromDate = new Date();
  toDate = new Date();
  filteredClientId;
  statusName = [];
  masterDetail;
  partners;
  rowModelType: string = GridRowModelTypes.SERVER_SIDE;
  autoGroupColumnDef: ColDef;
  filteredData;
  frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
    agDropdownFilter: AgDropdownFilter,
  }
  accounts = [];
  accountId = null;
  rowClassRules;
  AmountSummary;
  playerCurrency;
  urlSegment;
  selectedItem = 'today';
  type = 0;
  private paymentSystems = [];
  pageIdName: string;

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private commonDataService: CommonDataService,
    public dateAdapter: DateAdapter<Date>) {
    super(injector);
    this.adminMenuId = GridMenuIds.CLIENTS_WITHDRAWALS;
    this.dateAdapter.setLocale('en-GB');

    this.rowClassRules = {
      'payment-status-1': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 1;
      },
      'payment-status-2': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 2;
      },
      'payment-status-3': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 3;
      },
      'payment-status-4': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 4;
      },
      'payment-status-5': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 5;
      },
      'payment-status-6': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 6;
      },
      'payment-status-7': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 7;
      },
      'payment-status-8': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 8;
      },
      'payment-status-9': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 9;
      },
      'payment-status-10': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 10;
      },
      'payment-status-11': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 11;
      },
      'payment-status-12': function (params) {
        let numSickDays = params.data?.Status;
        return numSickDays === 12;
      },
    };
  }

  ngOnInit(): void {
    this.featchPaymentSystems();
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.setTime();
    this.getClientAccounts();
    this.getPaymentStates();
    this.pageIdName = `/ ${this.clientId} : ${this.translate.instant('Clients.Withdrawals')}`;
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getCurrentPage();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  getPaymentStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_PAYMENT_REQUEST_STATES_ENUM).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.statusName = data.ResponseObject;
        this.setColdefs();
      }
    });
  }

  setColdefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 130,
        cellRenderer: 'agGroupCellRenderer',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'BetShops.Group',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GroupId',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
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
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Partners.PaymentSystem',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystemName',
        sortable: true,
        resizable: true,
        filter: false,
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.Segment Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SegmentName',
        sortable: true,
        resizable: true,
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.statusName,
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
        headerName: 'Clients.CardNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CardNumber',
        sortable: true,
        resizable: true,
        filter: false,
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Payments.BankName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BankName',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        },
        suppressMenu: true,
      },
      {
        headerName: 'Partners.LastUpdate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
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
            return {color: 'white'};
          } else {
            return null;
          }
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.BetShopId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopId',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.Account',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Account',
        sortable: false,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: function (params) {
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        }
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
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = {path: '', queryParams: null};
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          this.urlSegment = replacedPart;
          this.type = this.urlSegment == 'withdrawals' ? 2 : null;
          data.path = this.router.url.replace(replacedPart, 'paymentrequests').split('?')[0];
          data.queryParams = {paymentId: params.data.Id, type: params.data.Type};
          return data;
        },
        cellStyle: function (params) {
          if (params.node.rowPinned) {
            return {display: 'none'};
          }
          if (params.data.Status == 8) {
            return {color: 'white'};
          } else {
            return null;
          }
        },
        sortable: false
      }
    ];
  }

  featchPaymentSystems() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.PAYMENT, Methods.GET_PAYMENT_SYSTEMS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.paymentSystems = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


  getClientAccounts() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_ACCOUNTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.accounts = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSelectAccountType(event) {
    this.accountId = event;
    this.getCurrentPage();
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

  onGridReady(params) {
    super.onGridReady(params);
    syncNestedColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        paging.Type = '1';
        paging.AccountId = this.accountId;
        paging.ClientIds = {
          IsAnd: true,
          ApiOperationTypeList: [{
            OperationTypeId: 1,
            IntValue: this.clientId
          }]
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;

        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.PAYMENT, Methods.GET_PAYMENT_REQUESTS_PAGING).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            const mappedRows = data.ResponseObject.PaymentRequests.Entities;
            mappedRows.forEach((entity) => {
              let partnerName = this.commonDataService.partners.find((partner) => {
                return partner.Id == entity.PartnerId;
              })
              if (partnerName) {
                entity['PartnerId'] = partnerName.Name;
              }
              let statusName = this.statusName.find((status) => {
                return status.Id == entity.State;
              })
              if (statusName) {
                entity['State'] = statusName.Name;
              }
              entity.PaymentSystemName = this.paymentSystems.find((system) => system.Id == entity.PaymentSystemId)?.Name;
            })

            this.AmountSummary = data.ResponseObject.PaymentRequests.TotalAmount;
            params.success({rowData: mappedRows, rowCount: data.ResponseObject.PaymentRequests.Count});
            this.gridApi?.setPinnedBottomRowData([
              {Amount: `${this.AmountSummary.toFixed(2)} ${this.playerCurrency}`}
            ]);
          } else {
            SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
          }
        });
      }
    }
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => {
      this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
    }, 0);
  }

  async addNotes(params) {
    const {AddNoteComponent} = await import('../../../../../../components/add-note/add-note.component');
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: {ObjectId: params.Id, ObjectTypeId: 15}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      }
    });
  }

  async openNotes(params) {
    const {ViewNoteComponent} = await import('../../../../../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: {ObjectId: params.Id, ObjectTypeId: 15, Type: 1}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    });
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

  onNavigateToClient() {
    this.router.navigate(["/main/platform/clients/all-clients"])
  }

}
