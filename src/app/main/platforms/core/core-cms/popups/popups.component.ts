import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import 'ag-grid-enterprise';
import { AgGridAngular } from "ag-grid-angular";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { CellClickedEvent, CellDoubleClickedEvent } from "ag-grid-community";

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { CommonDataService } from 'src/app/core/services';
import { Controllers, GridMenuIds, Methods, ModalSizes } from 'src/app/core/enums';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { Paging } from 'src/app/core/models';
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { ACTIVITY_STATUSES, DEVICE_TYPES } from 'src/app/core/constantes/statuses';
import { PopupService } from './popup.service';


@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.scss']
})
export class PopupsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  partners: any[] = [];
  partnerId = null;
  fromDate = new Date();
  toDate = new Date();
  rowData = [];
  types: any[] = [];
  filter: any = {};
  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    agDropdownFilter: AgDropdownFilter,
    agDateTimeFilter: AgDateTimeFilter
  };
  status = ACTIVITY_STATUSES;
  rowType = 2;
  deviceTypes = DEVICE_TYPES;

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
    private popupService: PopupService,
    public activateRoute: ActivatedRoute,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_POPUPS;
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.getPopupTypes();
    this.subscribeToCurrentUpdate();
  }

  subscribeToCurrentUpdate() {
    this.popupService.currentUpdate.subscribe((promotion) => {
      const rowIdToUpdate = promotion?.Id;
      if (promotion && this.gridApi.getDisplayedRowCount() > 0) {
        const displayedRows = this.gridApi.getDisplayedRowCount();
        for (let rowIndex = 0; rowIndex < displayedRows; rowIndex++) {
          const rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);
          if (rowNode && rowNode.data && rowNode.data.Id === rowIdToUpdate) {
            rowNode.data.FinishDate = promotion.FinishDate;
            rowNode.data.StartDate = promotion.StartDate;
            rowNode.data.State = promotion.State;
            rowNode.data.DeviceType = this.deviceTypes.find((elem) => elem.Id == promotion?.DeviceType)?.Name;;
            rowNode.data.Order = promotion.Order;
            this.gridApi.redrawRows({ rowNodes: [rowNode] });
            break;
          }
        }
      }
    });
  }

  setColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        minWidth: 90,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions,
        }
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        resizable: true,
        filter: false,
        cellRenderer: (params: { value: any; }) => {
          const _partnerId = params.value;
          const partnerObject = this.partners?.find((partner) => partner.Id === _partnerId);
          if (partnerObject) {
            return partnerObject.Name;
          }
          return 'Unknown Partner';
        },

      },
      {
        headerName: 'Common.Page',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Page',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        },
      },
      {
        headerName: 'Common.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        },

      },
      {
        headerName: 'Common.Description',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: function (params) {
          return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
          translate
          </i>`
        },
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event, 100);
        }      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.types,
        },
        cellRenderer: (params: { value: any; }) => {
          const _typeId = params.value;
          const typeObject = this.types?.find((type) => type.Id === _typeId);
          if (typeObject) {
            return typeObject.Name;
          }
          return 'Unknown Type';
        },
      },
      {
        headerName: 'Common.StartDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartDate',
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.StartDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.EndDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FinishDate',
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.FinishDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.Order',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Order',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.DeviceType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DeviceType',
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.deviceTypes,
        },
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.status,
        },
        cellRenderer: (params: { value: any; }) => {
          const _statusId = params.value;
          const statusObject = this.status?.find((status) => status.Id === _statusId);
          if (statusObject) {
            return statusObject.Name;
          }
          return 'Unknown Type';
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: function (params) {
          return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
           visibility
           </i>`
        },
        onCellClicked: (event: CellClickedEvent) => this.onNavigateToPopup(event),
      },
    ];
  }

  startDate() {
    DateTimeHelper.startDate();
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onNavigateToPopup(ev) {
    const row = ev.data;
    this.router.navigate(['/main/platform/cms/popups/popup'],
      { queryParams: { "id": row.Id } });
  }

  onPartnerChange(val) {
    this.partnerId = null;
    this.partnerId = val;
    this.getCurrentPage();
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  onRowClicked(event) {
    this.rowType = event.data.Type;
  }

  getPopupTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_POPUP_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.types = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.setColumnDefs();
      });
  }

  async onAddPopup() {
    const { AddPopupComponent } = await import('./add-popup/add-popup.component');
    const dialogRef = this.dialog.open(AddPopupComponent, {
      width: ModalSizes.MIDDLE, data: {
        deviceTypes: this.deviceTypes,
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    })
  }

  async onBroadCast() {
    const row = this.gridApi.getSelectedRows()[0];
    const { ConfirmComponent } = await import('../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost(this.configService.getApiUrl, row.Id,
          true, Controllers.CONTENT, Methods.BROADCAST_POPUP)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    })
  }

  async onDeletePopup() {
    const row = this.gridApi.getSelectedRows()[0];
    const { ConfirmComponent } = await import('../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost(this.configService.getApiUrl, row.Id,
          true, Controllers.CONTENT, Methods.REMOVE_POPUP)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.getCurrentPage();
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    })
  }

  createServerSideDatasource = () => {
    return {
      getRows: (params) => {
        let paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.CreatedFrom = this.fromDate;
        paging.CreatedBefore = this.toDate;
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        if(paging?.DeviceTypes?.ApiOperationTypeList[0].IntValue == -1 ) {
          paging.DeviceTypes = {IsAnd: true, ApiOperationTypeList: []};
        }
          
        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.CONTENT, Methods.GET_POPUPS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject;
              mappedRows.Entities.forEach((row) => {
                row['DeviceType'] = this.deviceTypes.find((elem) => elem.Id == row?.DeviceType)?.Name || "All";
              });
              params.success({ rowData: mappedRows.Entities, rowCount: mappedRows.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
            }
          },
          );
      },
    };
  };

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  async cellDoubleClicked(event: CellDoubleClickedEvent, typeId) {
    const id = event.data.Id;
    const { AddEditTranslationComponent } = await import('../../../../components/add-edit-translation/add-edit-translation.component');
    const dialogRef = this.dialog.open(AddEditTranslationComponent, {
      width: ModalSizes.MEDIUM, data: {
        ObjectId: id,
        ObjectTypeId: typeId,
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        SnackBarHelper.show(this._snackBar, { Description: `Succsess`, Type: "success" });
      }
    })
  }

  ngOnDestroy(): void {
    this.popupService.update(null);
  }

}
