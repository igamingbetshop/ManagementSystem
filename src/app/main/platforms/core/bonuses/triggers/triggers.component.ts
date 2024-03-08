import { Component, OnInit, Injector } from '@angular/core';
import { DatePipe } from '@angular/common';

import 'ag-grid-enterprise';
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";

import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CommonDataService } from 'src/app/core/services';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { CoreApiService } from "../../services/core-api.service";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';


@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.scss']
})
export class TriggersComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public frameworkComponents;
  public isRowSelected = false;
  public selectedRowId: number = 0;
  public singleRowDataId: number = 0;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partners: any[] = [];
  private PartnerId;
  private StatusId = null;
  public filter: any = {};
  public statuses = [
    {
      Id: null,
      Name: 'All'
    },
    {
      Id: 1,
      Name: 'Active'
    },
    {
      Id: 2,
      Name: 'Inactive'
    }
  ];

  constructor(
    protected injector: Injector,
    protected commonDataService: CommonDataService,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.TRIGGERS;
    this.columnDefs = [
      {
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        cellRendererParams: { suppressPadding: false },
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        suppressColumnsToolPanel: false,
        checkboxSelection: true,
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        sortable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.Description',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Description',
        sortable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        sortable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
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
        headerName: 'Bonuses.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
        sortable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },

        cellRenderer: function (params) {
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
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },

        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.FinishTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Bonuses.Percent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Percent',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.BonusSettingCodes',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusSettingCodes',
        sortable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Clients.Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Amount',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.MinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MinAmount',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.MaxAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxAmount',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.MinBetCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MinBetCount',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        floatingFilter: true,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'trigger');
          data.queryParams = { triggerId: params.data.Id };
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
    this.partners = this.commonDataService.partners;
    this.gridStateName = 'bonuses-trigger-grid-state';
    this.getPage();
  }

  cloneTriggerSetting() {
    this.apiService
      .apiPost(this.configService.getApiUrl, this.singleRowDataId, true, Controllers.BONUS, Methods.CLONE_TRIGGER_SETTINGS)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData.unshift(data.ResponseObject);
          this.go();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  async createTriggerSetting() {
    const { CreateTriggerSettingComponent } = await import('./create-trigger-setting/create-trigger-setting.component');
    const dialogRef = this.dialog.open(CreateTriggerSettingComponent, {
      width: ModalSizes.LARGE,
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    });
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.singleRowDataId = selectedRows[0].Id;
    this.selectedRowId = selectedRows[0];
    this.isRowSelected = true;
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  onPartnerChange(value) {
    this.PartnerId = value;
    this.getPage()
  }

  onStateChange(value) {
    this.StatusId = value;
    this.getPage()
  }

  go() {
    this.getPage()
  }

  getPage() {
    this.filter.TakeCount = 5000;
    this.filter.SkipCount = 0;
    this.filter.PartnerId = this.PartnerId;
    this.filter.StatusId = this.StatusId

    this.apiService
      .apiPost(this.configService.getApiUrl, this.filter, true, Controllers.BONUS, Methods.GET_TRIGGER_SETTINGS)
      .subscribe((data) => {

        if (data.ResponseCode === 0) {
          const mappedRows = data.ResponseObject.Entities;
          mappedRows.forEach((setting) => {
            setting['Status'] = setting['Status'] == true ? 'Active' : 'Inactive';

            let partnerName = this.partners.find((partner) => {
              return partner.Id == setting.PartnerId;
            })
            if (partnerName) {
              setting['PartnerId'] = partnerName.Name;
            }
            // if (setting.Type === 5 || setting.Type === 9 || setting.Type === 11 || setting.Type === 12) {
            //   setting.Amount = setting.MinAmount
            //   setting.MinAmount = null
            // }
          });

          this.rowData = mappedRows;
          this.gridApi.paginationSetPageSize(5000);

          // params.success({rowData: mappedRows, rowCount: data.ResponseObject.Count});
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  async deleteItem() {

    const id = this.gridApi.getSelectedRows()[0]?.Id;
    const { ConfirmComponent } = await import('../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {

      this.apiService
        .apiPost(this.configService.getApiUrl, id, true, Controllers.BONUS, Methods.DELETE_TRIGGER_SETTINGS)
        .subscribe(data => {
          if (data.ResponseCode === 0) {
            this.rowData = this.rowData.filter(elem => elem.Id != id);
            this.isRowSelected = false;
            SnackBarHelper.show(this._snackBar, { Description: "Deleted", Type: "success" });
          }
          else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        })

    });
  }
}
