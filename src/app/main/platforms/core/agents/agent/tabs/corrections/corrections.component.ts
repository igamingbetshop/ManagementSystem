import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {AgGridAngular} from "ag-grid-angular";
import {Controllers, GridRowModelTypes, Methods, ModalSizes} from "../../../../../../../core/enums";
import {AgBooleanFilterComponent} from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {ButtonRendererComponent} from "../../../../../../components/grid-common/button-renderer.component";
import {TextEditorComponent} from "../../../../../../components/grid-common/text-editor.component";
import {SelectRendererComponent} from "../../../../../../components/grid-common/select-renderer.component";
import {NumericEditorComponent} from "../../../../../../components/grid-common/numeric-editor.component";
import {ImageRendererComponent} from "../../../../../../components/grid-common/image-renderer.component";
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../../../../../../core/services";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DateAdapter} from "@angular/material/core";
import {DatePipe} from "@angular/common";
import {take} from "rxjs/operators";
import {Paging} from "../../../../../../../core/models";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {DateTimeHelper} from "../../../../../../../core/helpers/datetime.helper";
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-corrections',
  templateUrl: './corrections.component.html',
  styleUrl: './corrections.component.scss'
})
export class CorrectionsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('agGrid2') agGrid2: AgGridAngular;
  public userId: number;
  public agentIds;
  public rowData = [];
  public rowData2 = [];
  public clientUnusedId;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowModelType2: string = GridRowModelTypes.SERVER_SIDE;
  public columnDefs = [];
  public columnDefs2 = [];
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public filteredData;
  public headerName;
  public selectedItem = 'today';
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
    numericEditor: NumericEditorComponent,
    imageRenderer: ImageRendererComponent
  };

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
      },
      {
        headerName: 'Common.Balance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Balance',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.Balance.toFixed(2),
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Payments.Debit',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.debitToAccount['bind'](this),
          Label: 'Debit To Account',
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      },
      {
        headerName: 'Payments.Credit',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.creditFromAccount['bind'](this),
          Label: 'Credit From Account',
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      }
    ];
    this.columnDefs2 = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Amount',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.Amount.toFixed(2),
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Payments.OperationType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationTypeName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.Info',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Info',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Users.FromUserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FromUserId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        sortable: true,
        resizable: true,
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
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
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
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
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
        }
      },
    ]
  }

  ngOnInit() {
    this.setTime();
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.agentIds = this.activateRoute.snapshot.queryParams.agentIds;
    this.getUserAccounts();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  getUserAccounts() {
    let requestObject;
    if (this.agentIds) {
      let agentIdArray = this.agentIds.split(',');
      let lastAgentId = agentIdArray[agentIdArray.length - 1];
      requestObject = lastAgentId;
    } else {
      requestObject = this.userId;
    }
    this.apiService.apiPost(this.configService.getApiUrl, requestObject, true,
      Controllers.USER, Methods.GET_USER_BY_ID).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject.Accounts;
        this.clientUnusedId = this.rowData.find((item) => item.TypeId === 1);
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
        if (this.agentIds) {
          let agentIdArray = this.agentIds.split(',');
          let lastAgentId = agentIdArray[agentIdArray.length - 1];
          paging.UserId = lastAgentId;
        } else {
          paging.UserId = this.userId;
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.USER, Methods.GET_CORRECTIONS).pipe(take(1)).subscribe((data) => {
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
}
