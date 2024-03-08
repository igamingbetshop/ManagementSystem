import { Component, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { CellDoubleClickedEvent, GetContextMenuItemsParams, IDetailCellRendererParams, MenuItemDef } from 'ag-grid-community';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes, ObjectTypes } from 'src/app/core/enums';
import 'ag-grid-enterprise';
import { CommonDataService } from 'src/app/core/services';
import { DatePipe } from '@angular/common';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { CoreApiService } from "../../services/core-api.service";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';

@Component({
  selector: 'app-commonses',
  templateUrl: './commonses.component.html',
  styleUrls: ['./commonses.component.scss']
})
export class CommonsesComponent extends BaseGridComponent implements OnInit {

  public rowData = [];
  public frameworkComponents;
  public delPath = 'commonses/delete';
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partners: any[] = [];
  public clientType: any[] = [];
  public finalAccountTypes: any[] = [];
  public DetailRowData = [];
  public isRowMaster: any = (dataItem: any) => {
    return true;
  }
  public types = [
    {
      Id: 1,
      Name: "All"
    },
    {
      Id: 2,
      Name: "Any"
    }
  ];

  public detailCellRendererParams: any = {
    detailGridOptions: {
      columnDefs: [
        {
          headerName: 'Common.Id',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Id'
        },
        {
          headerName: 'Common.Name',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Name'
        },
        {
          headerName: 'Bonuses.Description',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Description',
        },
        {
          headerName: 'Bonuses.BonusSettingCodes',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'BonusSettingCodes'
        },
        {
          headerName: 'Bonuses.StartTime',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'StartTime'
        },
        {
          headerName: 'Bonuses.FinishTime',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'FinishTime'
        },
        {
          headerName: 'Common.Order',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Order'
        },
        {
          headerName: 'Bonuses.Percent',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Percent',
        },
        {
          headerName: 'Common.Type',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'TypeName'
        },
        {
          headerName: 'Bonuses.MinAmount',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MinAmount'
        },
        {
          headerName: 'Bonuses.MaxAmount',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MaxAmount'
        },
      ],
      onGridReady: params => {
      },
      onRowClicked: event => {
        const url = `main/platform/bonuses/trigger/details?triggerId=${event.data.Id}`;
        window.open(url, '_blank');
      },
      defaultColDef: {
        flex: 1,
        resizable: true,
      },
    },
    getDetailRowData: params => {
      if (params) {
        const row = params.data.Id;
        this.apiService.apiPost(this.configService.getApiUrl, row, true, Controllers.BONUS, Methods.GET_TRIGGER_GROUPS)
          .pipe(take(1)).subscribe((data) => {
            if (data.ResponseCode === 0) {
              const enterprise = [];
              data.ResponseObject.map(element => {
                return enterprise.push(...element.TriggerSetting, [])
              })
              this.DetailRowData = enterprise;
              params.successCallback(this.DetailRowData)
            } else {
              params.successCallback(undefined);
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    },

  } as IDetailCellRendererParams<any, any>;

  public bonusTypes = [];

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private apiService: CoreApiService,
    public changDet: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.COMMON;
    this.columnDefs = [
      {
        field: 'Id',
        sortable: true,
        resizable: true,
        cellRendererParams: { suppressPadding: false },
        filter: 'agNumberColumnFilter',
        cellRenderer: 'agGroupCellRenderer',
        checkboxSelection: true,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event);
        }
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.Description',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Description',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.WinAccountType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAccountTypeId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.FinalAccountType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FinalAccountTypeId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        sortable: true,
        resizable: true,
        filter: 'agSetColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.Percent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Percent',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Bonuses.Period',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Period',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Bonuses.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: (params) => {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.StartTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Bonuses.FinishTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FinishTime',
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: (params) => {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.FinishTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Bonuses.LastExecutionTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastExecutionTime',
        sortable: true,
        filter: 'agDateColumnFilter',

        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastExecutionTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.Sequence',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Sequence',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',

        cellRenderer: function (params) {
          let Sequence = params.data.Sequence == null ? '' : params.data.Sequence;
          return `${Sequence}`;
        },
      },
      {
        headerName: 'Bonuses.TurnoverCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TurnoverCount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        cellRenderer: function (params) {
          let turnove = params.data.TurnoverCount == null ? '' : params.data.TurnoverCount;
          return `${turnove}`;
        },
      },
      {
        headerName: 'Bonuses.MinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MinAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        cellRenderer: function (params) {
          let min = params.data.MinAmount == null ? '' : params.data.MinAmount;
          return `${min}`;
        },
      },
      {
        headerName: 'Bonuses.MaxAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        cellRenderer: function (params) {
          let max = params.data.MaxAmount == null ? '' : params.data.MaxAmount;
          return `${max}`;
        },
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        cellRenderer: function (params) {
          let priority = params.data.Priority == null ? '' : params.data.Priority;
          return `${priority}`;
        },
      },
      {
        headerName: 'Bonuses.IgnoreEligibility',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IgnoreEligibility',
        cellRenderer: function (params) {
          let has: string = params.data.IgnoreEligibility ? 'true' : params.data.IgnoreEligibility == null ? '' : "false";
          return `${has}`;
        },
      },
      {
        headerName: 'Bonuses.ValidForAwarding',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ValidForAwarding',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        cellRenderer: function (params) {
          let min = params.data.ValidForAwarding == null ? '' : params.data.ValidForAwarding;
          return `${min}`;
        },
      },
      {
        headerName: 'Bonuses.ValidForSpending',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ValidForSpending',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',

        cellRenderer: function (params) {
          let min = params.data.ValidForSpending == null ? '' : params.data.ValidForSpending;
          return `${min}`;
        },
      },
      {
        headerName: 'Bonuses.ReusingMaxCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ReusingMaxCount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Bonuses.ResetOnWithdraw',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ResetOnWithdraw',
        cellRenderer: function (params) {
          let has: string = params.data.ResetOnWithdraw ? 'true' : params.data.ResetOnWithdraw == null ? '' : "false";
          return `${has}`;
        },
      },
      {
        headerName: 'Bonuses.MaxGranted',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxGranted',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',

        cellRenderer: function (params) {
          let max = params.data.MaxGranted == null ? '' : params.data.MaxGranted;
          return `${max}`;
        },
      },
      {
        headerName: 'Bonuses.TotalGranted',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalGranted',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',

        cellRenderer: function (params) {
          let total = params.data.TotalGranted == null ? '' : params.data.TotalGranted;
          return `${total}`;
        },
      },
      {
        headerName: 'Bonuses.MaxReceiversCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxReceiversCount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',

        cellRenderer: function (params) {
          let total = params.data.MaxReceiversCount == null ? '' : params.data.MaxReceiversCount;
          return `${total}`;
        },
      },
      {
        headerName: 'Bonuses.TotalReceiversCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalReceiversCount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',

        cellRenderer: function (params) {
          let total = params.data.TotalReceiversCount == null ? '' : params.data.TotalReceiversCount;
          return `${total}`;
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'common');
          data.queryParams = { commonId: params.data.Id };
          return data;
        },
        sortable: false
      },
    ];

    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
    }
  }

  ngOnInit() {
    this.getBounusTypes();
    this.getClientType();
    this.gridStateName = 'bonuses-common-grid-state';
    this.partners = this.commonDataService.partners;
    this.getPage();
  }

  getBounusTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_BONUS_TYPES_ENUM)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.bonusTypes = data.ResponseObject;
        }
      })
  }

  getClientType() {
    this.apiService
      .apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_CLIENT_ACCOUNT_TYPES_ENUM)
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.clientType = data.ResponseObject;
          this.finalAccountTypes = this.clientType.filter(elem => elem.Id != 12);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  cloneBonus() {
    const row = this.gridApi.getSelectedRows()[0];
    this.apiService
      .apiPost(this.configService.getApiUrl, row.Id, true, Controllers.BONUS, Methods.CLONE_BONUS)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.getPage();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  async generalSetup() {
    const { GeneralSetupComponent } = await import('./general-setup/general-setup.component');
    const dialogRef = this.dialog.open(GeneralSetupComponent, {
      width: ModalSizes.LARGE,
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    });
  }

  async cellDoubleClicked(event: CellDoubleClickedEvent) {
    const id = event.data.Id;
    const { AddEditTranslationComponent } = await import('../../../../components/add-edit-translation/add-edit-translation.component');
    const dialogRef = this.dialog.open(AddEditTranslationComponent, {
      width: ModalSizes.MEDIUM, data: {
        ObjectId: id,
        ObjectTypeId: ObjectTypes.Bonus
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  getPage() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.BONUS, Methods.GET_BONUSES)
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          const rowData = data.ResponseObject;
          rowData.forEach((bonus) => {
            bonus['PartnerId'] = this.partners.find(part => part.Id == bonus.PartnerId)?.Name;
            let accountType = this.clientType.find(account => account.Id == bonus.AccountTypeId);
            bonus['AccountTypeId'] = accountType ? accountType.Name : '';
            bonus['BonusName'] = this.bonusTypes.find(name => name.Id == bonus.BonusTypeId)?.Name;
            bonus['Status'] = bonus['Status'] == true ? 'Active' : 'Inactive';
            bonus['WinAccountTypeId'] = this.clientType.find(account => account.Id == bonus.WinAccountTypeId)?.Name;
            bonus['FinalAccountTypeId'] = this.finalAccountTypes.find(account => account.Id == bonus.FinalAccountTypeId)?.Name;
          });
          this.rowData = rowData;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  getContextMenuItems(params: GetContextMenuItemsParams): (string | MenuItemDef)[] {
    return ['copy'];
  }

  async deleteItem() {
    const id = this.gridApi.getSelectedRows()[0]?.Id;
    const { ConfirmComponent } = await import('../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      this.apiService
        .apiPost(this.configService.getApiUrl, id, true, Controllers.BONUS, Methods.DELETE_BOUNES)
        .subscribe(data => {
          if (data.ResponseCode === 0) {
            this.rowData = this.rowData.filter(elem => elem.Id != id)
            SnackBarHelper.show(this._snackBar, { Description: "Deleted", Type: "success" });
          }
          else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        })

    });
  }

}
