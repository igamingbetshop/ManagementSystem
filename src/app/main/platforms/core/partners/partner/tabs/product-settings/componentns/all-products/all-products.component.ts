import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

import { mergeMap, take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from "../../../../../../../../components/classes/base-paginated-grid-component";
import {
  AgDropdownFilter
} from "../../../../../../../../components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component";
import {
  AgBooleanFilterComponent
} from "../../../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../../../../components/grid-common/checkbox-renderer.component";
import { SelectRendererComponent } from "../../../../../../../../components/grid-common/select-renderer.component";
import {
  SelectArrayRendererComponent
} from "../../../../../../../../components/grid-common/select-array-renderer.component";
import {
  ArraySelectableEditorComponent
} from "../../../../../../../../components/grid-common/array-selectable-editor/array-selectable-editor.component";
import { CoreApiService } from "../../../../../../services/core-api.service";
import { ConfigService } from "../../../../../../../../../core/services";
import { Controllers, Methods } from "../../../../../../../../../core/enums";
import { SnackBarHelper } from "../../../../../../../../../core/helpers/snackbar.helper";
import { Paging } from "../../../../../../../../../core/models";
import { syncColumnSelectPanel } from "../../../../../../../../../core/helpers/ag-grid.helper";
import { ExportService } from "../../../../../../services/export.service";
import { AGCheckboxSelectedRendererComponent } from 'src/app/main/components/grid-common/ag-checkbox-seected-renderer.component';

@Component({
  selector: 'all-products-settings',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent extends BasePaginatedGridComponent implements OnInit {

  @Output("onUpdate") onUpdate: EventEmitter<any> = new EventEmitter<any>();
  public partnerId: any;
  public partnerName: any;
  public frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    selectRenderer: SelectRendererComponent,
    selectArrayRenderer: SelectArrayRendererComponent,
    arraySelectableEditorComponent: ArraySelectableEditorComponent,
    aGCheckboxSelectedRendererComponent: AGCheckboxSelectedRendererComponent
  };
  public columnDefs = [];
  public rowData = [];
  public filteredDataAll;
  public statuses = [];
  public selectedRowIds: number[] = [];
  public formGroup: UntypedFormGroup;
  public productCategories = [];
  public gameProviders = [];
  public rowSelection = 'multiple';
  public checkedRowAll: boolean = false;
  public autoGroupColumnDef;
  public subProvidersTypesArray = [];
  public subProvidersTypesEnum;

  constructor(
    private apiService: CoreApiService,
    private fb: UntypedFormBuilder,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    protected injector: Injector,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private exportService: ExportService,
    private _snackBar: MatSnackBar) {
    super(injector);
    this.autoGroupColumnDef = {
      headerName: 'BetShops.Group',
      headerValueGetter: this.localizeHeader.bind(this),
      minWidth: 170,
      field: 'athlete',
      valueGetter: function (params) {
        if (params.node.group) {
          return params.node.key;
        } else {
          return params.data[params.colDef.field];
        }
      },
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: { checkbox: true },
    };
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.formValues();
    this.getAllProductStates();
    this.mergeProductApi();
  }

  getAllProductStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_PRODUCT_STATES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.statuses = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  mergeProductApi() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.PRODUCT, Methods.GET_PRODUCT_CATEGORIES)
      .pipe(
        mergeMap(data => {
          if (data.ResponseCode === 0) {
            this.productCategories = data.ResponseObject;
          }
          return this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: this.partnerId }, true, Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS);
        }))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gameProviders = data.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
        }
        this.subProvidersTypesEnum = this.setEnum(this.gameProviders);
        this.setColumnDefs();
      });
  }

  setColumnDefs() {
    this.columnDefs = [
      {
        field: '',
        minWidth: 50,
        maxWidth: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        filter: false,
        menuTabs: false
      },
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Bonuses.Description',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductDescription',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Products.GameProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderId',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.gameProviders
        },
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
        headerName: 'Providers.SubProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SubproviderId',
        sortable: true,
        resizable: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          values: this.gameProviders.map((item) => item.Name),
        },

      },
      {
        headerName: 'Products.Jackpot',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Jackpot',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Products.HasImage',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'HasImage',
        sortable: false,
        resizable: true,
        cellRenderer: this.imageCheckRenderer.bind(this),
        filter: 'agBooleanColumnFilter',
      },
      {
        headerName: 'Products.IsForDesktop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsForDesktop',
        sortable: true,
        resizable: true,
        filter: 'agBooleanColumnFilter',
        cellRenderer: 'aGCheckboxSelectedRendererComponent',

      },
      {
        headerName: 'Products.IsForMobile',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsForMobile',
        sortable: true,
        resizable: true,
        filter: 'agBooleanColumnFilter',
        cellRenderer: 'aGCheckboxSelectedRendererComponent',
      },
    ]
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  imageCheckRenderer(params: any): string {
    const hasImage = params.data.MobileImageUrl || params.data.DesktopImageUrl;
    return hasImage ? this.translate.instant('Products.HasImage') : this.translate.instant('Products.NoImage');
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.PartnerId = +this.partnerId;
        this.gridApi.deselectAll();
        this.selectedRowIds = [];
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        if (paging.HasImages) {
          paging.HasImages = paging.HasImages.ApiOperationTypeList[0].BooleanValue;
        } 
        if (paging.IsForMobiles) {
          paging.IsForMobile = paging.IsForMobiles.ApiOperationTypeList[0].BooleanValue;
          delete paging.IsForMobiles;
        }
        if (paging.IsForDesktops) {
          paging.IsForDesktop = paging.IsForDesktops.ApiOperationTypeList[0].BooleanValue;
          delete paging.IsForDesktops;
        }
        if (paging.HasDemos) {
          paging.HasDemo = paging.HasDemos.ApiOperationTypeList[0].BooleanValue;
          delete paging.HasDemos;
        }

        this.filteredDataAll = { ...paging };
        if (this.filteredDataAll.SubproviderIds?.ApiOperationTypeList[0].ArrayValue.length === 0) {
          params.success({ rowData: [], rowCount: 0 });
          return;
        }
        if (this.filteredDataAll.SubproviderIds) {
          this.filteredDataAll.SubproviderIds.ApiOperationTypeList[0].ArrayValue = this.transformArrayToNumbers(this.filteredDataAll.SubproviderIds.ApiOperationTypeList[0].ArrayValue, this.subProvidersTypesEnum);
        }



        console.log(paging, 'paging');

        this.apiService.apiPost(this.configService.getApiUrl, this.filteredDataAll, true,
          Controllers.PRODUCT, Methods.GET_PARTNER_PRODUCTS).pipe(take(1)).subscribe((data) => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities.map((items) => {
                items.ProductName = items.Name;
                items.ProductDescription = items.Description;
                items['GameProviderId'] = items.GameProviderName;
                items['State'] = this.statuses.find((item => item.Id === items.State))?.Name;
                items['SubproviderId'] = items.SubproviderName;
                return items;
              })
              this.checkedRowAll = false;
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }

          });
      }
    }
  }


  onSelectChange(params, val, event) {
    params.State = val;
  }

  onRowClicked(params) {
    this.selectedRowIds = params.api.getSelectedRows().map(field => field.Id);
    this.formGroup.enable();
  }

  onRowSelected(params) {
    const isSelectedRow = params.api.getSelectedRows().length !== 0;
    if (isSelectedRow) {
      this.selectedRowIds = params.api.getSelectedRows().map(field => field.Id);
      this.formGroup.enable();
    } else {
      this.formGroup.disable();
    }
  }

  onCheckBoxChange(params, val, event) {
    params.IsForDesktop = val;
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  }

  addProductToPartner() {
    const setting = this.formGroup.getRawValue();
    setting.PartnerId = +this.partnerId;
    setting.ProductIds = this.selectedRowIds;
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PRODUCT, Methods.SAVE_PARTNER_PRODUCT_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.cleanSelectedRowAll();
          this.gridApi.refreshServerSide({ purge: true });
          this.onUpdate.emit(true);
          this.formGroup.reset();
          SnackBarHelper.show(this._snackBar, { Description: 'Added successfully', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  private formValues() {
    this.formGroup = this.fb.group({
      Percent: [null, [Validators.required]],
      Rating: [null],
      OpenMode: [null],
      CategoryIds: [[null], [Validators.required]],
      State: [null, [Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
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

  onPaginationChanged(event): void {
    super.onPaginationChanged(event);
    this.cleanSelectedRowAll();
  }

  cleanSelectedRowAll(): void {
    this.checkedRowAll = false;
    this.selectedRowIds.length = 0;
    this.gridApi?.forEachNode((node) => node?.setSelected(false));
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  exportToCsv() {

    this.exportService.exportToCsv(Controllers.PRODUCT, Methods.EXPORT_PARTNER_PRODUCTS, this.filteredDataAll);
  }

  update() {
    this.gridApi.refreshServerSide({ purge: true })
  }

  transformArrayToNumbers(array, obj) {
    if (array.every(function (element) {
      return typeof element === 'number';
    })) {
      return array
    }
    const result = [];
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      const key = Object.keys(obj).find((key) => obj[key] === item);
      if (key) {
        result.push(Number(key));
      }
    }
    return result;
  }

}
