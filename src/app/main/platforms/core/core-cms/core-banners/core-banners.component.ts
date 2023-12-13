import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { CommonDataService } from 'src/app/core/services';
import { MatDialog } from '@angular/material/dialog';
import 'ag-grid-enterprise';
import { Controllers, GridMenuIds, Methods, ModalSizes } from 'src/app/core/enums';
import { take } from 'rxjs/operators';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { DatePipe } from '@angular/common';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { CellDoubleClickedEvent } from "ag-grid-community";
import { AgGridAngular } from "ag-grid-angular";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { Paging } from 'src/app/core/models';
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';


enum bannerVisibilityTypes {
  'Logged Out' = 1,
  'Logged In' = 2,
  'No Deposit' = 3,
  'One Deposit Only' = 4,
  'Two Or More Deposits' = 5,
}

@Component({
  selector: 'app-core-banners',
  templateUrl: './core-banners.component.html',
  styleUrls: ['./core-banners.component.scss']
})
export class CoreBannersComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public partners: any[] = [];
  public partnerId = 1;
  public fromDate = new Date();
  public toDate = new Date();
  public rowData = [];
  // public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public filter: any = {};
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    agDropdownFilter: AgDropdownFilter,
    agDateTimeFilter: AgDateTimeFilter
  };
  // public fragmentSource: any = [];

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_BANERS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        minWidth: 90,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        }
      },
      {
        headerName: 'Bonuses.Body',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Body',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        },
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event, 74);
        }
      },
      {
        headerName: 'Cms.Head',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Head',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        },
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event, 75);
        }
      },
      {
        headerName: 'Cms.Image',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Image',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        }
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
        }
      },
      {
        headerName: 'Cms.FragmentName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FragmentName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        }
      },
      {
        headerName: 'Payments.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Cms.ShowDescription',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ShowDescription',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        }
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
        field: 'EndDate',
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.EndDate, 'medium');
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
        headerName: 'Cms.IsEnabled',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsEnabled',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        }
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FragmentName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        }
      },
      {
        headerName: 'Common.Visibility',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Visibility',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'banner');
          data.queryParams = {
            Id: params.data.Id,
          };
          return data;
        },
        sortable: false
      },


    ];
  }

  ngOnInit() {
    this.gridStateName = 'core-banners-grid-state';
    this.partners = this.commonDataService.partners;
    // this.getBannerFragments();
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

  onPartnerChange(val) {
    this.partnerId = null;
    this.partnerId = val;
    this.getCurrentPage();
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  async addBaner() {
    const { AddCoreBannerComponent } = await import('./add-core-banner/add-core-banner.component');
    const dialogRef = this.dialog.open(AddCoreBannerComponent, { width: ModalSizes.MIDDLE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    })
  }

  async deleteBaner() {
    const row = this.gridApi.getSelectedRows()[0];
    const { ConfirmComponent } = await import('../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost(this.configService.getApiUrl, row.Id,
          true, Controllers.CONTENT, Methods.REMOVE_WEB_SITE_BANNER)
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
        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.CONTENT, Methods.CET_WEB_SITE_BANNERS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject;
              mappedRows.Entities.forEach((payment) => {
                payment['PartnerName'] = this.partners.find((partner) => partner.Id == payment.PartnerId).Name;
                payment.Visibility = payment.Visibility.map(element => {
                  return bannerVisibilityTypes[element]
                });
                // payment['Type'] = this.getType(payment.Type);
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
        ObjectTypeId: typeId
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    })
  }

  // getType(type) {
  //   let typeName ='';
  //   if(type > 0 && type < 10) {
  //     typeName =  pagingSource.types.find(field =>  field.Id == type)?.Name;
  //   } else if(type >= 99 && type <= 199) {
  //     const id = type % 100;
  //     typeName = `Category ${id} Web `;
  //   } else if(type >= 200 && type <= 299) {
  //     const id = type % 100;
  //     typeName = `Category ${id} Mobile `;
  //   } else {
  //     typeName = this.fragmentSource.find(field => field =>  field.Id == type)?.Name;
  //   }
  //   return typeName;
  // }
}
