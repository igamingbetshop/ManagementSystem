import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

import { take } from "rxjs/operators";
import { IRowNode } from "ag-grid-community";
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
import { SelectRendererComponent } from "../../../../../../../../components/grid-common/select-renderer.component";
import { CheckboxRendererComponent } from "../../../../../../../../components/grid-common/checkbox-renderer.component";
import {
  SelectArrayRendererComponent
} from "../../../../../../../../components/grid-common/select-array-renderer.component";
import {
  ArraySelectableEditorComponent
} from "../../../../../../../../components/grid-common/array-selectable-editor/array-selectable-editor.component";
import { CoreApiService } from "../../../../../../services/core-api.service";
import { ConfigService } from "../../../../../../../../../core/services";
import { Controllers, Methods, ModalSizes } from "../../../../../../../../../core/enums";
import { Paging } from "../../../../../../../../../core/models";
import { SnackBarHelper } from "../../../../../../../../../core/helpers/snackbar.helper";
import { forkJoin } from 'rxjs';
import {ExportService} from "../../../../../../services/export.service";
import { AGCheckboxSelectedRendererComponent } from 'src/app/main/components/grid-common/ag-checkbox-seected-renderer.component';


@Component({
  selector: 'partner-products',
  templateUrl: './partner-products.component.html',
  styleUrls: ['./partner-products.component.scss']
})
export class PartnerProductsComponent extends BasePaginatedGridComponent implements OnInit {
  @Output("onRequireHistoryUpdate") onRequireHistoryUpdate: EventEmitter<number> = new EventEmitter<number>();
  public partnerId;
  public partnerName;
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
  public selectedRowIds: number[] = [];
  public rowData = [];
  public columnDefs: any = [];
  public filteredData;
  public selectedChangeCheckbox = false;
  public subProvidersTypesEnum;
  public statuses = [];
  public formGroup: UntypedFormGroup;
  public productCategories = [];
  public gameProviders = [];
  public rowSelection = 'multiple';
  public autoGroupColumnDef;
  public checkedRow: boolean = false;
  public subproviderIdFilterState: any;

  constructor(
    private apiService: CoreApiService,
    private fb: UntypedFormBuilder,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    protected injector: Injector,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private exportService:ExportService,
    private _snackBar: MatSnackBar) {
    super(injector);
  }

  ngOnInit(): void {
    this.getAllProductStates();
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.formValues();
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
    const getProductCategories$ = this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.PRODUCT, Methods.GET_PRODUCT_CATEGORIES);
    const getGameProviders$ = this.apiService.apiPost(this.configService.getApiUrl, { SettingPartnerId: this.partnerId }, true, Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS);

    forkJoin([getProductCategories$, getGameProviders$])
      .pipe(take(1)) // Take the first emitted value and complete the observable
      .subscribe(([productCategoriesData, gameProvidersData]) => {
        if (productCategoriesData.ResponseCode === 0) {
          this.productCategories = productCategoriesData.ResponseObject;
        }

        if (gameProvidersData.ResponseCode === 0) {
          this.gameProviders = gameProvidersData.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
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
        editable: true,
        hide: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Clients.ProductId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductId',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Products.ProductName',
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
        headerName: 'Products.ProductDescription',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductDescription',
        sortable: true,
        resizable: true,
        editable: true,
        hide: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Products.GameProvider',
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
        editable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.statuses,
          suppressAndOrCondition: true
        },
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this, "State"),
          Selections: this.statuses,
        },
      },
      {
        headerName: 'Bonuses.Percent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Percent',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Partners.Rating',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Rating',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Products.CategoryIds',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryIds',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.productCategories
        },
        cellEditor: ArraySelectableEditorComponent,
        cellEditorParams: (params: any) => ({
          options: this.productCategories,
        }),
        cellRenderer: 'selectArrayRenderer',
        cellRendererParams: {
          Selections: this.productCategories,
        },
      },
      {
        headerName: 'Providers.SubProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SubproviderId',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          values: this.gameProviders.map((item) => item.Name),
        },
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this, "SubproviderId"),
          Selections: this.gameProviders,
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
        headerName: 'Partners.OpenMode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OpenMode',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Products.HasDemo',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'HasDemo',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agBooleanColumnFilter',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onchange: this.onCheckBoxChange['bind'](this, "HasDemo"),
          onCellValueChanged: this.onCheckBoxChange.bind(this)['bind'](this, "HasDemo")
        }
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
      {
        headerName: 'Products.RTP',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RTP',
        sortable: false,
        resizable: true,
      },
      {
        headerName: 'Products.Volatility',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Volatility',
        hide: true,
        sortable: false,
        resizable: true,
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 90,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveProductSettings['bind'](this),
          Label: 'Save',
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      }
    ]
  }

  onGridReady(params) {
    super.onGridReady(params);
    const agColumnSelect = document.querySelector('#partner-products .ag-tool-panel-wrapper .ag-column-select');
    const matExportBtn = document.querySelector('.mat-export-btn-partner');
    agColumnSelect.prepend(matExportBtn);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  imageCheckRenderer(params: any): string {
    const hasImage = params.data.MobileImageUrl || params.data.DesktopImageUrl;
    return hasImage ? this.translate.instant('Products.HasImage') : this.translate.instant('Products.NoImage');
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
        this.changeFilerName(params.request.filterModel, ['CategoryIds'], ['CategoryId']);
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        if (paging.CategoryIds) {
          paging.CategoryIds = paging.CategoryIds.ApiOperationTypeList[0].IntValue;
        }
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

        this.filteredData = { ...paging };

        if(this.filteredData.SubproviderIds?.ApiOperationTypeList[0].ArrayValue.length === 0) {
          params.success({ rowData: [], rowCount: 0 });
          return;
        }
        if(this.filteredData.SubproviderIds) {
          this.filteredData.SubproviderIds.ApiOperationTypeList[0].ArrayValue = this.transformArrayToNumbers(this.filteredData.SubproviderIds.ApiOperationTypeList[0].ArrayValue, this.subProvidersTypesEnum);
        }

        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.PRODUCT, Methods.GET_PARTNER_PRODUCT_SETTINGS).pipe(take(1)).subscribe((data) => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities
              .map((items) => {
                items['GameProviderId'] = items.GameProviderName;
                return items;
              });
              this.checkedRow = false;
              this.cleanSelectedRow();
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    }
  }

  onSelectChange(key, params, val, event) {
    params[key] = val;
    this.onCellValueChanged(event);
  }

  saveProductSettings(params) {
    const row = params.data;
    row.PartnerName = this.partnerName;
    row.ProductIds = [
      row.ProductId
    ]
    delete row.CategoryName;
    this.apiService.apiPost(this.configService.getApiUrl, row, true,
      Controllers.PRODUCT, Methods.SAVE_PARTNER_PRODUCT_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.gridApi.deselectAll();
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.gridApi.refreshServerSide({ purge: true });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onRowSelected(params) {
    const isSelectedRow = params.api.getSelectedRows().length !== 0;
    this.selectedRowIds = params.api.getSelectedRows().map(field => field.Id);
    if (isSelectedRow && !this.selectedChangeCheckbox) {
      this.rowClicked(params);
    }
  }

  onCheckBoxChange(key, params, val, event) {
    params[key] = val;
    this.onCellValueChanged(event);
  }

  rowClicked(params) {
    this.formGroup.enable();
    this.onRequireHistoryUpdate.emit(params.data.Id);
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  deleteProduct() {
    const setting = {
      PartnerId: +this.partnerId,
      ProductIds: this.getSelectedProductIds()
    }
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PRODUCT, Methods.REMOVE_PARTNER_PRODUCT_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.gridApi.refreshServerSide({ purge: true });
          SnackBarHelper.show(this._snackBar, { Description: 'Deleted successfully', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  async copyPartnerSettings() {
    const { CopySettingsComponent } = await import('../../../copy-settings/copy-settings.component');
    const dialogRef = this.dialog.open(CopySettingsComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        lable: "Partners.CopyProductSettings",
        method: "COPY_PARTNER_PRODUCT_SETTING"
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        // this.getWebsiteMenus();
      }
    });
  }

  updateProduct() {
    if (!this.formGroup.valid) {
      return;
    }
    const setting = this.formGroup.getRawValue();

    setting.PartnerId = +this.partnerId;
    setting.ProductIds = this.getSelectedProductIds();
    if (setting.Percent === null) {
      delete setting.Percent;
    }

    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PRODUCT, Methods.SAVE_PARTNER_PRODUCT_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.gridApi.refreshServerSide({ purge: true });
          this.gridApi.deselectAll();
          this.formGroup.reset();
          SnackBarHelper.show(this._snackBar, { Description: 'Updated successfully', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  private formValues() {
    this.formGroup = this.fb.group({
      Percent: [null],
      Rating: [null],
      OpenMode: [null],
      RTP: [null],
      CategoryIds: [[]],
      State: [null, [Validators.required]],
    })
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  get errorControl2() {
    return this.formGroup.controls;
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.gridApi.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
  }

  changeCheckbox(): void {
    this.selectedChangeCheckbox = !this.selectedChangeCheckbox;
    if (this.checkedRow) {
      const currentPage = this.gridApi.paginationGetCurrentPage();
      this.gridApi.forEachNode((node) => {
        const skipCount = Math.floor(node.rowIndex / this.cacheBlockSize);
        return node.setSelected(currentPage === skipCount)
      });
    } else {
      this.cleanSelectedRow();
    }
  }

  onPaginationChanged(event): void {
    super.onPaginationChanged(event);
      this.cleanSelectedRow();
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => {
      this.gridApi.refreshServerSide({ purge: true });
    }, 100);
  }

  cleanSelectedRow(): void {
    this.checkedRow = false;
    this.gridApi?.forEachNode((node) => node?.setSelected(false));
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  exportToCsv() {
    this.exportService.exportToCsv( Controllers.PRODUCT, Methods.EXPORT_PARTNER_PRODUCT_SETTINGS, this.filteredData);
  }

  getSelectedProductIds(): number[] {
    return this.gridApi.getSelectedRows().map(field => field.ProductId);
  }

  update() {
    this.gridApi.refreshServerSide({ purge: true });
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
