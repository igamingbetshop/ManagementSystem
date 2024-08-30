import { Component, Injector, OnInit } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { Paging } from "../../../../../../../core/models";
import 'ag-grid-enterprise';
import { DatePipe } from "@angular/common";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';

@Component({
  selector: 'app-corrections',
  templateUrl: './corrections.component.html',
  styleUrls: ['./corrections.component.scss']
})
export class CorrectionsComponent extends BasePaginatedGridComponent implements OnInit {
  public affiliateId: number;
  public rowData = [];
  public clientUnusedId;
  public rowModelType: string = GridRowModelTypes.SERVER_SIDE;
  public columnDefs = [];
  public columnDefs2 = [];
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public filteredData;
  public headerName;
  public selectedItem = 'today';
  public frameworkComponents = {
    agDateTimeFilter: AgDateTimeFilter
  };
  accountsRowData: any;

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dateAdapter: DateAdapter<Date>) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: false,
        filter: 'agNumberColumnFilter',
        minWidth: 90,
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        resizable: true,
      },
      {
        headerName: 'Clients.Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Amount',
        sortable: false,
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        resizable: true,
        valueFormatter: params => params.data.Amount.toFixed(2),
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        },
        resizable: true,
      },
      {
        headerName: 'Payments.OperationType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationTypeName',
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        },
        resizable: true,
      },
      {
        headerName: 'Clients.CreatorFirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreatorFirstName',
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        },
        resizable: true,
      },
      {
        headerName: 'Clients.CreatorLastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreatorLastName',
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        },
        resizable: true,
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        },
        resizable: true,
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        },
        resizable: true,
      },
      {
        headerName: 'Common.Info',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Info',
        sortable: true,
        resizable: true,
        suppressMenu: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        },
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: false,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: false,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
        },
      },
      // {
      //   headerName: 'Clients.Notes',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   resizable: true,
      //   sortable: false,
      //   minWidth: 130,
      //   filter: false,
      //   cellRenderer: params => {
      //     let keyData = params.data.HasNote;
      //     let newButton = `<button class="button-view-1" data-action-type="add">Add Note</button>`;
      //     let newButton2 = `<button class="button-view-2" data-action-type="add">Add</button>
      //        <button class="button-view-2" data-action-type="view">View</button>`
      //     if (keyData === false) {
      //       return newButton;
      //     } else if (keyData === true) {
      //       return newButton2;
      //     }
      //   }
      // },
    ]
  }

  ngOnInit() {
    this.setTime();
    this.affiliateId = this.activateRoute.snapshot.queryParams.affiliateId;
    this.toDate = new Date(this.toDate.setDate(this.toDate.getDate() + 1));
    this.getUserAccounts();
  }

  getUserAccounts() {
    this.apiService.apiPost(this.configService.getApiUrl, this.affiliateId, true,
      Controllers.AFFILIATES, Methods.GET_AFFILIATE_ACCOUNTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.accountsRowData = data.ResponseObject || [];
          this.clientUnusedId = this.accountsRowData.find((item) => item.TypeId === 1);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = this.cacheBlockSize;
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        paging.AffiliateId = this.affiliateId;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.AFFILIATES, Methods.GET_AFFILIATE_CORRECTIONS).pipe(take(1)).subscribe((data) => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    }
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

  onDebitToAccount() {
    this.debitToAccount(null, true)
  }

  onCreditFromAccount() {
    this.creditFromAccount(null, true)
  }

  async debitToAccount(params: any, showCurrency: boolean = false) {
    this.headerName = 'Debit';
    const { CorrectionModalComponent } = await import('../corrections/correction-modal/correction-modal.component');
    const dialogRef = this.dialog.open(CorrectionModalComponent, {
      width: ModalSizes.MEDIUM,
      data: { account: params?.data, headerName: this.headerName, showCurrency: showCurrency }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getUserAccounts();
        this.gridApi?.setServerSideDatasource(this.createServerSideDatasource());
      }
    });
  }

  async creditFromAccount(params: any, showCurrency: boolean = false) {
    this.headerName = 'Credit';
    const { CorrectionModalComponent } = await import('../corrections/correction-modal/correction-modal.component');
    const dialogRef = this.dialog.open(CorrectionModalComponent, {
      width: ModalSizes.MEDIUM,
      data: { account: params?.data, headerName: this.headerName, showCurrency: showCurrency }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getUserAccounts();
        this.gridApi?.setServerSideDatasource(this.createServerSideDatasource());
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

  async addNotes(params) {
    const { AddNoteComponent } = await import('../../../../../../components/add-note/add-note.component');
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: { ObjectId: params.Id, ObjectTypeId: 15 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.gridApi?.setServerSideDatasource(this.createServerSideDatasource());
      }
    });
  }

  async openNotes(params) {
    const { ViewNoteComponent } = await import('../../../../../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: { ObjectId: params.Id, ObjectTypeId: 15, Type: 1 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) { }
    });
  }

  getData() {
    this.getUserAccounts();
    this.getCurrentPage();
  }

}
