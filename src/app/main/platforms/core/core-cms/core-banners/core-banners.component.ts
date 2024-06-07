import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { AgSelectableFilter } from 'src/app/main/components/grid-common/ag-selectable-filter/ag-selectable-filter.component';
import { ActivatedRoute } from '@angular/router';
import { BannerService } from './core-banners.service';
import { pagingSource } from './add-core-banner/add-core-banner.component';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';


export enum BannerVisibilityTypes {
  'Empety' = -1,
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
export class CoreBannersComponent extends BasePaginatedGridComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public partners: any[] = [];
  public partnerId: number = null;
  public fromDate = new Date();
  public toDate = new Date();
  public rowData = [];
  public filter: any = {};
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    agSelectableFilter: AgSelectableFilter,
    agDateTimeFilter: AgDateTimeFilter,
    agDropdownFilter: AgDropdownFilter,
  };

  banersTypes: any = [...pagingSource.types];

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public activateRoute: ActivatedRoute,
    private bannerService: BannerService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_BANERS;

  }

  ngOnInit() {
    this.gridStateName = 'core-banners-grid-state';
    this.partners = this.commonDataService.partners;
    this.setPartnerId();
    this.subscribeToCurrentUpdate();
    this.initCategorySource();
    this.getBannerFragments();
  }

  setPartnerId() {
    const hasPartnerIdOtherThanOne = this.partners.some(partner => partner.Id == 1);

    if (hasPartnerIdOtherThanOne) {
      const partnerWithIdOtherThanOne = this.partners.find(partner => partner.Id == 1);
      this.partnerId = partnerWithIdOtherThanOne.Id;
    } else {
      this.partnerId = this.partners.length > 0 ? this.partners[0].Id : null;
    }
  }

  subscribeToCurrentUpdate() {
    this.bannerService.currentUpdate.subscribe((banner) => {
      if (banner && this.gridApi.getDisplayedRowCount() > 0) {
        const rowIdToUpdate = banner?.Id;
        const displayedRows = this.gridApi.getDisplayedRowCount();
        for (let rowIndex = 0; rowIndex < displayedRows; rowIndex++) {
          const rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);
          if (rowNode && rowNode.data && rowNode.data.Id === rowIdToUpdate) {
            rowNode.data.StartDate = banner.StartDate;
            rowNode.data.EndDate = banner.EndDate;
            rowNode.data.Type = banner.Type;
            rowNode.data.Order = banner.Order;
            rowNode.data.ShowDescription = banner.ShowDescription;
            rowNode.data.ShowLogin = banner.ShowLogin;
            rowNode.data.ShowRegistration = banner.ShowRegistration;
            rowNode.data.Image = banner.Image;
            rowNode.data.IsEnabled = banner.IsEnabled;
            rowNode.data.Visibility = banner.Visibility;
            rowNode.data.Type = banner.Type;
            this.gridApi.redrawRows({ rowNodes: [rowNode] });
            break;
          }
        }
      }
    });
  }

  initCategorySource(): void {
    const types = []
    for (let i = 1; i < 100; i++) {
      const webId = i + 100;
      const mobileId = i + 200;
      types.push({ Id: `${+webId}`, Name: `Category ${i} Web` }, { Id: `${+mobileId}`, Name: `Category ${i} Mobile` });
    }
    this.banersTypes.push(...types);
  }

  getBannerFragments() {
    this.apiService.apiPost(this.configService.getApiUrl, this.partnerId,
      true, Controllers.CONTENT, Methods.GET_BANNER_FRAGMENTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.banersTypes.push(...data.ResponseObject);
          this.setColdefts();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  setColdefts() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        minWidth: 90,
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
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
        filter: 'agBooleanColumnFilter',
      },
      {
        headerName: 'Common.StartDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartDate',
        sortable: true,
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
        sortable: true,
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
        sortable: true,
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
        sortable: true,
        filter: 'agBooleanColumnFilter',
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        resizable: true,
        cellRenderer: (params: { value: any; }) => {
          const _type = params.value;
          const typeObject = this.banersTypes?.find((type) => type.Id == _type);

          if (typeObject) {
            return typeObject.Name;
          }
          return _type;
        },
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.banersTypes,
        },

      },
      {
        headerName: 'Common.Visibility',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Visibility',
        resizable: true,
        filter: 'agSelectableFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: Object.keys(BannerVisibilityTypes)
            .filter(key => !isNaN(Number(BannerVisibilityTypes[key])))
            .map(key => ({
              Id: BannerVisibilityTypes[key],
              Name: key,
            }))
          ,
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        minWidth: 50,
        filter: false,
        valueGetter: params => {
          let data = { path: 'banner', queryParams: null };
          data.queryParams = {
            Id: params.data.Id,
          };
          return data;
        },
        sortable: false
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
        // paging.CreatedFrom = this.fromDate;
        // paging.CreatedBefore = this.toDate;
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
        }
        this.changeFilerName(params.request.filterModel,
          ['Body'], ['Bodie']);
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        if (paging.IsEnableds) {
          paging.IsEnabled = paging.IsEnableds.ApiOperationTypeList[0].BooleanValue;
          delete paging.IsEnableds;
        }
        if (paging.Visibilitys) {
          paging.Visibility = paging.Visibilitys.ApiOperationTypeList[0].IntValue;
          delete paging.Visibilitys;
        }
        if (paging.ShowDescriptions) {
          paging.ShowDescription = paging.ShowDescriptions.ApiOperationTypeList[0].BooleanValue;
          delete paging.ShowDescriptions;
        }
        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.CONTENT, Methods.CET_WEB_SITE_BANNERS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject;
              mappedRows.Entities.forEach((payment) => {
                payment['PartnerName'] = this.partners.find((partner) => partner.Id == payment.PartnerId).Name;
                payment.Visibility = payment.Visibility.map(element => {
                  return BannerVisibilityTypes[element]
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

  ngOnDestroy(): void {
    this.bannerService.update(null);
  }

}
