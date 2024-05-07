import { Directive, Injector, OnDestroy, OnInit } from "@angular/core";
import { ConfigService, LocalStorageService } from "../../../core/services";
import { ActivatedRoute, Router } from "@angular/router";
import { FilterService } from "../../../core/services/filter.service";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { Filter } from "../../../core/models/filter";
import { isEmpty } from "../../../core/utils";
import { ColumnMovedEvent, ColumnPinnedEvent, ColumnResizedEvent, ColumnVisibleEvent, GetContextMenuItemsParams, GridApi, ICellRendererParams, MenuItemDef, } from "ag-grid-community";
import { Subject, Subscription } from "rxjs";
import { debounceTime, delay, take } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { CoreApiService } from "../../platforms/core/services/core-api.service";
import { Controllers, Methods } from "src/app/core/enums";

@Directive()
export class BaseGridComponent implements OnInit, OnDestroy {
  public gridStateName: string;
  public gridApi: GridApi;
  public columnApi: any;
  public enableBrowserTooltips: boolean = true;
  public adminMenuId;
  public gridIndex = 0;
  public subscription: Subscription = new Subscription();
  private previousState: any = null;

  public sideBar:any = {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
        toolPanelParams: {
          suppressPivots: true,
          suppressPivotMode: true,
          suppressRowGroups: true,
          suppressValues: true,
        }
      }
    ],
    defaultToolPanel: "columns"
  };

  public columnDefs;
  public defaultColDef:any;
  public dateRangeFG: UntypedFormGroup;
  public loadingUserState = true;

  protected configService: ConfigService;
  protected router: Router;
  protected route: ActivatedRoute;
  protected filterService: FilterService;
  protected localstorageService: LocalStorageService;
  protected translate: TranslateService;

  protected coreApiService: CoreApiService;

  private saveStateSbj$: Subject<void> = new Subject();
  public columnStateSubject$ = new Subject<any>();

  constructor(
    protected injector: Injector,
  ) {
    this.configService = injector.get(ConfigService);
    this.router = injector.get(Router);
    this.route = injector.get(ActivatedRoute);
    this.filterService = injector.get(FilterService);
    this.localstorageService = injector.get(LocalStorageService);
    this.translate = injector.get(TranslateService);

    this.coreApiService = injector.get(CoreApiService);

    this.defaultColDef = {
      flex: 1,
      editable: false,
      filter: 'agTextColumnFilter',
      resizable: true,
      unSortIcon: false,
      copyHeadersToClipboard: true,
      menuTabs: [
        'filterMenuTab',
        'generalMenuTab',
      ],
      minWidth: 15,
    };

    this.dateRangeFG = new UntypedFormGroup({
      start: new UntypedFormControl(),
      end: new UntypedFormControl()
    });
  }

  ngOnInit() { }

  onGridReady(params) {

    if (!!this.adminMenuId) {
      this.saveStateSbj$.pipe(debounceTime(1000)).subscribe(() => {
        if (!isFirstInvocation) {
          this.saveState();
        }
        isFirstInvocation = false;
      });
      this.getUserState();
    } else {
      this.loadingUserState = true;
    }
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.closeToolPanel();

    this.restoreSavedGridState();
    let isFirstInvocation = true;
  }

  getUserState() {
    this.coreApiService.apiPost(
      this.configService.getApiUrl,
      {
        AdminMenuId: this.adminMenuId,
        GridIndex: this.gridIndex
      },
      true,
      Controllers.USER,
      Methods.GET_USER_STATE
    )
      .pipe(
        take(1),
        delay(300)
      )
      .subscribe(
        (data) => {
          if (data.ResponseCode === 0) {
            const columnState = JSON.parse(data.ResponseObject);
            if (columnState) {
              try {
                this.columnApi.applyColumnState({
                  state: columnState,
                  applyOrder: true,
                });
              } catch (error) {
                console.error("Error applying column state:", error);
                // If applying column state fails, you may want to handle it appropriately
              } finally {
                // Set the loading flag to false after processing
                setTimeout(() => {
                  this.loadingUserState = false;
                }, 300);
              }
            } else {
              // Handle the case where there is no column state data
              console.warn("No column state data found.");
              setTimeout(() => {
                this.columnApi.resetColumnState();
                this.gridApi.closeToolPanel();
                this.loadingUserState = false;
              }, 0);
            }
          } else {
            console.error("Error fetching user state:", data.ResponseMessage);
            // If there's an error, you might want to handle it appropriately
            // For example, display an error message, log the error, etc.
            // Additionally, set the loading flag to false here if necessary
            this.loadingUserState = false;
          }
        },
        (error) => {
          console.error("HTTP request failed:", error);
          // Handle the HTTP request error here if necessary
          // For example, display an error message, log the error, etc.
          // Additionally, set the loading flag to false here if necessary
          this.loadingUserState = false;
        }
      );
  }


  saveState() {
    const currentSavedState = this.columnApi.getColumnState();
    const currentSavedStateObj = JSON.parse(JSON.stringify(currentSavedState));
    const previousStateObj = JSON.parse(JSON.stringify(this.previousState));

    if (this.deepEqual(currentSavedStateObj, previousStateObj)) {
      return;
    }

    this.previousState = currentSavedState;

    this.coreApiService.apiPost(this.configService.getApiUrl, {
      "AdminMenuId": this.adminMenuId,
      "GridIndex": this.gridIndex,
      "State": JSON.stringify(currentSavedState)
    }, true, Controllers.USER, Methods.UPDATE_USER_STATE).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        // Handle successful state update
      } else {
        // Handle state update error
      }
    });
  }

  deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }


  resetState() {
    this.columnApi.resetColumnState();
    this.gridApi.closeToolPanel();
  }

  getCurrentPage() {
    this.gridApi?.refreshServerSide({ purge: true });
  }

  onColumnResized(event: ColumnResizedEvent) {
    this.saveStateSbj$.next();
  }

  onColumnVisible(event: ColumnVisibleEvent) {
    this.saveStateSbj$.next();
  }

  onColumnPinned(event: ColumnPinnedEvent) {
    this.saveStateSbj$.next();
  }

  onColumnMoved(event: ColumnMovedEvent) {
    this.saveStateSbj$.next();
  }

  protected setFilter(filterModel, appendObj) {

    if (!isEmpty(filterModel)) {
      Object.entries(filterModel).forEach(([key, value]) => {
        const pluralKey = key + 's';
        appendObj[pluralKey] = {};
        appendObj[pluralKey]['ApiOperationTypeList'] = [];
        appendObj[pluralKey]['IsAnd'] = this.getIsAnd(value['operator']);
        if (value.hasOwnProperty('condition1')) {
          appendObj[pluralKey]['ApiOperationTypeList'].push(this.mapFilterData(value['condition1']));
          appendObj[pluralKey]['ApiOperationTypeList'].push(this.mapFilterData(value['condition2']));
        } else if (value['ApiOperationTypeList']?.length === 0) {
          return
        } else {
          appendObj[pluralKey]['ApiOperationTypeList'].push(this.mapFilterData(value as Filter));
        }
      });
    }

    // this.setDateFilter(appendObj);
  }

  getIsAnd(operator) {
    if (!!operator) {
      return operator === 'AND';
    }
    return true;
  }

  protected setSort(sortModel, appendObj, name = 'OrderBy' ) {
    if (sortModel && sortModel.length) {
      appendObj[name] = sortModel[0].sort === 'asc' ? 0 : 1;
      appendObj.FieldNameToOrderBy = sortModel[0].colId;
    } else {
      appendObj[name] = null;
      appendObj.FieldNameToOrderBy = '';
    }
  }

  protected mapFilterData(filter: Filter): any {
    const appendedFilter = {};
    appendedFilter['OperationTypeId'] = filter.type;
    switch (filter.filterType) {
      case 'number':
        appendedFilter['DecimalValue'] = filter.filter;
        appendedFilter['IntValue'] = filter.filter;
        break;
      case 'text':
        appendedFilter['StringValue'] = filter.filter;
        break;
      case 'date':
        appendedFilter['DateTimeValue'] = filter.dateFrom;
        break;
      case 'boolean':
        appendedFilter['BooleanValue'] = filter.filter === 1;
        break;
      case 'set':
        appendedFilter['OperationTypeId'] = 11;
        appendedFilter['ArrayValue'] = filter.values;
        break;
    }
    return appendedFilter;
  }

  private setDateFilter(appendObj) {
    const startDate = this.dateRangeFG.get('start').value;
    const endDate = this.dateRangeFG.get('end').value;
    appendObj.StartDate = startDate ? startDate : undefined;
    appendObj.EndDate = endDate ? endDate : undefined;
  }

  private restoreSavedGridState() {
    const savedState = this.localstorageService.get(this.gridStateName);
    if (savedState) {
      this.columnApi.applyColumnState({
        state: savedState,
        applyOrder: true,
      });
    }
  }

  setFilterDropdown(params, filterNames) {
    const filterModel = params.request.filterModel;

    for (const name of filterNames) {
      if (filterModel[name] && !filterModel[name].filter) {

        if (filterModel[name].hasOwnProperty('condition1')) {
          filterModel[name].condition1.filter = filterModel[name].condition1.type;
          filterModel[name].condition2.filter = filterModel[name].condition2.type;
          filterModel[name].condition1.type = 1;
          filterModel[name].condition2.type = 1;
        } else {
          filterModel[name].filter = filterModel[name].type;
          filterModel[name].type = 1;
        }
      }
    }
  }

  changeFilerName(filterModel, oldFieldNames, newFieldNames) {
    for (let i = 0; i < oldFieldNames.length; i++) {
      const oldFieldName = oldFieldNames[i];
      const newFieldName = newFieldNames[i];
      if (filterModel[oldFieldName]) {
        filterModel[newFieldName] = filterModel[oldFieldName];
        delete filterModel[oldFieldName];
      }
    }
  }

  localizeHeader(parameters: ICellRendererParams): string {
    let headerIdentifier = parameters.colDef.headerName;
    return this.translate.instant(headerIdentifier) || "";
  }

  onColumnStateChange() {
    const columnState = this.columnApi.getColumnState();
    this.columnStateSubject$.next(columnState);
  }

  setEnum(data) {
    const result = {}
    for (const item of data) {
      result[item.Id] = item.NickName || item.Name;
    }
    return result;
  }

  ngOnDestroy(): void {
    this.columnStateSubject$.unsubscribe();
  }

  getContextMenuItems(params: GetContextMenuItemsParams): (string | MenuItemDef)[] {
    return ['copy'];
  }

}
