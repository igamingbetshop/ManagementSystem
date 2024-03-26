import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { ButtonRendererComponent } from "../../../../../../components/grid-common/button-renderer.component";
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { Paging } from "../../../../../../../core/models";
import { MatDialog } from "@angular/material/dialog";
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { CellClickedEvent } from 'ag-grid-community';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'client-main',
  templateUrl: './corrections.component.html',
  styleUrls: ['./corrections.component.scss']
})
export class CorrectionsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('agGrid2') agGrid2: AgGridAngular;
  public clientId: number;
  public rowData = [];
  public rowClientCorrections = [];
  public clientUnusedId;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowModelType2: string = GridRowModelTypes.CLIENT_SIDE;
  public columnDefs = [];
  public columnDefs2 = [];
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public headerName;
  public showSelectAccountType;
  public frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
  };
  public selectedItem = 'today';
  public accounts = [];
  public accountId = null;
  public accountTypes = [];

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
        sortable: true,
        resizable: true,
        suppressMenu: true
      },
      {
        headerName: 'Common.Balance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Balance',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.Balance.toFixed(2),
        suppressMenu: true
      },
      {
        headerName: 'Payments.CurrencyId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
        suppressMenu: true
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AccountTypeName',
        sortable: true,
        resizable: true,
        suppressMenu: true
      },
      {
        headerName: 'Payments.Debit',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        sortable: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.DebitToAccount['bind'](this),
          Label: 'Debit To Account',
          bgColor: '#fff',
          textColor: '#3f51b5'
        },
        suppressMenu: true
      },
      {
        headerName: 'Payments.Credit',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.CreditFromAccount['bind'](this),
          Label: 'Credit From Account',
          bgColor: '#fff',
          textColor: '#3f51b5'
        },
        suppressMenu: true
      }
    ];
    this.columnDefs2 = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        }
      },
      {
        headerName: 'Payments.Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Amount',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.Amount?.toFixed(2),
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        }
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
        suppressMenu: true,
      },
      {
        headerName: 'Bonuses.AccountType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AccountTypeName',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        }
      },
      {
        headerName: 'Payments.OperationType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationTypeName',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        }
      },
      {
        headerName: 'Common.Info',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Info',
        sortable: true,
        resizable: true,
        suppressMenu: true,
      },
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.NameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusPrize',
        sortable: true,
        resizable: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.FirstName !== null || params.data.LastName !== null) {
            a.innerHTML = params.data.FirstName + ' ' + params.data.LastName;
          }
          return a;
        },
        suppressMenu: true,
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Partners.LastUpdate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        resizable: true,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
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
          let newButton = `<button class="button-view-1" data-action-type="add">Add Note</button>`;
          let newButton2 = `<button class="button-view-2" data-action-type="add">Add</button>
             <button class="button-view-2" data-action-type="view">View</button>`
          if (keyData === false) {
            return newButton;
          } else if (keyData === true) {
            return newButton2;
          }
        },
        onCellClicked: (event: CellClickedEvent) => this.onRowClicked(event),
        suppressMenu: true,
      },
    ]
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.getClientAccountTypes();
    this.getClientAccounts();
    this.setTime();
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getClientCorrections();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  getClientAccounts() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_ACCOUNTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
          this.accounts = data.ResponseObject;
          this.clientUnusedId = this.rowData.find((item) => item.TypeId === 1);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getClientCorrections() {
    const paging = new Paging();
    paging.SkipCount = 0;
    paging.TakeCount = this.cacheBlockSize;
    paging.FromDate = this.fromDate;
    paging.ToDate = this.toDate;
    paging.ClientId = this.clientId;
    paging.AccountId = this.accountId;
    this.apiService.apiPost(this.configService.getApiUrl, paging, true,
      Controllers.CLIENT, Methods.GET_CLIENT_CORRECTIONS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowClientCorrections = data.ResponseObject.Entities.map((item) => {
            item.AccountTypeName = this.accountTypes.find((c) => c.Id === item.AccoutTypeId)?.Name;
            return item;
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getClientAccountTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CLIENT_ACCOUNT_TYPES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.accountTypes = data.ResponseObject;

        }
      });
  }

  onGridReadyCorrections(params) {
    super.onGridReady(params);
    this.getClientCorrections();
  }


  async DebitToAccount(params) {
    this.headerName = 'DebitToAccount';
    this.showSelectAccountType = false;
    const { CorrectionModalComponent } = await import('../corrections/correction-modal/correction-modal.component');
    const dialogRef = this.dialog.open(CorrectionModalComponent, {
      width: ModalSizes.MEDIUM,
      data: { account: params.data, headerName: this.headerName, showSelectAccountType: this.showSelectAccountType }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getClientAccounts();
        this.getClientCorrections();
      }
    });
  }

  onSelectAccountType(event) {
    this.accountId = event;
    this.getClientCorrections();
  }

  async CreditFromAccount(params) {
    this.headerName = 'Credit';
    this.showSelectAccountType = false;
    const { CorrectionModalComponent } = await import('../corrections/correction-modal/correction-modal.component');
    const dialogRef = this.dialog.open(CorrectionModalComponent, {
      width: ModalSizes.MEDIUM,
      data: { account: params.data, headerName: this.headerName, showSelectAccountType: this.showSelectAccountType }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getClientAccounts();
        this.getClientCorrections();
      }
    });
  }

  async debitToClient() {
    this.headerName = 'DebitToClient';
    this.showSelectAccountType = true;
    const { CorrectionModalComponent } = await import('../corrections/correction-modal/correction-modal.component');
    const dialogRef = this.dialog.open(CorrectionModalComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        account: this.clientUnusedId,
        headerName: this.headerName,
        showSelectAccountType: this.showSelectAccountType
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getClientAccounts();
        this.getClientCorrections();
      }
    });
  }

  async creditFromClient() {
    this.headerName = 'CreditFromClient';
    this.showSelectAccountType = true;
    const { CorrectionModalComponent } = await import('../corrections/correction-modal/correction-modal.component');
    const dialogRef = this.dialog.open(CorrectionModalComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        account: this.clientUnusedId,
        headerName: this.headerName,
        showSelectAccountType: this.showSelectAccountType
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getClientAccounts();
        this.getClientCorrections();
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
      data: { ObjectId: params.Id, ObjectTypeId: 56 }
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
              this.gridApi.redrawRows({ rowNodes: [rowNode] });
              break;
            }
          }
        }
      }
    });
  }

  async openNotes(params) {
    const { ViewNoteComponent } = await import('../../../../../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: { ObjectId: params.Id, ObjectTypeId: 56, Type: 1 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    });
  }

  onNavigateToClient() {
    this.router.navigate(["/main/platform/clients/all-clients"])
  }
}
