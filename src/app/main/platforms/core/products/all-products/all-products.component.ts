import { Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import 'ag-grid-enterprise';

import { Controllers, Methods, ModalSizes } from 'src/app/core/enums';
import { Paging } from 'src/app/core/models';
import { CommonDataService } from 'src/app/core/services';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { SnackBarHelper } from '../../../../../core/helpers/snackbar.helper';
import { syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { GridOptions } from 'ag-grid-enterprise';
import { ExportService } from "../../services/export.service";

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('bulkMenuTrigger') bulkMenuTrigger: MatMenuTrigger;
  @ViewChild('bulkEditorRef', { read: ViewContainerRef }) bulkEditorRef!: ViewContainerRef;
  rowData = [];
  partnerId: number;
  parentId: number;
  name: string;
  gameProviders: any[] = [];
  productStates: any[] = [];
  languages: any[] = [];
  filteredData;
  frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
  };
  public checkedRowAll: boolean = false;
  active = this.translate.instant("Common.Active");
  inactive = this.translate.instant("Common.Inactive");
  statuses = [
    { Name: `${this.active}`, Id: 1 },
    { Name: `${this.inactive}`, Id: 2 }
  ];
  betId: any;
  gridOptions: GridOptions = {};
  allRowsSelected: boolean;
  selectedRowIds: number[] = [];
  countries: any;
  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private exportService: ExportService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.name = this.activateRoute.snapshot.queryParams.Name;
    this.betId = this.activateRoute.snapshot.queryParams.BetId;
    this.fetchProviders();
    this.getAllProductStates();
    this.featchPageData();
    this.languages = this.commonDataService.languages;
    this.getAllCountries();
    this.getProductStates();
  }

  getProductStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_PRODUCT_STATES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.productStates = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getAllCountries() {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 5 }, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.countries = data.ResponseObject;
        }
      });
  }

  setColdefs() {
    this.columnDefs = [
      {
        field: '',
        minWidth: 50,
        maxWidth: 50,
        checkboxSelection: true,
        filter: false,
        // onSelectionChanged: this.onSelectionChanged()
      },
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
        sortable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Products.ParentId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ParentId',
        resizable: true,
        sortable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Bonuses.Description',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
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
        }
      },
      {
        headerName: 'Products.HasDemo',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'HasDemo',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
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
          filterData: this.statuses,
          suppressAndOrCondition: true
        },
      },
      {
        headerName: 'Products.GameProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderName',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.gameProviders
        },
      },
      {
        headerName: 'Providers.SubProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SubproviderId',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.gameProviders
        },
      },
      {
        headerName: 'Products.IsForDesktop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsForDesktop',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Products.IsForMobile',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsForMobile',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        suppressMenu: true,
        valueGetter: params => {
          let data = { path: 'product', queryParams: null };
          data.queryParams = { ProductId: params.data.Id };
          return data;
        },
        sortable: false
      },
    ];
  }

  onSelectionChanged() {
    const selectedNodes = this.gridOptions.api.getSelectedNodes();
  }

  findId() {
    this.partnerId = this.gameProviders.find((partner) => partner.Name == this.name)?.Id;
  };

  featchPageData() {
    this.activateRoute.queryParams.pipe(take(1)).subscribe(query => {
      this.parentId = query.BetId;
      this.name = query.Name;
      setTimeout(() => {
        this.getCurrentPage();
      }, 50);
    });
  }

  fetchProviders() {
    this.apiService.apiPost(this.configService.getApiUrl, { ParentId: this.betId }, true, Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gameProviders = data.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);

          this.setColdefs();
          this.findId();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  getAllProductStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_PRODUCT_STATES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.productStates = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  async AddProduct() {
    const { AddComponent } = await import('../add/add.component');
    const dialogRef = this.dialog.open(AddComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        productStates: this.productStates,
        languages: this.languages,
        parentProductName: this.name,
        parentId: this.parentId,
        partnerId: this.partnerId,
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
          this.getCurrentPage();
      }
    });
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  redirectToAllProducts() {
    const newUrl = '/main/platform/products/all-products'
    this.reloadPage(newUrl)
  }

  private reloadPage(url: string): void {
    window.location.href = url;
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.ParentId = this.parentId;
        this.changeFilerName(params.request.filterModel,
          ['GameProviderName', 'NickName'], ['GameProviderId', 'Description']);
        this.setSort(params.request.sortModel, paging);
        this.setFilterDropdown(params);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        if (paging.Names) {
          paging.Names.ApiOperationTypeList[0].OperationTypeId = 7
        }

        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.PRODUCT, Methods.GET_PRODUCTS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;
              mappedRows.map((entity) => {
                entity['State'] = this.productStates?.find((partner) => partner.Id == entity.State)?.Name;
                entity['SubproviderId'] = entity.SubproviderName;
                return entity;
              });

              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
            }
          });
      },
    };
  }

  setFilterDropdown(params) {
    const filterModel = params.request.filterModel;
    if (filterModel.SubproviderId && !filterModel.SubproviderId.filter) {
      filterModel.SubproviderId.filter = filterModel.SubproviderId.type;
      filterModel.SubproviderId.type = 1;
    }
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  exportToCsv() {

    this.exportService.exportToCsv(Controllers.PRODUCT, Methods.EXPORT_PRODUCTS, this.filteredData);
  }

  async onBulkEditorOpen() {
    if (this.bulkEditorRef) {
      this.bulkEditorRef.clear();
    }

    if (!this.isRowSelected()) {
      return
    }

    const componentInstance = await import('../products-bulk-editor/products-bulk-editor.component').then(c => c.ProductsBulkEditorComponent);
    const componentRef = this.bulkEditorRef.createComponent(componentInstance);
    componentRef.instance.bulkMenuTrigger = this.bulkMenuTrigger;
    componentRef.instance.Ids = this.gridApi.getSelectedRows().map(field => field.Id);
    componentRef.instance.method = Methods.SAVE_PRODUCTS_COUNTRY_SETTING;
    componentRef.instance.controller = Controllers.PRODUCT;
    componentRef.instance.countries = this.countries;
    componentRef.instance.productStates = this.productStates;
    componentRef.instance.afterClosed.subscribe(() => {
      this.getCurrentPage();
      this.bulkEditorRef.clear();
      this.gridApi.deselectAll();
    });
  }

  isRowSelected() {
    return this.gridApi?.getSelectedRows().length;
  }

  changeCheckboxAll(): void {
    if (this.checkedRowAll) {
      const currentPage = this.gridApi.paginationGetCurrentPage();
      this.gridApi.forEachNode((node) => {
        const skipCount = Math.floor(node.rowIndex / this.cacheBlockSize);
        return node.setSelected(currentPage === skipCount)
      });
      this.selectedRowIds = this.gridApi.getSelectedRows().map(field => field.Id);
    } else {
      this.cleanSelectedRowAll();
    }
  }

  cleanSelectedRowAll(): void {
    this.checkedRowAll = false;
    this.selectedRowIds.length = 0;
    this.gridApi?.forEachNode((node) => node?.setSelected(false));
  }

}
